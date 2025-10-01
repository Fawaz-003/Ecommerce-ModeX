import { createContext, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosLib from "axios";

export const AppContext = createContext({
  user: null,
  setUser: () => {},
  backendURL: "",
});

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const axios = useMemo(() => {
    return axiosLib.create({
      baseURL: backendURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, [backendURL]);

  const value = useMemo(() => ({ user, setUser, axios, navigate, backendURL }), [user, axios, navigate, backendURL]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
