import { useState } from "react";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changePassword = async (email, oldPassword, newPassword) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/profile/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            old_password: oldPassword,
            new_password: newPassword,
            // Hapus confirm_password karena tidak digunakan di backend
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Password successfully updated!",
        };
      } else {
        return {
          success: false,
          message: data.error || "Failed to change password",
        };
      }
    } catch (error) {
      console.error("Error changing password:", error);
      return {
        success: false,
        message: "An error occurred while changing password",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setMessage({ type: "", text: "" });

    if (!validate()) {
      setMessage({
        type: "error",
        text: "Please fill all fields correctly.",
      });
      return;
    }

    const result = await changePassword(
      formData.email,
      formData.oldPassword,
      formData.newPassword
    );

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message,
      });
      // Reset form
      setFormData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Auto redirect simulation
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setMessage({
        type: "error",
        text: result.message,
      });
    }
  };

  const handleBackToLogin = () => {
    // Reset form and messages
    setFormData({
      email: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[url(/sign-up.svg)] overflow-y-hidden bg-cover bg-center p-4">
      {/* Logo */}
      <div className="flex justify-center pt-8 pb-4">
        <img src="/tickitz white.svg" alt="Tickitz Logo" />
      </div>

      {/* Main Container */}
      <main className="flex justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Change Password 🔐
            </h1>
            <p className="text-gray-500">
              Enter your email and passwords to change your account password
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : message.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Change Password Form */}
          <div>
            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 text-white rounded-md text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Processing..." : "Change Password"}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <button
                onClick={handleBackToLogin}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
