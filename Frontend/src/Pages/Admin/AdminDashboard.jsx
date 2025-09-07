import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logout from "./Logout";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("user-token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("user-token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (loading) return <p className="p-10 text-center">Checking authentication...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
   
      <aside className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">Modex Admin</h2>
        <nav className="space-y-4">
          <Link to="products" className="block text-gray-700 hover:text-orange-500">
            Products
          </Link>
          <Link to="users" className="block text-gray-700 hover:text-orange-500">
            Users
          </Link>
          <Link to="orders" className="block text-gray-700 hover:text-orange-500">
            Orders
          </Link>
          <Logout />
        </nav>
      </aside>


      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
