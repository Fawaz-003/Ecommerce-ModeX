import { useState, useMemo } from "react";

export const useProductFilters = (allProducts) => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const priceRanges = useMemo(
    () => [
      { label: "Under ₹500", min: 0, max: 500 },
      { label: "₹500 - ₹1,000", min: 500, max: 1000 },
      { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
      { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
      { label: "Over ₹5,000", min: 5000, max: Infinity },
    ],
    []
  );

  const categories = useMemo(
    () => [...new Set(allProducts.map((p) => p.categoryName))],
    [allProducts]
  );
  const brands = useMemo(
    () => [...new Set(allProducts.map((p) => p.brand))],
    [allProducts]
  );

  const togglePriceRange = (range) => {
    setSelectedPriceRanges((prev) =>
      prev.some((r) => r.label === range.label)
        ? prev.filter((r) => r.label !== range.label)
        : [...prev, range]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setShowInStockOnly(false);
    setMinRating(0);
    setSearchQuery("");
    setSortBy("name");
  };

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];
    const lowercasedQuery = searchQuery.toLowerCase();

    if (lowercasedQuery) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowercasedQuery) ||
          p.brand.toLowerCase().includes(lowercasedQuery) ||
          p.categoryName.toLowerCase().includes(lowercasedQuery) ||
          p.subcategory.toLowerCase().includes(lowercasedQuery)
      );
    }

    if (selectedPriceRanges.length > 0) {
      products = products.filter((p) =>
        selectedPriceRanges.some(
          (range) => p.variant[0].price >= range.min && p.variant[0].price < range.max
        )
      );
    }

    if (selectedCategories.length > 0) {
      products = products.filter((p) => selectedCategories.includes(p.categoryName));
    }

    if (selectedBrands.length > 0) {
      products = products.filter((p) => selectedBrands.includes(p.brand));
    }

    if (showInStockOnly) {
      products = products.filter((p) => p.variant.some((v) => v.quantity > 0));
    }

    if (minRating > 0) {
      products = products.filter(
        (p) =>
          (p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length || 0) >=
          minRating
      );
    }

    products.sort((a, b) => {
      if (sortBy === "price-low") return a.variant[0].price - b.variant[0].price;
      if (sortBy === "price-high") return b.variant[0].price - a.variant[0].price;
      if (sortBy === "rating") {
        const ratingA = a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length || 0;
        const ratingB = b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length || 0;
        return ratingB - ratingA;
      }
      return a.name.localeCompare(b.name);
    });

    return products;
  }, [allProducts, searchQuery, selectedPriceRanges, selectedCategories, selectedBrands, showInStockOnly, minRating, sortBy]);

  return {
    filteredProducts,
    filters: {
      priceRanges, selectedPriceRanges, categories, selectedCategories,
      brands, selectedBrands, showInStockOnly, minRating, searchQuery, sortBy,
    },
    filterSetters: {
      togglePriceRange, toggleCategory, toggleBrand, setShowInStockOnly,
      setMinRating, setSearchQuery, setSortBy,
    },
    clearAllFilters,
  };
};