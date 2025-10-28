import { useState, useEffect, useCallback } from "react";

const RECENTLY_VIEWED_KEY = "recentlyViewed";
const MAX_RECENTLY_VIEWED = 10;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (storedItems) {
        setRecentlyViewed(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to parse recently viewed items from localStorage", error);
      setRecentlyViewed([]);
    }
  }, []);

  const addProductToRecentlyViewed = useCallback((product) => {
    if (!product || !product._id) return;

    setRecentlyViewed((prevItems) => {
      // 1. Remove the product if it already exists to move it to the front.
      const filteredItems = prevItems.filter((item) => item._id !== product._id);

      // 2. Add the new product to the beginning of the array.
      const newItems = [product, ...filteredItems];

      // 3. Limit the array to the max size.
      const limitedItems = newItems.slice(0, MAX_RECENTLY_VIEWED);

      // 4. Save to localStorage.
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(limitedItems));
      } catch (error) {
        console.error("Failed to save recently viewed items to localStorage", error);
      }

      return limitedItems;
    });
  }, []);

  return { recentlyViewed, addProductToRecentlyViewed };
};