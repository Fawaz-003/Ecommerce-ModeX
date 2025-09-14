import axios from "axios";
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Set default axios config
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

// Create context
export const AppContext = createContext(null);

// Context provider
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate(); // ✅ safe because inside component
  const currency = import.meta.env.VITE_CURRENCY || "₹"; // ✅ Vite env vars must start with VITE_

  const values = {
    navigate,
    axios,
    currency,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using context
export const useAppContext = () => useContext(AppContext);
