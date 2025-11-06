import { createContext, useMemo, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosLib from "axios";
import { syncLocalCartToBackend } from "../utils/cartUtils";

export const AppContext = createContext({
  user: null,
  setUser: () => {},
  wishlist: [],
  fetchWishlist: async () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  backendURL: "",
});

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const axios = useMemo(() => {
    return axiosLib.create({
      baseURL: backendURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
  }, [backendURL]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("user-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [axios]);

  const fetchWishlist = useCallback(async () => {
    if (!user?._id) {
      setWishlist([]);
      return;
    }
    try {
      const res = await axios.get(`/api/profile/${user._id}`);
      const wishlistItems = res.data.profile.wishlist || [];
      setWishlist(wishlistItems.map(item => item.product));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setWishlist([]);
    }
  }, [axios, user]);

  const addToWishlist = useCallback(async (productId) => {
    if (!user?._id) return;
    await axios.post(`/api/wishlist/add/${user._id}`, { productId }); 
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, [axios, user]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!user?._id) return;
    await axios.delete(`/api/wishlist/remove/${user._id}`, { data: { productId } });
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, [axios, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      fetchWishlist();
    } else {
      localStorage.removeItem("user");
      setWishlist([]);
    }

    // If user just logged in and there's a local cart, sync it.
    const localCart = localStorage.getItem('local-cart');
    if (user && localCart) {
      syncLocalCartToBackend(axios);
    }
  }, [user, fetchWishlist]);

  const value = useMemo(
    () => ({
      user, setUser, axios, navigate, backendURL, wishlist, fetchWishlist, addToWishlist, removeFromWishlist
    }),
    [user, axios, navigate, backendURL, wishlist, fetchWishlist, addToWishlist, removeFromWishlist]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
