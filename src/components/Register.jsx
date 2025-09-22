// import { useState } from "react";
import { Link } from "react-router";
// import { useAuth } from "../hooks/useAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { usePasswordVisibility } from "../hooks/usePasswordVisibility";
import { registerValidationRules } from "../utils/validationRules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  //   const { registerUser } = useAuth();
  const { showPassword, togglePassword } = usePasswordVisibility();
  //   const [isRegistered, setIsRegistered] = useState(false);
  // const [token, setToken] = useState("")

  const { formData, errors, handleChange, reset, setError } = useFormValidation(
    {
      email: "",
      password: "",
      terms: false,
    },
    registerValidationRules
  );

  const handleRegister = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const pwd = event.target.password.value;

    if (email.length === 0 || pwd.length === 0) {
      setError("Email dan Password harus diisi!");
      return;
    }

    const body = {
      email,
      password: pwd,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BE_HOST}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        toast.error(`Registrasi gagal: ${errMsg}`);
        return;
      }

      const data = await response.json();
      toast.success("Registrasi berhasil! Silakan login.");
      console.log("Registrasi berhasil:", data);

      //   setIsRegistered(true);
      reset();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan server.");
    }
  };

  return (
    <div className="min-h-screen bg-[url(/sign-up.svg)] bg-cover bg-center overflow-y-hidden">
      {/* Logo */}
      <div className="flex justify-center pt-12 pb-4">
        <img src="/tickitz white.svg" alt="" />
      </div>

      {/* Main Container */}
      <main className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md mt-4 z-10">
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex justify-between w-full max-w-xs relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>

              {/* Step 1 - Active */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 font-bold text-sm">
                  1
                </div>
                <div className="text-xs font-medium">Fill Form</div>
              </div>

              {/* Step 2 - Inactive */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center mb-1 font-bold text-sm">
                  2
                </div>
                <div className="text-xs font-medium">Activate</div>
              </div>

              {/* Step 3 - Inactive */}
              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center mb-1 font-bold text-sm">
                  3
                </div>
                <div className="text-xs font-medium">Done</div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister}>
            {/* Email Field */}
            <div className="mb-5">
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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:border-blue-500 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-gray-700 font-medium"
              >
                Password
              </label>
              <div
                className={`flex items-center border rounded-md pr-2 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm border-none outline-none"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-3"
              />
              <label htmlFor="terms" className="text-gray-600 text-sm">
                I agree to terms & conditions
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm -mt-4 mb-4">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700"
            >
              Join For Free Now
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center my-5 text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-blue-500 no-underline font-medium"
            >
              Log in
            </Link>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mt-5">
            <button
              type="button"
              className="px-5 py-2.5 border border-gray-300 rounded-md bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="px-5 py-2.5 border border-gray-300 rounded-md bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Register;
