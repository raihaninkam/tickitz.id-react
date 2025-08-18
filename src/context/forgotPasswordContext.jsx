import { ForgotContext } from "./ForgotPassword"

export const ForgotPasswordProvider = ({ children }) => {
  // Fungsi untuk ubah password di localStorage
  const changePassword = (email, newPassword) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Cari user berdasarkan email
    const userExists = users.find((user) => user.email === email);

    if (!userExists) {
      return { success: false, message: "Email tidak terdaftar!" };
    }

    // Update password user yang sesuai
    const updatedUsers = users.map((user) =>
      user.email === email ? { ...user, password: newPassword } : user
    );

    // Simpan kembali ke localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    return { success: true, message: "Password berhasil diubah!" };
  };

  return (
    <ForgotContext.Provider value={{ changePassword }}>
      {children}
    </ForgotContext.Provider>
  );
};

// Custom hook supaya gampang dipakai
// export const useForgotPassword = () => useContext(ForgotPasswordContext);
export default ForgotPasswordProvider;
