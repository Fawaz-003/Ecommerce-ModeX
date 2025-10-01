import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";

export default function CategoryListing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { axios } = useAppContext();

  const getCategories = async () => {
    try {
      let response = await axios.get("/api/category/list");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories", err);
      toast.error("Failed to fetch categories");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await axios.delete(`/api/category/delete/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || "Category deleted successfully");
        getCategories(); // refresh list after delete
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category", err);
      toast.error("Error deleting category");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            📂 Category Listing
          </h2>
          <button
            onClick={() => navigate("/admin/categories/addcategory")}
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Category
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">
            No categories available. Create one to get started 🚀
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="border-b p-4 text-left">Category</th>
                  <th className="border-b p-4 text-left">Subcategories</th>
                  <th className="border-b p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr
                    key={cat._id || index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {cat.name}
                    </td>
                    <td className="p-4 text-gray-600">
                      {cat.subcategory?.length > 0
                        ? cat.subcategory.join(", ")
                        : "—"}
                    </td>
                    <td className="p-4 flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/categories/editcategory/${cat._id}`)
                        }
                        className="px-4 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
