<<<<<<< HEAD:Frontend/src/Pages/Admin/Logout.jsx
//import { useNavigate } from "react-router-dom";
import {useAppContext} from '../../Context/AppContext.jsx';


=======
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
>>>>>>> a302d21554baefe7adfee39872eedcc64e890103:Frontend/src/Pages/Admin/Components/Logout.jsx

const Logout = () => {
  const {navigate} = useAppContext();
  //const navigate = useNavigate();

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