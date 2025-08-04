import { useState } from 'react';

const NewsletterSubscribe = () => {
    // State untuk menampung nilai input form
    const [formData, setFormData] = useState({
        firstName: '',
        email: ''
    });

    // State untuk menampung pesan error validasi
    const [errors, setErrors] = useState({});

    // State untuk loading saat submit
    const [isLoading, setIsLoading] = useState(false);

    // State untuk pesan sukses
    const [successMessage, setSuccessMessage] = useState('');

    // Fungsi untuk mengelola perubahan pada input form
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error saat user mulai mengetik
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        // Clear success message saat user mulai mengetik
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    // Fungsi untuk memvalidasi input form
    const validateForm = () => {
        let newErrors = {};
        const { firstName, email } = formData;

        // Validasi First Name: tidak boleh kosong
        if (!firstName.trim()) {
            newErrors.firstName = "Nama depan tidak boleh kosong.";
        } else if (firstName.trim().length < 2) {
            newErrors.firstName = "Nama depan harus minimal 2 karakter.";
        }

        // Validasi Email: tidak boleh kosong dan harus format email yang valid
        if (!email.trim()) {
            newErrors.email = "Email tidak boleh kosong.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Format email tidak valid.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fungsi untuk menyimpan subscription ke localStorage
    const saveSubscription = (subscriptionData) => {
        try {
            // Ambil data existing dari localStorage
            const existingSubscriptionsJSON = localStorage.getItem('newsletterSubscriptions');
            let existingSubscriptions = [];
            
            if (existingSubscriptionsJSON) {
                existingSubscriptions = JSON.parse(existingSubscriptionsJSON);
            }

            // Cek apakah email sudah terdaftar
            const emailExists = existingSubscriptions.some(
                sub => sub.email.toLowerCase() === subscriptionData.email.toLowerCase()
            );

            if (emailExists) {
                setErrors({
                    email: "Email sudah terdaftar untuk newsletter."
                });
                return false;
            }
            
            // Tambahkan subscription baru ke array
            const updatedSubscriptions = [...existingSubscriptions, subscriptionData];
            
            // Simpan kembali ke localStorage
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(updatedSubscriptions));
            
            console.log('Subscription berhasil disimpan:', subscriptionData);
            console.log('Total subscribers:', updatedSubscriptions.length);
            
            return true;
        } catch (error) {
            console.error('Error saving subscription:', error);
            return false;
        }
    };

    // Fungsi untuk menangani submit form
    const handleSubscribe = async (event) => {
        event.preventDefault();
        
        // Reset errors dan success message
        setErrors({});
        setSuccessMessage('');

        // Validasi form
        if (!validateForm()) {
            console.log("Validasi form gagal");
            return;
        }

        // Set loading state
        setIsLoading(true);

        try {
            // Simulasi delay untuk API call (hapus di production)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Persiapkan data subscription
            const subscriptionData = {
                id: Date.now(),
                firstName: formData.firstName.trim(),
                email: formData.email.trim().toLowerCase(),
                subscribedAt: new Date().toISOString(),
                status: 'active'
            };

            // Simpan ke localStorage
            const saveSuccess = saveSubscription(subscriptionData);
            
            if (saveSuccess) {
                console.log("Newsletter subscription berhasil:", subscriptionData);
                
                // Tampilkan pesan sukses
                
                // Reset form
                setFormData({
                    firstName: '',
                    email: ''
                });
            }
        } catch (error) {
            console.error('Error during subscription:', error);
            setErrors({
                general: "Terjadi kesalahan. Silakan coba lagi."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section 
            id="subscribe" 
            className="mx-4 md:mx-20 my-8 md:my-24 bg-[url('BG-newslater.svg')] bg-cover bg-center rounded-lg flex justify-center items-center"
        >
            <div className="container-subscribe mt-16 w-full px-4">
                {/* Title */}
                <div className="subs">
                    <p className="text-white text-3xl md:text-4xl mb-12 flex justify-center text-center leading-tight">
                        Subscribe to our newsletter
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 flex justify-center">
                        <div className="bg-green-500 text-white px-6 py-3 rounded-lg max-w-md text-center">
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* General Error Message */}
                {errors.general && (
                    <div className="mb-6 flex justify-center">
                        <div className="bg-red-500 text-white px-6 py-3 rounded-lg max-w-md text-center">
                            <p className="text-sm">{errors.general}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubscribe}>
                    <div className="input-btn flex flex-col md:flex-row justify-center gap-4 mb-16 items-stretch md:items-center">
                        {/* First Name Input */}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`py-4 px-12 bg-transparent border-2 rounded-lg text-white w-full box-border placeholder-white ${
                                    errors.firstName ? 'border-red-400' : 'border-white'
                                }`}
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <p className="text-red-400 text-sm mt-1 text-center">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                className={`py-4 px-12 bg-transparent border-2 rounded-lg text-white w-full box-border placeholder-white ${
                                    errors.email ? 'border-red-400' : 'border-white'
                                }`}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1 text-center">{errors.email}</p>
                            )}
                        </div>

                        {/* Subscribe Button */}
                        <div className="btn-subscribe w-full md:w-auto">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`py-4 px-12 rounded-lg font-bold text-center w-full box-border transition-all ${
                                    isLoading 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-white text-[#1D4ED8] hover:bg-gray-100'
                                }`}
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe Now'}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </section>
    );
};

export default NewsletterSubscribe;