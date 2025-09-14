import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext.jsx";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const {axios} = useAppContext();

  useEffect(() => {
    try {
    let res = axios.get("/api/orders");

    if(res){
      setOrders(res.data.orders);
    }

    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Orders</h1>
      <table className="w-full mt-5 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="p-2 border">{o._id}</td>
              <td className="p-2 border">{o.user?.name}</td>
              <td className="p-2 border">₹{o.total}</td>
              <td className="p-2 border">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AdminOrders;