import React, { useState, useEffect, useMemo } from "react";
import { X, Copy, Check } from "lucide-react";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { addOrderHistory, clearCurrentOrder } from "../redux/slices/orderSlice";

const PaymentPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil data user yang sedang login dari Redux atau localStorage
  const currentUser = useSelector(state => {
    try {
      return state.auth?.currentUser || state.user?.currentUser || null;
    } catch (error) {
      console.error("Error accessing user state:", error);
      return null;
    }
  });

  // Fallback: ambil dari localStorage jika tidak ada di Redux
  const getCurrentUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
    return null;
  };

  // Ambil order data dari Redux dengan error handling
  const orderData = useSelector(state => {
    try {
      return state.order?.currentOrder || null;
    } catch (error) {
      console.error("Error accessing Redux state:", error);
      return null;
    }
  });

  // Fix: Set email otomatis dari user yang login
  useEffect(() => {
    const user = currentUser || getCurrentUserFromStorage();
    
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        fullName: user.name || user.fullName || "",
        phoneNumber: user.phone || user.phoneNumber || "",
      }));
    }
  }, [currentUser]);

  // Fix: Perbaiki useEffect dengan dependency yang tepat
  useEffect(() => {
    // Simulasi loading untuk menghindari flash
    const timer = setTimeout(() => {
      if (!orderData) {
        console.warn("No order data found, redirecting to order page");
        navigate("/home/order", { replace: true });
      } else {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [orderData, navigate]);

  const paymentMethods = [
    {
      id: "google-pay",
      img: "/logos_google-pay.svg",
      name: "Google Pay",
    },
    {
      id: "visa",
      img: "/logos_visa.svg",
      name: "Visa",
    },
    {
      id: "gopay",
      img: "/Logo GoPay (SVG-240p) - FileVector69 1.svg",
      name: "GoPay",
    },
    {
      id: "paypal",
      img: "/logos_paypal.png",
      name: "PayPal",
    },
    {
      id: "dana",
      img: "/Logo DANA (PNG-240p) - FileVector69 1.svg",
      name: "DANA",
    },
    {
      id: "bca",
      img: "/Bank BCA Logo (SVG-240p) - FileVector69 1.svg",
      name: "BCA",
    },
    {
      id: "bri",
      img: "/Bank BRI (Bank Rakyat Indonesia) Logo (SVG-240p) - FileVector69 1.svg",
      name: "BRI",
    },
    {
      id: "ovo",
      img: "/ovo.svg",
      name: "OVO",
    },
  ];

  // Fallback booking details dengan null checks
  const fallbackBookingDetails = {
    dateTime: "Tuesday, 07 July 2020 at 02:00pm",
    movieTitle: "Spider-Man: Homecoming",
    cinemaName: "CineOne21 Cinema",
    tickets: "3 pieces",
    totalPayment: "$30.00",
  };

  // Fix: Perbaiki logic untuk booking details
  const bookingDetails = useMemo(() => {
    if (!orderData) return fallbackBookingDetails;
    
    return {
      dateTime: `${orderData.selectedDate || 'Unknown Date'} at ${orderData.selectedTime || 'Unknown Time'}`,
      movieTitle: orderData.movieTitle || "Unknown Movie",
      cinemaName: orderData.selectedCinema?.name || "Unknown Cinema",
      location: orderData.selectedLocation || "Unknown Location",
      tickets: `${orderData.totalSeats || 0} pieces`,
      selectedSeats: orderData.seats?.join(", ") || "None",
      totalPayment: `${orderData.totalPayment || 0}.00`,
      ticketPrice: orderData.ticketPrice || 10,
    };
  }, [orderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        errors[key] = true;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const copyAccountNumber = async () => {
    const accountNumber = "12321328913829724";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(accountNumber);
      } else {
        // Fallback untuk environment yang tidak support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = accountNumber;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Manual fallback
      alert(`Account Number: ${accountNumber}`);
    }
  };

  // Fix: Perbaiki event listeners
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // Fix: Perbaiki fungsi handleModalPayment
  const handleModalPayment = (status) => {
    try {
      if (!orderData) {
        console.error("No order data available");
        navigate('/home/order');
        return;
      }

      const ticketData = {
        ...orderData,
        personalInfo: formData,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: status,
        paymentDate: new Date().toISOString(),
        ticketInfo: {
          movieTitle: orderData.movieTitle || "Unknown Movie",
          category: "PG-13",
          date: orderData.selectedDate || "Unknown Date",
          time: orderData.selectedTime || "Unknown Time",
          count: orderData.totalSeats || 0,
          seats: orderData.seats?.join(", ") || "None",
          total: orderData.totalPayment ? `$${orderData.totalPayment}.00` : "$0.00",
          cinema: orderData.selectedCinema?.name || "Unknown Cinema",
          location: orderData.selectedLocation || "Unknown Location",
        },
      };

      // Simpan ke Redux
      dispatch(addOrderHistory(ticketData));
      dispatch(clearCurrentOrder());

      // Redirect ke halaman ticket
      navigate("/home/ticket", { replace: true });
      closeModal();
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing payment. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        <MyNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <MyFooter />
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <MyNavbar />

      {/* Progress Bar */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-4">
          <img src="/progress2.svg" alt="Progress" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <h1 className="text-2xl font-bold mb-8">Payment Info</h1>

          {/* Booking Details */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                Date & Time
              </p>
              <p className="text-sm pb-4 border-b border-gray-300">
                {bookingDetails.dateTime}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                Movie Title
              </p>
              <p className="text-sm pb-4 border-b border-gray-300">
                {bookingDetails.movieTitle}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                Cinema Name
              </p>
              <p className="text-sm pb-4 border-b border-gray-300">
                {bookingDetails.cinemaName}
              </p>
            </div>

            {bookingDetails.location && (
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="text-sm pb-4 border-b border-gray-300">
                  {bookingDetails.location}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                Selected Seats
              </p>
              <p className="text-sm pb-4 border-b border-gray-300">
                {bookingDetails.selectedSeats}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                Number of Tickets
              </p>
              <p className="text-sm pb-4 border-b border-gray-300">
                {bookingDetails.tickets}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                Total Payment
              </p>
              <p className="text-lg font-bold text-blue-600 pb-4 border-b border-gray-300">
                {bookingDetails.totalPayment}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    formErrors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

             <div className="relative">
  <label className="block text-sm text-gray-600 mb-2">
    Phone Number
  </label>
  <div className="relative">
    {/* Prefix +62 */}
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-700">
      +62
    </span>
    <input
      type="text"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleInputChange}
      placeholder="81445687121"
      className={`w-full pl-14 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
        formErrors.phoneNumber ? "border-red-500" : "border-gray-300"
      }`}
    />
  </div>
</div>

            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Choose Payment Method
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 border rounded-lg hover:border-blue-600 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center justify-center min-h-[100px] ${
                    selectedPaymentMethod === method.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="w-16 h-10 mb-2 flex items-center justify-center">
                    <img
                      src={method.img}
                      alt={method.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div className="w-16 h-10 bg-gray-200 rounded items-center justify-center text-xs text-gray-500 hidden">
                      {method.name}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 text-center">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          <div className="flex justify-center">
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-16 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Pay your order
            </button>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold mb-6">Payment Info</h2>

              <div className="flex items-center justify-between mb-6 p-4 rounded-lg">
                <div className="text-left">
                  <p className="text-sm text-gray-500">No. Rekening Virtual</p>
                  <p className="font-bold text-lg">12321328913829724</p>
                </div>
                <button
                  onClick={copyAccountNumber}
                  className={`px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2 ${
                    copied
                      ? "bg-green-500 text-white border-green-500"
                      : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500">Total Payment</span>
                <span className="font-bold text-xl text-blue-600">
                  {bookingDetails.totalPayment}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-6 p-4 rounded-lg">
                Pay this payment bill before it is due,{" "}
                <span className="text-red-600 font-semibold">
                  on June 23, 2023.
                </span>{" "}
                If the bill has not been paid by the specified time, it will be
                forfeited
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleModalPayment("completed")}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Check Payment
                </button>
                <button
                  onClick={() => handleModalPayment("not paid")}
                  className="w-full text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MyFooter />
    </div>
  );
};

export default PaymentPage;