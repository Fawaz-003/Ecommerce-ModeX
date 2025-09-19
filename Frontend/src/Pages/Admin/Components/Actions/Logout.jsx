import { LogOut } from "lucide-react";
import { useAppContext } from "../../../../Context/AppContext";



const Logout = () => {
  const { navigate } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full p-2 text-[17px] font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 hover:cursor-pointer transition flex items-center justify-center"
    >
      <LogOut size={19} className="m-1.5"/>
      <div>Sign Out</div>
    </button>
  );
};

export default Logout;