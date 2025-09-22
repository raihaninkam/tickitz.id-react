import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import NavbarDashboard from "../components/NavbarDashboard";
import { Link } from "react-router";
import ProfileSidebar from "../components/ProfileSidebar";
import { useOrder } from "../hooks/useOrder";
import MyNavbar from "../components/Navbar";

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("Order History");
  const [openModalIndex, setOpenModalIndex] = useState(null);

  const {
    orderHistory,
    isLoading,
    error,
    loadUserOrderHistory,
    updateOrderStatus,
    clearError,
  } = useOrder();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Nomor virtual account berhasil disalin!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback untuk browser yang tidak support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Nomor virtual account berhasil disalin!");
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Load order history untuk user yang sedang login saat komponen dimount
  useEffect(() => {
    loadUserOrderHistory();
  }, [loadUserOrderHistory]);

  // Function untuk handle pembayaran
  const handlePaymentCheck = (orderId) => {
    try {
      // Simulasi pembayaran berhasil
      updateOrderStatus(orderId, "completed");

      // Refresh order history setelah update
      setTimeout(() => {
        loadUserOrderHistory();
      }, 100);

      alert("Pembayaran berhasil dikonfirmasi!");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Terjadi kesalahan saat memproses pembayaran!");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavbarDashboard />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <MyNavbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <ProfileSidebar />
          <main className="min-h-96">
            <div className="flex mb-8 bg-white rounded-2xl p-6 items-center">
              <Link
                to="/profile"
                className="text-gray-400 cursor-pointer hover:text-blue-600 mr-4"
              >
                Account Settings
              </Link>
              <button
                onClick={() => setActiveTab("Order History")}
                className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "Order History"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Order History
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-red-600 text-sm">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-600 text-xs underline hover:no-underline"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Order History" && (
              <div className="space-y-6">
                {/* Empty State */}
                {!isLoading && orderHistory.length === 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">
                      Belum ada riwayat pemesanan tiket
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Semua tiket yang pernah Anda pesan akan tampil di sini
                    </p>
                  </div>
                )}

                {/* Order List */}
                {orderHistory.map((order, idx) => (
                  <div
                    key={order.orderId || idx}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2">
                          {order.selectedDate} - {order.selectedTime}
                        </p>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {order.movieTitle || order.title || "Movie Title"}
                        </h3>
                        <div className="flex items-center space-x-3">
                          {order.paymentStatus === "completed" ? (
                            <>
                              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
                                Ticket used
                              </span>
                              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                Paid
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                Ticket active
                              </span>
                              <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                Not Paid
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="ml-6 flex flex-col items-end">
                        <div className="text-right mb-4">
                          {order.selectedCinema?.logo && (
                            <img
                              src={order.selectedCinema.logo}
                              alt={order.selectedCinema.name || "Cinema"}
                              title={order.selectedCinema.name || "Cinema"}
                              className="h-8 w-auto"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setOpenModalIndex(openModalIndex === idx ? null : idx)
                      }
                      className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                      Show Details
                      <ChevronDown
                        className={`w-4 h-4 ml-2 transform transition-transform ${
                          openModalIndex === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expanded Details */}
                    {openModalIndex === idx && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-6">
                          Ticket Information
                        </h4>
                        <div className="space-y-6">
                          {order.paymentStatus !== "completed" ? (
                            <>
                              {/* Payment Information */}
                              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-8">
                                  <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                      No. Rekening Virtual :
                                    </p>
                                    <p className="font-mono text-lg font-bold text-gray-900">
                                      {order.virtualAccount ||
                                        "12321328913829724"}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      order.virtualAccount ||
                                        "12321328913829724"
                                    )
                                  }
                                  className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                  Copy
                                </button>
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                  Total Payment :
                                </p>
                                <div className="text-2xl font-bold text-blue-600">
                                  {order.totalPayment
                                    ? `$${order.totalPayment}`
                                    : "$30.00"}
                                </div>
                              </div>

                              <div className="text-sm text-gray-600 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                Pay this payment bill before it is due,{" "}
                                <span className="font-semibold text-red-600">
                                  {order.dueDate || "June 23, 2023"}
                                </span>
                                . If the bill has not been paid by the specified
                                time, it will be forfeited.
                              </div>

                              <button
                                onClick={() =>
                                  handlePaymentCheck(order.orderId)
                                }
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                              >
                                Cek Pembayaran
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Ticket Details for Paid Orders */}
                              <div className="flex flex-col md:flex-row gap-8">
                                {/* QR Code */}
                                <div className="flex flex-col items-center justify-center md:items-start">
                                  <img
                                    src={
                                      order.qrCode ||
                                      `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Ticket-${order.orderId}`
                                    }
                                    alt="QR Code"
                                    className="w-24 h-24 rounded bg-gray-100 mb-4"
                                    onError={(e) => {
                                      e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Ticket-${order.orderId}`;
                                    }}
                                  />
                                </div>

                                {/* Info Grid */}
                                <div className="flex-1">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 mb-6">
                                    <div>
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Category
                                      </span>
                                      <span className="block text-base font-medium text-gray-900">
                                        {order.category || "Regular"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Time
                                      </span>
                                      <span className="block text-base font-medium text-gray-900">
                                        {order.selectedTime}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Seats
                                      </span>
                                      <span className="block text-base font-medium text-gray-900">
                                        {order.seats && order.seats.length > 0
                                          ? order.seats.join(", ")
                                          : "-"}
                                      </span>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 flex flex-col items-end justify-end">
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Total
                                      </span>
                                      <span className="block text-2xl font-bold text-gray-900">
                                        {order.totalPayment
                                          ? `$${order.totalPayment}`
                                          : "$30.00"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                                    <div>
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Movie
                                      </span>
                                      <span className="block text-base font-medium text-gray-900">
                                        {order.movieTitle ||
                                          order.title ||
                                          "Movie Title"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Date
                                      </span>
                                      <span className="block text-base font-medium text-gray-900">
                                        {order.selectedDate}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="block text-xs text-gray-500 mb-1">
                                        Count
                                      </span>
                                      <span className="block text-base font-medium text-gray-900">
                                        {order.seats && order.seats.length > 0
                                          ? `${order.seats.length} pcs`
                                          : "1 pcs"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
