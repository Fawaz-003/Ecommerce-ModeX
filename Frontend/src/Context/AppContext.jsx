import React, { createContext, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosLib from "axios";

export const AppContext = createContext({
  user: null,
  setUser: () => {},
});

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  const axios = useMemo(() => {
    const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const instance = axiosLib.create({
      baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return instance;
  }, []);

  return { ...ctx, axios, navigate };
};
