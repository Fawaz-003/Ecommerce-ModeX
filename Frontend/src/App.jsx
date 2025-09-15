import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Collections from "./Pages/Collections";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Login from "./Pages/Users/Login";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import WishList from "./Pages/WishList";
import Register from "./Pages/Users/Register";
import Profile from "./Pages/Users/Profile";
import AdminRoute from "./Routes/AdminRoute";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminOrders from "./Pages/Admin/AdminOrders";
import AdminUsers from "./Pages/Admin/AdminUsers";
import { ToastContainer } from "react-toastify";
import UserRoute from "./Routes/UersRoute";
import { useEffect } from "react";
import AdminMenu from "./Pages/Admin/Components/AdminMenu";
import AddProducts from "./Pages/Admin/Components/AddProducts";

const App = () => {
  const location = useLocation();

  // All paths that should NOT show Navbar and Footer
  const hideNavAndFooter = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Pre-warm the server when app loads
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ping`)
      .then(() => console.log("Backend pre-warmed"))
      .catch((err) => console.log("Pre-warm failed:", err));
  }, []);

  return (
    <div>
      {/* Show Navbar only if NOT in admin area */}
      {!hideNavAndFooter && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />

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
          </Route>
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

export default App;
