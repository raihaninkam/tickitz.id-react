import React, { useState } from 'react';

const Register = () => {
    // State untuk menampung nilai input form
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        terms: false,
    });

    // State untuk menampung pesan error validasi
    const [errors, setErrors] = useState({});

    // --- BARU: State untuk mengontrol visibilitas password ---
    const [showPassword, setShowPassword] = useState(false);

    // Mengelola perubahan input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // --- BARU: Fungsi untuk mengubah visibilitas password ---
    const eyePwd = () => {
        setShowPassword(!showPassword);
    };

    // Memvalidasi field form
    const validateForm = () => {
        let newErrors = {};
        const { email, password, terms } = formData;

        // Validasi Email
        if (!email) {
            newErrors.email = "Email tidak boleh kosong.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Format email tidak valid.";
        } else {
            // Cek apakah email sudah terdaftar di localStorage
            if (typeof Storage !== "undefined") {
                try {
                    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                    if (existingUsers.find(user => user.email === email.toLowerCase())) {
                        newErrors.email = "Email sudah terdaftar.";
                    }
                } catch (error) {
                    console.error('Error checking existing users:', error);
                }
            }
        }

        // Validasi Password
        if (!password) {
            newErrors.password = "Password tidak boleh kosong.";
        } else if (password.length < 8) {
            newErrors.password = "Password harus mengandung minimal 8 karakter.";
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = "Password harus mengandung minimal 1 huruf kecil.";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = "Password harus mengandung minimal 1 huruf besar.";
        } else if (!/[!@#$%^&*/><]/.test(password)) {
            newErrors.password = "Password harus mengandung minimal 1 karakter spesial (!@#$%^&*/><).";
        }

        // Validasi Syarat & Ketentuan
        if (!terms) {
            newErrors.terms = "Anda harus menyetujui syarat & ketentuan.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Mengembalikan true jika tidak ada error
    };

    // Menangani submit form
    const handleRegister = (event) => {
        event.preventDefault();

        if (validateForm()) {
            // Simpan user ke localStorage
            if (typeof Storage !== "undefined") {
                try {
                    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                    
                    const newUser = {
                        id: Date.now(),
                        email: formData.email.toLowerCase(),
                        password: formData.password,
                        registeredAt: new Date().toISOString()
                    };

                    const updatedUsers = [...existingUsers, newUser];
                    localStorage.setItem('users', JSON.stringify(updatedUsers));
                    
                    console.log("Data form valid:", formData);
                    alert("Registrasi berhasil!");
                    
                    // Reset form setelah registrasi berhasil
                    setFormData({
                        email: '',
                        password: '',
                        terms: false,
                    });
                } catch (error) {
                    console.error('Error saving to localStorage:', error);
                    alert("Terjadi kesalahan saat menyimpan data.");
                }
            } else {
                console.log("Data form valid:", formData);
                alert("Registrasi berhasil!");
            }
        } else {
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
                    <div className="progress">
                        <div className="steps-container">
                            <div className="step">
                                <div className="step-number">1</div>
                                <div className="step-text">Fill Form</div>
                            </div>
                            <div className="step">
                                <div className="step-number-empty">2</div>
                                <div className="step-text">Activate</div>
                            </div>
                            <div className="step">
                                <div className="step-number-empty">3</div>
                                <div className="step-text">Done</div>
                            </div>
                        </div>
                    </div>

                    <div id="form-register">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="pwd-input">
                                <input
                                    // --- PERUBAHAN: Tipe input dinamis ---
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {/* --- PERUBAHAN: Ikon mata dinamis dan kursor pointer --- */}
                                <img
                                    src={showPassword ? "eye-slash-solid.svg" : "eye-solid-full.svg"}
                                    alt="Toggle password visibility"
                                    width="20px"
                                    onClick={eyePwd}
                                    style={{ cursor: 'pointer' }} // Menambahkan gaya kursor
                                />
                            </div>
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                            />
                            <label htmlFor="terms">I agree to terms & conditions</label>
                            {errors.terms && <p className="error-message">{errors.terms}</p>}
                        </div>

                        <button onClick={handleRegister} className="btn-primary">Join For Free Now</button>
                    </div>
                    <div className="login-link">
                        Already have an account? <a href="login.html">Log in</a>
                    </div>

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
            </main>
        </>
    );
};

export default Register;