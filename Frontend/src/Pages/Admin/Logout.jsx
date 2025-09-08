import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-[#e01e37] text-white rounded-lg hover:bg-red-500 hover:cursor-pointer transition flex items-center"
    >
      <LogOut size={18} className="m-1.5"/>
      Logout
    </button>
  );
};

export default Logout;