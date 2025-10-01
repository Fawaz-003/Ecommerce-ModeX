import React, { useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import { toast } from "react-toastify";

export default function CreateCategory() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const { axios , navigate} = useAppContext();

  // Add subcategory
  const handleAddSubcategory = () => {
    if (!subcategory.trim()) return;
    setSubcategories([...subcategories, subcategory.trim()]);
    setSubcategory("");
  };

  // Remove subcategory
  const handleRemove = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  // Edit subcategory
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(subcategories[index]);
  };

  const handleSaveEdit = (index) => {
    const updated = [...subcategories];
    updated[index] = editValue.trim();
    setSubcategories(updated);
    setEditIndex(null);
    setEditValue("");
  };

  // Submit category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) {
      toast.error("⚠️ Category name is required");
      return;
    }

    const payload = { name: category, subcategory: subcategories };

    try {
      const response = await axios.post("/api/category/add", payload);

      if (response.data.success) {
        toast.success(response.data.message || "✅ Category created successfully!");
        navigate("/admin/categories"); // ✅ direct navigation works
      } else {
        throw new Error(response.data.message || "❌ Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error.message);
      toast.error(error.message || "❌ Error creating category");
    }
  };

  return (
    <div className="p-8">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Category</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Category Name</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter category"
            />
          </div>

          {/* Subcategory */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Subcategory</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter subcategory"
              />
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Subcategory List */}
          <ul className="mt-4 space-y-2">
            {subcategories.map((sub, index) => (
              <li
                key={index}
                className="flex items-center justify-between border rounded-lg p-2 bg-gray-50"
              >
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 border rounded p-2 mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(index)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIndex(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-800">{sub}</span>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition mt-6"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}
