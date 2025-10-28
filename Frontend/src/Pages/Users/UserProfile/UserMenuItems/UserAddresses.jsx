import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";

const OpenModel = ({
  isOpen,
  title,
  message,
  btnMessage,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-800/10 flex justify-center items-center z-50">
      <div className="flex flex-col gap-5 items-center w-100 bg-gray-50 p-7 px-10 shadow-lg shadow-gray-400 rounded-xl">
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75"
              stroke="#DC2626"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-gray-900 font-semibold text-xl">{title}</h2>
        <p className="text-sm text-gray-600 text-center">{message}</p>
        <div className="flex gap-5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            {btnMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const { axios } = useAppContext();
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    addressId: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    doorNo: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    label: "Home",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const uid = userData?._id || userData?.id;
    if (uid) {
      setUserId(uid);
      ensureProfile(uid).then(() => fetchAddresses(uid));
    } else {
      setLoading(false);
    }
  }, []);

  const ensureProfile = async (uid) => {
    try {
      await axios.post(`/api/profile/create/${uid}`);
    } catch (e) {
      // ignore if exists
    }
  };

  const fetchAddresses = async (uid) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile/${uid}`);
      const data = response.data;
      if (data && data.profile && Array.isArray(data.profile.addresses)) {
        setAddresses(data.profile.addresses);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditMode(false);
    setCurrentAddress(null);
    setFormData({
      name: "",
      phone: "",
      doorNo: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      label: "Home",
    });
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditMode(true);
    setCurrentAddress(address);
    setFormData({
      name: address.name || "",
      phone: address.phone || "",
      doorNo: address.doorNo || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
      label: address.label || "Home",
    });
    setShowModal(true);
  };

  const handleDeleteClick = (addressId) => {
    setDeleteModal({
      isOpen: true,
      addressId: addressId,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `/api/addresses/remove/${userId}/${deleteModal.addressId}`
      );

      if (response.status === 200) {
        setAddresses(
          addresses.filter((addr) => addr._id !== deleteModal.addressId)
        );
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeleteModal({ isOpen: false, addressId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, addressId: null });
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.doorNo ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.country
    ) {
      toast.warning("Please fill in all required fields");
      return;
    }

    try {
      if (editMode) {
        const response = await axios.put(
          `/api/addresses/edit/${userId}/${currentAddress._id}`,
          formData
        );

        if (response.status === 200) {
          setAddresses(
            addresses.map((addr) =>
              addr._id === currentAddress._id
                ? { ...formData, _id: addr._id }
                : addr
            )
          );
          toast.success("Address updated successfully");
          setShowModal(false);
        }
      } else {
        const response = await axios.post(
          `/api/addresses/add/${userId}`,
          formData
        );

        if (response.status === 200 || response.status === 201) {
          fetchAddresses(userId);
          toast.success("Address added successfully");
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(
        editMode ? "Failed to update address" : "Failed to add address"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Addresses
            </h1>
            <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={20} />
            Add New Address
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-600 mb-4">
              Add your first delivery address to get started
            </p>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow relative"
              >
                <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {address.label || "Home"}
                </span>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {address.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                </div>
                <div className="text-gray-700 space-y-1 mb-4">
                  <p>
                    {address.doorNo}, {address.street}
                  </p>
                  <p>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(address)}
                    className="flex items-center gap-2 flex-1 justify-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address._id)}
                    className="flex items-center gap-2 flex-1 justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800/10 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editMode ? "Edit Address" : "Add New Address"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Door No / Flat No *
                  </label>
                  <input
                    type="text"
                    name="doorNo"
                    value={formData.doorNo}
                    onChange={handleInputChange}
                    placeholder="24/44"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Filter Bed Road, Saidapet"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Label *
                  </label>
                  <select
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editMode ? "Update Address" : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <OpenModel
        isOpen={deleteModal.isOpen}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        btnMessage="Delete"
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default UserAddresses;
