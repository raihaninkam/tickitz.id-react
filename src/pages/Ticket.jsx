import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";
import convertTime, { convertDate } from "../utils/timeConvert";

const TicketResult = () => {
  const navigate = useNavigate();

  // Ambil data dari Redux
  const ticketData = useSelector((state) => state.order.currentOrder);

  // Fallback data jika tidak ada ticketData
  const fallbackData = {
    ticketInfo: {
      movieTitle: "Spider-Man: No Way Home",
      category: "PG-13",
      date: "07 Jul 2024",
      time: "2:00 PM",
      count: 3,
      seats: "C4, C5, C6",
      total: "$30.00",
      cinema: "CineOne21 Cinema",
    },
  };

  // Jika tidak ada ticketData, gunakan fallback
  const currentTicketData = ticketData || fallbackData;

  useEffect(() => {
    // Jika tidak ada ticketData sama sekali, bisa redirect ke home atau payment
    if (!ticketData) {
      // navigate('/payment'); // Optional: redirect jika ingin
    }
  }, [ticketData, navigate]);

  const handleDownloadPDF = () => {
    // Create a new window for printing/PDF generation
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Ticket</title></head><body>"
    );
    printWindow.document.write(
      `<h1>Ticket for ${currentTicketData.ticketInfo.movieTitle}</h1>`
    );
    printWindow.document.write(
      `<p>Category: ${currentTicketData.ticketInfo.category}</p>`
    );
    printWindow.document.write(
      `<p>Date: ${currentTicketData.ticketInfo.date}</p>`
    );
    printWindow.document.write(
      `<p>Time: ${currentTicketData.ticketInfo.time}</p>`
    );
    printWindow.document.write(
      `<p>Count: ${currentTicketData.ticketInfo.count} pcs</p>`
    );
    printWindow.document.write(
      `<p>Seats: ${currentTicketData.ticketInfo.seats}</p>`
    );
    printWindow.document.write(
      `<p>Total: ${currentTicketData.ticketInfo.total}</p>`
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDone = () => {
    // Clear all stored data (opsional, jika pakai Redux bisa dispatch reset)
    // navigate ke home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MyNavbar />

      {/* Hero Section */}
      <section className="">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center min-h-screen">
            {/* Left Side */}
            <div className="flex-1 text-white p-8 lg:p-16 bg-[url(/cover-order-result.svg)]">
              <div className="mb-8 mt-16">
                <img src="/tickitz white.svg" alt="" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Thank you For Purchasing
              </h1>
              <p className="text-xl lg:text-2xl font-light mb-2">
                Your ticket for {currentTicketData.movieTitle}
              </p>
              <p className="text-xl lg:text-2xl font-light mb-8">
                has been successfully booked.
              </p>
              <div className="flex items-center font-bold text-lg">
                <span>Please Download Your Ticket</span>
                <span className="ml-4">→</span>
              </div>
            </div>

            {/* Right Side - Ticket */}
            <div className="flex-1 flex justify-center items-center p-10 bg-gray-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative">
                {/* Decorative perforated edges */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-gray-100 rounded-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-gray-100 rounded-full"></div>

                {/* QR Code */}
                <div className="flex justify-center mb-8">
                  <img src="/QR Code 1.svg" alt="QR Code" />
                </div>

                {/* Movie Info */}
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Movie</p>
                    <p className="font-bold">
                      {currentTicketData.movieTitle.length > 15
                        ? currentTicketData.movieTitle.substring(0, 15) + ".."
                        : currentTicketData.movieTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Category</p>
                    <p className="font-bold">PG-13</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="font-bold">
                      {convertDate(currentTicketData.selectedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Time</p>
                    <p className="font-bold">
                      {convertTime(currentTicketData.selectedTime)}
                    </p>
                  </div>
                </div>

                {/* Count & Seats */}
                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-gray-500 text-sm">Count</p>
                    <p className="font-bold">
                      {currentTicketData.totalSeats} pcs
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Seats</p>
                    <p className="font-bold">{currentTicketData.seats}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between p-3 border border-gray-300 rounded-lg mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {currentTicketData.totalPayment}
                  </span>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
                  >
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleDone}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <MyFooter />
    </div>
  );
};

export default TicketResult;
