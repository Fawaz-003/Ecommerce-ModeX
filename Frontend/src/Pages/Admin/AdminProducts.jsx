import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>
      <button onClick={() => navigate("/admin/products/add")} className="px-4 py-2 bg-orange-500 text-white rounded-lg">+ Add Product</button>
      <table className="w-full mt-5 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">₹{p.price}</td>
              <td className="p-2 border">
                <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2">Edit</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;