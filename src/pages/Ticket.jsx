import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MyNavbar from "../components/Navbar";
import MyFooter from "../components/Footer";

const TicketResult = () => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load ticket data from sessionStorage
  useEffect(() => {
    const savedTicketData = sessionStorage.getItem('ticketData');
    if (savedTicketData) {
      try {
        const parsedData = JSON.parse(savedTicketData);
        setTicketData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing ticket data:', error);
        // Redirect back to payment page if no valid ticket data
        navigate('/payment');
      }
    } else {
      // Redirect back to payment page if no ticket data
      navigate('/payment');
    }
  }, [navigate]);

  // Fallback data if no ticket data available
  const fallbackData = {
    ticketInfo: {
      movieTitle: 'Spider-Man: No Way Home',
      category: 'PG-13',
      date: '07 Jul 2024',
      time: '2:00 PM',
      count: 3,
      seats: 'C4, C5, C6',
      total: '$30.00',
      cinema: 'CineOne21 Cinema'
    }
  };

  const currentTicketData = ticketData || fallbackData;

  const handleDownloadPDF = () => {
    // Create a new window for printing/PDF generation
    const printWindow = window.open("", "_blank");

    // Create the ticket content for PDF with dynamic data
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleDone = () => {
    // Clear all stored data
    sessionStorage.removeItem('ticketData');
    sessionStorage.removeItem('orderData');
    sessionStorage.removeItem('paymentData');
    
    // Navigate to home or movies page
    navigate('/');
  };

  // Show loading while fetching ticket data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MyNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MyNavbar />

      {/* Hero Section */}
      <section className="overflow-hidden">
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
                Your ticket for {currentTicketData.ticketInfo.movieTitle}
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
                    <p className="font-bold">{currentTicketData.ticketInfo.movieTitle.length > 15 ? currentTicketData.ticketInfo.movieTitle.substring(0, 15) + '..' : currentTicketData.ticketInfo.movieTitle}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Category</p>
                    <p className="font-bold">{currentTicketData.ticketInfo.category}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="font-bold">{currentTicketData.ticketInfo.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Time</p>
                    <p className="font-bold">{currentTicketData.ticketInfo.time}</p>
                  </div>
                </div>

                {/* Count & Seats */}
                <div className="flex justify-between mb-8">
                  <div>
                    <p className="text-gray-500 text-sm">Count</p>
                    <p className="font-bold">{currentTicketData.ticketInfo.count} pcs</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Seats</p>
                    <p className="font-bold">{currentTicketData.ticketInfo.seats}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between p-3 border border-gray-300 rounded-lg mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{currentTicketData.ticketInfo.total}</span>
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