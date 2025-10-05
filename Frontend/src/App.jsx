import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Collections from "./Pages/Collections";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Login from "./Pages/Users/Login";
import Register from "./Pages/Users/Register";
import UserProfile from "./Pages/Users/UserProfile/UserProfileLayout";
import WishList from "./Pages/WishList";

import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import BottomNav from "./Layout/BottomNav";
import MobileFilter from "./Layout/MobileFilter";

import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminPages/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminPages/AdminProducts";
import AdminOrders from "./Pages/Admin/AdminPages/AdminOrders";
import AdminUsers from "./Pages/Admin/AdminPages/AdminUsers";
import AdminMenu from "./Pages/Admin/Components/AdminMenu";
import AddProducts from "./Pages/Admin/Actions/AddProducts";
import EditProducts from "./Pages/Admin/Actions/EditProducts";
import AdminSettings from "./Pages/Admin/AdminPages/AdminSettings";
import AdminCategory from "./Pages/Admin/AdminPages/AdminCategory";
import AddCategory from "./Pages/Admin/Actions/AddCategory";
import EditCategory from "./Pages/Admin/Actions/EditCategory";

import { ToastContainer } from "react-toastify";
import UserRoute from "./Routes/UersRoute";
import { useAppContext } from "./Context/AppContext";
import ProductDetail from "./Layout/ProductDetail";
import AuthSuccess from "./Pages/Users/AuthSuccess";

const App = () => {
  const location = useLocation();
  const { axios } = useAppContext();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const hideNavAndFooter = location.pathname.startsWith("/admin");
  const hideBottomNav =
    location.pathname.startsWith("/admin") ||
    isMobileFilterOpen;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/ping`)
      .then(() => console.log("Backend pre-warmed"))
      .catch((err) => console.log("Pre-warm failed:", err));
  }, []);

    useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "auto";
  }, [isMobileFilterOpen]);

  return (
    <div className="relative min-h-screen pb-16">
      {!hideNavAndFooter && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections setIsMobileFilterOpen={setIsMobileFilterOpen} />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <UserProfile />
            </UserRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminMenu />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products">
            <Route index element={<AdminProducts />} />
            <Route path="add" element={<AddProducts />} />
            <Route path="edit/:id" element={<EditProducts />} />
          </Route>
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="categories">
            <Route index element={<AdminCategory />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="editcategory/:id" element={<EditCategory />} />
          </Route>
        </Route>
      </Routes>

      {/* Footer */}
      {!hideNavAndFooter && <Footer />}

      {/* Bottom Navigation */}
      {!hideBottomNav && <BottomNav />}
      <BottomNav hidden={isMobileFilterOpen || hideBottomNav} />


      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <MobileFilter
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
