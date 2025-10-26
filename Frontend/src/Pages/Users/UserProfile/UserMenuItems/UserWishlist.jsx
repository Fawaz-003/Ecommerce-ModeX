import { useEffect, useState } from "react";
import ProductCard from "../../../../Components/ProductCard.jsx";
import { useAppContext } from "../../../../Context/AppContext.jsx";
import { toast } from "react-toastify";
import ProductCardSkeleton from "../../../../Components/ProductCardSkeleton.jsx";

const UserWishlist = () => {
  const { axios, user, wishlist, removeFromWishlist } = useAppContext();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If a product is removed from the global wishlist, filter it from the local state
    if (wishlist.length < wishlistProducts.length) {
      setWishlistProducts((prev) => prev.filter((p) => wishlist.includes(p._id)));
      return;
    }

    const fetchWishlistProducts = async () => {
      if (!user?._id || wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch actual product details for each ID in the global wishlist
        const productRes = await axios.post("/api/products/bulk", { ids: wishlist });
        setWishlistProducts(productRes.data.products);
      } catch (err) {
        console.error(err);
        setError("Failed to load wishlist products");
        toast.error("Failed to load wishlist products");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [axios, user, wishlist, wishlistProducts.length]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    );
  }
  if (error) return <p className="text-center py-16 text-red-600">{error}</p>;
  if (wishlist.length === 0 || wishlistProducts.length === 0) {
    return <p className="text-center py-16">Your wishlist is empty</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-medium">Favourite Products</h1>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
      {wishlistProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
    </div>
  );
};

export default UserWishlist;
