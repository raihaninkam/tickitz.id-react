import { useState } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
    const navigate = useNavigate()
    // State untuk menampung nilai input form (email dan password)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State untuk menampung pesan error validasi
    const [errors, setErrors] = useState({});

    // State untuk mengontrol visibilitas password (true = terlihat, false = tersembunyi)
    const [showPassword, setShowPassword] = useState(false);

    // Fungsi untuk mendapatkan data user yang terdaftar dari localStorage
    const getRegisteredUsers = () => {
        try {   
            // Ambil data dari localStorage
            const storedUsers = localStorage.getItem('registeredUsers');
            
            // Jika tidak ada data di localStorage, return array kosong
            if (!storedUsers) {
                console.log('Tidak ada data user terdaftar di localStorage');
                return [];
            }
            
            return JSON.parse(storedUsers);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    // Fungsi untuk mengelola perubahan pada input form
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error saat user mulai mengetik
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
        
        // Clear general error saat user mulai mengetik
        if (errors.general) {
            setErrors({
                ...errors,
                general: ''
            });
        }
    };

    // Fungsi untuk mengubah status visibilitas password
    const eyePwd = () => {
        setShowPassword(!showPassword);
    };

    // Fungsi untuk memvalidasi input form sebelum submit
    const validateForm = () => {
        let newErrors = {};
        const { email, password } = formData;

        // Validasi Email: tidak boleh kosong dan harus format email yang valid
        if (!email.trim()) {
            newErrors.email = "Email tidak boleh kosong.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Format email tidak valid.";
        }

        // Validasi Password: tidak boleh kosong
        if (!password.trim()) {
            newErrors.password = "Password tidak boleh kosong.";
        }

        // Memperbarui state errors dengan pesan error yang ditemukan
        setErrors(newErrors);
        // Mengembalikan true jika tidak ada error (objek newErrors kosong), false jika ada
        return Object.keys(newErrors).length === 0;
    };

    // Fungsi untuk memvalidasi login dengan data dari localStorage
    const validateLogin = (email, password) => {
        // Ambil data users dari localStorage
        const users = getRegisteredUsers();
        
        // Cek apakah ada user yang terdaftar
        if (users.length === 0) {
            return {
                success: false,
                message: "User Not Found."
            };
        }
        
        // Cari user berdasarkan email (case insensitive)
        const foundUser = users.find(user => 
            user.email && user.email.toLowerCase() === email.toLowerCase()
        );
        
        // Jika email tidak ditemukan
        if (!foundUser) {
            return {
                success: false,
                message: "Email not found."
            };
        }
        
        // Jika password tidak sesuai
        if (foundUser.password !== password) {
            return {
                success: false,
                message: "Password incorrect."
            };
        }
        
        // Login berhasil
        return {
            success: true,
            user: foundUser,
            message: "Login berhasil!"
        };
    };

    // Fungsi untuk menyimpan session user yang login
    const saveUserSession = (user) => {
        try {
            const sessionData = {
                id: user.id,
                email: user.email,
                name: user.name || user.fullName || '',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(sessionData));
            console.log('User session berhasil disimpan:', sessionData);
            return true;
        } catch (error) {
            console.error('Error menyimpan session user:', error);
            return false;
        }
    };

    // Fungsi untuk menangani submit form login
    const handleLogin = (event) => {
        event.preventDefault(); // Mencegah refresh halaman default

        // Reset errors sebelum validasi
        setErrors({});

        // Validasi input form
        if (!validateForm()) {
            console.log("Validasi form gagal");
            return;
        }

        const { email, password } = formData;
        
        // Validasi login dengan data dari localStorage
        const loginResult = validateLogin(email, password);
        
        if (loginResult.success) {
            console.log("Login berhasil untuk user:", loginResult.user);
            
            // Simpan session user
            const sessionSaved = saveUserSession(loginResult.user);
            
            if (sessionSaved) {
                // Tampilkan pesan sukses
                alert(loginResult.message);
                
                // Reset form
                setFormData({
                    email: '',
                    password: '',
                });
                
                // Redirect ke halaman home
                navigate("/Home");
            } else {
                setErrors({
                    general: "Terjadi kesalahan saat menyimpan session. Silakan coba lagi."
                });
            }
        } else {
            // Tampilkan pesan error
            console.log("Login gagal:", loginResult.message);
            setErrors({
                general: loginResult.message
            });
        }
    };

    return (
        <div className="min-h-screen bg-[url(sign-up.svg)] overflow-y-hidden bg-cover bg-center">
            {/* Logo */}
            <div className="flex justify-center pt-12 pb-4">
                <div>
                    <img src="tickitz 1.svg" alt="" />
                </div>
            </div>

            {/* Main Container */}
            <main className="flex justify-center mb-8">
                <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md mt-4 z-10">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h1>
                        </div>
                        <div className="text-gray-400">
                            <p>Sign in with your data that you entered during your registration</p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        {/* General Error Message */}
                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="mb-5">
                            <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
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
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {/* Menampilkan pesan error jika ada */}
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-5">
                            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
                                Password
                            </label>
                            <div className={`flex items-center border rounded-md ${
                                errors.password ? 'border-red-300' : 'border-gray-300'
                            }`}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 text-sm border-none outline-none"
                                />
                                {/* Ikon mata yang dapat diklik untuk mengubah visibilitas password */}
                                <button
                                    type="button"
                                    onClick={eyePwd}
                                    className="pr-2 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {/* Menampilkan pesan error jika ada */}
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700 mb-16"
                        >
                            Login
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="flex justify-center gap-4">
                        <button 
                            type="button" 
                            className="px-5 py-2.5 border border-gray-300 rounded-md bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
                        >
                            {/* <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg> */}
                            Google
                        </button>
                        <button 
                            type="button" 
                            className="px-5 py-2.5 border border-gray-300 rounded-md bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;