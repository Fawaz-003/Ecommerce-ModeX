import { LogOut } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Logout = () => {
  const { setUser, navigate } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
      <LogOut className="w-5 h-5" /> Logout
    </button>
  );
};

export default Logout;