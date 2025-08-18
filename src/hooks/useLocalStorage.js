import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook khusus untuk mengelola history pembelian per user
export const useUserOrderHistory = () => {
  const getCurrentUser = () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  const getUserOrderHistory = (userEmail) => {
    try {
      const userOrders = localStorage.getItem(`orderHistory_${userEmail}`);
      return userOrders ? JSON.parse(userOrders) : [];
    } catch (error) {
      console.error(`Error getting order history for user ${userEmail}:`, error);
      return [];
    }
  };

  const addOrderToUserHistory = (orderData) => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.email) {
      console.error('No current user found');
      return false;
    }

    try {
      const userEmail = currentUser.email;
      const existingOrders = getUserOrderHistory(userEmail);
      
      // Tambah timestamp dan user info ke order
      const orderWithTimestamp = {
        ...orderData,
        orderId: Date.now().toString(),
        orderDate: new Date().toISOString(),
        userEmail: userEmail,
        userName: currentUser.name || currentUser.email
      };

      const updatedOrders = [...existingOrders, orderWithTimestamp];
      localStorage.setItem(`orderHistory_${userEmail}`, JSON.stringify(updatedOrders));
      
      return true;
    } catch (error) {
      console.error('Error adding order to user history:', error);
      return false;
    }
  };

  const getCurrentUserOrderHistory = () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return [];
    }
    return getUserOrderHistory(currentUser.email);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return false;
    }

    try {
      const userEmail = currentUser.email;
      const existingOrders = getUserOrderHistory(userEmail);
      
      const updatedOrders = existingOrders.map(order => 
        order.orderId === orderId 
          ? { ...order, paymentStatus: newStatus }
          : order
      );

      localStorage.setItem(`orderHistory_${userEmail}`, JSON.stringify(updatedOrders));
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const clearUserOrderHistory = () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return false;
    }

    try {
      localStorage.removeItem(`orderHistory_${currentUser.email}`);
      return true;
    } catch (error) {
      console.error('Error clearing user order history:', error);
      return false;
    }
  };

  return {
    getCurrentUser,
    getUserOrderHistory,
    addOrderToUserHistory,
    getCurrentUserOrderHistory,
    updateOrderStatus,
    clearUserOrderHistory
  };
};