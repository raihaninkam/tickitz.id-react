import { createSlice } from '@reduxjs/toolkit';

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

const initialState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    loadUserOrderHistory: (state) => {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.email) {
        state.orderHistory = getUserOrderHistory(currentUser.email);
      } else {
        state.orderHistory = [];
      }
    },

    addOrderHistory: (state, action) => {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.email) {
        state.error = 'No current user found';
        return;
      }

      try {
        const userEmail = currentUser.email;
        
        // Tambah order ke state
        const orderWithTimestamp = {
          ...action.payload,
          orderId: Date.now().toString(),
          orderDate: new Date().toISOString(),
          userEmail: userEmail,
          userName: currentUser.name || currentUser.email
        };

        state.orderHistory.push(orderWithTimestamp);

        // Simpan ke localStorage per user
        const existingOrders = getUserOrderHistory(userEmail);
        const updatedOrders = [...existingOrders, orderWithTimestamp];
        localStorage.setItem(`orderHistory_${userEmail}`, JSON.stringify(updatedOrders));

      } catch (error) {
        state.error = 'Error adding order to history';
        console.error('Error adding order to history:', error);
      }
    },

    updateOrderStatus: (state, action) => {
      const { orderId, newStatus } = action.payload;
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.email) {
        state.error = 'No current user found';
        return;
      }

      try {
        // Update di state
        const orderIndex = state.orderHistory.findIndex(order => order.orderId === orderId);
        if (orderIndex !== -1) {
          state.orderHistory[orderIndex].paymentStatus = newStatus;
        }

        // Update di localStorage
        const userEmail = currentUser.email;
        const existingOrders = getUserOrderHistory(userEmail);
        const updatedOrders = existingOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, paymentStatus: newStatus }
            : order
        );
        localStorage.setItem(`orderHistory_${userEmail}`, JSON.stringify(updatedOrders));

      } catch (error) {
        state.error = 'Error updating order status';
        console.error('Error updating order status:', error);
      }
    },

    clearOrderHistory: (state) => {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.email) {
        try {
          localStorage.removeItem(`orderHistory_${currentUser.email}`);
          state.orderHistory = [];
        } catch (error) {
          state.error = 'Error clearing order history';
          console.error('Error clearing order history:', error);
        }
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setCurrentOrder,
  clearCurrentOrder,
  loadUserOrderHistory,
  addOrderHistory,
  updateOrderStatus,
  clearOrderHistory,
  clearError,
  setLoading
} = orderSlice.actions;

export default orderSlice.reducer;