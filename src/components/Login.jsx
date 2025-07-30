import React, { useState } from 'react';

const Login = () => {
    // State untuk menampung nilai input form (email dan password)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State untuk menampung pesan error validasi
    const [errors, setErrors] = useState({});

    // State untuk mengontrol visibilitas password (true = terlihat, false = tersembunyi)
    const [showPassword, setShowPassword] = useState(false);

    // Fungsi untuk mengelola perubahan pada input form
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
        if (!email) {
            newErrors.email = "Email tidak boleh kosong.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Format email tidak valid.";
        }

        // Validasi Password: tidak boleh kosong
        // Untuk login, biasanya tidak perlu validasi kompleksitas password seperti di registrasi,
        // cukup pastikan password tidak kosong.
        if (!password) {
            newErrors.password = "Password tidak boleh kosong.";
        }

        // Memperbarui state errors dengan pesan error yang ditemukan
        setErrors(newErrors);
        // Mengembalikan true jika tidak ada error (objek newErrors kosong), false jika ada
        return Object.keys(newErrors).length === 0;
    };

    // Fungsi untuk menangani submit form
    const handleLogin = (event) => {
        event.preventDefault(); // Mencegah refresh halaman default

        // Memanggil fungsi validasi
        if (validateForm()) {
            // Cek kredensial di localStorage
            if (typeof Storage !== "undefined") {
                try {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    
                    const user = users.find(u => 
                        u.email === formData.email.toLowerCase() && 
                        u.password === formData.password
                    );

                    if (user) {
                        const currentUser = {
                            id: user.id,
                            email: user.email,
                            loginAt: new Date().toISOString()
                        };
                        
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        console.log("Data form valid untuk login:", formData);
                        alert("Login berhasil! (Simulasi)");
                        
                        // Reset form
                        setFormData({
                            email: '',
                            password: '',
                        });
                    } else {
                        setErrors({
                            email: "Email atau password salah.",
                            password: "Email atau password salah."
                        });
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    alert("Terjadi kesalahan saat login.");
                }
            } else {
                // Jika localStorage tidak didukung, lanjutkan dengan logika login original
                console.log("Data form valid untuk login:", formData);
                alert("Login berhasil! (Simulasi)");
            }
        } else {
            // Jika validasi gagal, pesan error akan ditampilkan di UI
            console.log("Validasi gagal. Mohon periksa kembali formulir Anda.");
        }
    };

    return (
        <>
            <div className="merk">
                <img src="tickitz-logo.png" alt="Tickitz" />
            </div>

            <main>
                <div className="container">
                    <div className="login-desc">
                        <div className="wave-hand">
                            <h1>Welcome Back👋</h1>
                        </div>
                        <div className="atention">
                            <p>Sign in with your data that you entered during your registration</p>
                        </div>
                    </div>

                    <div id="form-login">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email} // Mengikat nilai input ke state
                                onChange={handleChange} // Menangani perubahan input
                            />
                            {/* Menampilkan pesan error jika ada */}
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="eye-pwd">
                                <input
                                    // Mengubah tipe input berdasarkan state showPassword
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password} // Mengikat nilai input ke state
                                    onChange={handleChange} // Menangani perubahan input
                                />
                                {/* Ikon mata yang dapat diklik untuk mengubah visibilitas password */}
                                <img
                                    // Mengubah sumber gambar ikon berdasarkan state showPassword
                                    src={showPassword ? "eye-slash-solid.svg" : "eye-solid-full.svg"}
                                    alt="Toggle password visibility"
                                    width="20px"
                                    onClick={eyePwd} // Menangani klik pada ikon
                                    style={{ cursor: 'pointer' }} // Memberikan indikasi kursor dapat diklik
                                />
                            </div>
                            {/* Menampilkan pesan error jika ada */}
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>

                    

                        {/* Tombol submit form */}
                        <button onClick={handleLogin} className="btn-primary">Login</button>

                        <div className="social-login">
                            <button type="button" className="social-btn">
                                <img src="flat-color-icons_google.svg" alt="Google" />
                                Google
                            </button>
                            <button type="button" className="social-btn">
                                <img src="bx_bxl-facebook-circle.svg" alt="Facebook" />
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;