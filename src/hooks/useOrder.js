import { useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const useOrder = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);
  console.log(token);

  const loadUserOrderHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BE_HOST}/orders/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const mapped = (res.data.data || []).map((o) => ({
          orderId: o.id,
          movieTitle: o.movie_title,
          selectedDate: o.show_date,
          selectedTime: o.show_time,
          selectedCinema: { name: o.cinema_name },
          paymentStatus: o.is_paid ? "completed" : "pending",
          qrCode: o.qr_code,
          seats: o.seats ? o.seats.map((s) => `${s.row}${s.seat_number}`) : [],
          totalPayment: o.price,
        }));
        setOrderHistory(mapped);
      } else {
        setError("Gagal mengambil riwayat order");
      }
    } catch (err) {
      console.error("Error loadUserOrderHistory:", err);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrderHistory((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, paymentStatus: newStatus }
          : order
      )
    );
  };

  const clearError = () => setError(null);

  return {
    orderHistory,
    isLoading,
    error,
    loadUserOrderHistory,
    updateOrderStatus,
    clearError,
  };
};
