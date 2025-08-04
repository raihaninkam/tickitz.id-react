import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import { useNavigate } from "react-router";

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
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load order data from sessionStorage
  useEffect(() => {
    const savedOrderData = sessionStorage.getItem("orderData");
    if (savedOrderData) {
      try {
        const parsedData = JSON.parse(savedOrderData);
        setOrderData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing order data:", error);
        // Redirect back to order page if no valid order data
        navigate("/order");
      }
    } else {
      // Redirect back to order page if no order data
      navigate("/order");
    }
  }, [navigate]);

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

  // Fallback booking details jika tidak ada order data
  const fallbackBookingDetails = {
    dateTime: "Tuesday, 07 July 2020 at 02:00pm",
    movieTitle: "Spider-Man: Homecoming",
    cinemaName: "CineOne21 Cinema",
    tickets: "3 pieces",
    totalPayment: "$30.00",
  };

  // Use order data or fallback
  const bookingDetails = orderData
    ? {
        dateTime: `${orderData.selectedDate} at ${orderData.selectedTime}`,
        movieTitle: orderData.movieTitle,
        cinemaName: orderData.selectedCinema?.name || "Unknown Cinema",
        location: orderData.selectedLocation,
        tickets: `${orderData.totalSeats} pieces`,
        selectedSeats: orderData.selectedSeats?.join(", ") || "None",
        totalPayment: `$${orderData.totalPrice || 0}.00`,
        ticketPrice: orderData.ticketPrice || 10,
      }
    : fallbackBookingDetails;

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
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // Show loading while fetching order data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        <MyNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <MyNavbar />

      {/* Progress Bar */}
      <div className="flex justify-center py-8">
        <div className="flex items-center space-x-4">
          <img src="/progress2.svg" alt="" />
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
                  placeholder="Jonas El Rodriguez"
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
                  placeholder="jonasrodri123@gmail.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+62 | 81445687121"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    formErrors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
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
                        // Fallback jika gambar gagal dimuat
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

      {/* Footer Placeholder */}
      <MyFooter />

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
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
                  onClick={() => {
                    console.log("Check Payment clicked");

                    // Prepare complete ticket data
                    const ticketData = {
                      ...orderData,
                      personalInfo: formData,
                      paymentMethod: selectedPaymentMethod,
                      paymentStatus: "completed",
                      paymentDate: new Date().toISOString(),
                      // Add formatted data for ticket display
                      ticketInfo: {
                        movieTitle:
                          orderData?.movieTitle || "Spider-Man: No Way Home",
                        category: "PG-13",
                        date: orderData?.selectedDate || "07 Jul 2024",
                        time: orderData?.selectedTime || "2:00 PM",
                        count: orderData?.totalSeats || 3,
                        seats:
                          orderData?.selectedSeats?.join(", ") || "C4, C5, C6",
                        total: orderData?.totalPrice
                          ? `$${orderData.totalPrice}.00`
                          : "$30.00",
                        cinema:
                          orderData?.selectedCinema?.name || "CineOne21 Cinema",
                        location: orderData?.selectedLocation || "Jakarta",
                      },
                    };

                    // Save to sessionStorage
                    sessionStorage.setItem(
                      "ticketData",
                      JSON.stringify(ticketData)
                    );

                    // Navigate to ticket result page
                    navigate("/home/ticket");

                    closeModal();
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Check Payment
                </button>
                <button
                  onClick={closeModal}
                  className="w-full text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Pay Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
