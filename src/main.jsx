import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Router.jsx'
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import reduxStore, { persistedStore } from "./redux/store.js";
import { ForgotPasswordProvider } from './context/forgotPasswordContext.jsx';
import OrderProvider from './context/OrderContext.jsx';


// import tailwindcss from '@tailwindcss/vite'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReduxProvider store={reduxStore}>
      <PersistGate loading={null} persistor={persistedStore}>
        <ForgotPasswordProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </ForgotPasswordProvider>
      </PersistGate>  
    </ReduxProvider>
  </StrictMode>,
)
