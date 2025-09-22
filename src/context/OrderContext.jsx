import { useReducer, useMemo } from 'react';
import { OrderContext } from './OrderContext';

// Helper functions - karena tidak bisa pakai localStorage di Claude.ai, 
// kita akan menggunakan in-memory storage saja
let inMemoryUsers = {};
let inMemoryOrders = {};

const getCurrentUser = () => {
  try {
    // Simulasi getCurrentUser - dalam implementasi asli gunakan localStorage
    const currentUserEmail = Object.keys(inMemoryUsers).find(email => inMemoryUsers[email].isLoggedIn);
    return currentUserEmail ? inMemoryUsers[currentUserEmail] : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const getUserOrderHistory = (userEmail) => {
  try {
    return inMemoryOrders[userEmail] || [];
  } catch (error) {
    console.error(`Error getting order history for user ${userEmail}:`, error);
    return [];
  }
};

// Initial state
const initialState = {
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null
};

// Action types
const ORDER_ACTIONS = {
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  CLEAR_CURRENT_ORDER: 'CLEAR_CURRENT_ORDER',
  LOAD_USER_ORDER_HISTORY: 'LOAD_USER_ORDER_HISTORY',
  ADD_ORDER_HISTORY: 'ADD_ORDER_HISTORY',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  CLEAR_ORDER_HISTORY: 'CLEAR_ORDER_HISTORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload
      };

    case ORDER_ACTIONS.CLEAR_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: null
      };

    case ORDER_ACTIONS.LOAD_USER_ORDER_HISTORY:
      try {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.email) {
          const orderHistory = getUserOrderHistory(currentUser.email);
          return {
            ...state,
            orderHistory,
            error: null,
            isLoading: false
          };
        }
        return {
          ...state,
          orderHistory: [],
          error: null,
          isLoading: false
        };
      } catch (error) {
        console.error('Error loading order history:', error);
        return {
          ...state,
          error: 'Error loading order history',
          isLoading: false
        };
      }

    case ORDER_ACTIONS.ADD_ORDER_HISTORY:
      try {
        const user = getCurrentUser();
        if (!user || !user.email) {
          return {
            ...state,
            error: 'No current user found'
          };
        }

        const userEmail = user.email;
        
        // Tambah order ke state
        const orderWithTimestamp = {
          ...action.payload,
          orderId: Date.now().toString(),
          orderDate: new Date().toISOString(),
          userEmail: userEmail,
          userName: user.name || user.email
        };

        const newOrderHistory = [...state.orderHistory, orderWithTimestamp];

        // Simpan ke in-memory storage per user
        const existingOrders = getUserOrderHistory(userEmail);
        const updatedOrders = [...existingOrders, orderWithTimestamp];
        inMemoryOrders[userEmail] = updatedOrders;

        return {
          ...state,
          orderHistory: newOrderHistory,
          error: null
        };
      } catch (error) {
        console.error('Error adding order to history:', error);
        return {
          ...state,
          error: 'Error adding order to history'
        };
      }

    case ORDER_ACTIONS.UPDATE_ORDER_STATUS:
      try {
        const { orderId, newStatus } = action.payload;
        const currentUserForUpdate = getCurrentUser();
        
        if (!currentUserForUpdate || !currentUserForUpdate.email) {
          return {
            ...state,
            error: 'No current user found'
          };
        }

        // Update di state
        const updatedOrderHistory = state.orderHistory.map(order => 
          order.orderId === orderId 
            ? { ...order, paymentStatus: newStatus }
            : order
        );

        // Update di in-memory storage
        const userEmail = currentUserForUpdate.email;
        const existingOrders = getUserOrderHistory(userEmail);
        const updatedOrders = existingOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, paymentStatus: newStatus }
            : order
        );
        inMemoryOrders[userEmail] = updatedOrders;

        return {
          ...state,
          orderHistory: updatedOrderHistory,
          error: null
        };
      } catch (error) {
        console.error('Error updating order status:', error);
        return {
          ...state,
          error: 'Error updating order status'
        };
      }

    case ORDER_ACTIONS.CLEAR_ORDER_HISTORY:
      try {
        const userForClear = getCurrentUser();
        if (userForClear && userForClear.email) {
          delete inMemoryOrders[userForClear.email];
        }
        return {
          ...state,
          orderHistory: [],
          error: null
        };
      } catch (error) {
        console.error('Error clearing order history:', error);
        return {
          ...state,
          error: 'Error clearing order history'
        };
      }

    case ORDER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ORDER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case ORDER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Provider component
const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Memoized action creators
  const actions = useMemo(() => ({
    setCurrentOrder: (order) => {
      dispatch({ type: ORDER_ACTIONS.SET_CURRENT_ORDER, payload: order });
    },

    clearCurrentOrder: () => {
      dispatch({ type: ORDER_ACTIONS.CLEAR_CURRENT_ORDER });
    },

    loadUserOrderHistory: () => {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ORDER_ACTIONS.LOAD_USER_ORDER_HISTORY });
    },

    addOrderHistory: (order) => {
      dispatch({ type: ORDER_ACTIONS.ADD_ORDER_HISTORY, payload: order });
    },

    updateOrderStatus: (orderId, newStatus) => {
      dispatch({ 
        type: ORDER_ACTIONS.UPDATE_ORDER_STATUS, 
        payload: { orderId, newStatus } 
      });
    },

    clearOrderHistory: () => {
      dispatch({ type: ORDER_ACTIONS.CLEAR_ORDER_HISTORY });
    },

    setLoading: (loading) => {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ORDER_ACTIONS.CLEAR_ERROR });
    }
  }), []);

  // Memoized context value
  const value = useMemo(() => ({
    // State
    currentOrder: state.currentOrder,
    orderHistory: state.orderHistory,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    ...actions
  }), [state, actions]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;