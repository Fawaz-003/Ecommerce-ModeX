import { useState, useEffect } from "react";
import { Edit3, Save, X, Camera, User } from "lucide-react";
import { useAppContext } from "../../../../Context/AppContext";

const PersonalInfo = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [userProfile, setUserProfile] = useState({
    phone: "",
    gender: "",
    dateOfBirth: "",
    profileImage: null,
  });
  const { axios } = useAppContext();
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setUser((prev) => ({ ...prev, profileImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleInputChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };
  const handleSave = () => {
    console.log("Saving user data:", user);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setUser(userData);
    fetchUserProfile(userData.id);
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/profile/${userId}`);
      const data = response.data.profile;
      setUserProfile(data);
      console.log("User profile data:", data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                {imagePreview || user.profileImage ? (
                  <img
                    src={imagePreview || user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">Profile Photo</p>
              <p className="text-sm text-gray-500">
                {isEditing
                  ? "Click the camera icon to change your photo"
                  : "Recommended size: 200x200 pixels"}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">
                {user.name || "Not provided"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            {isEditing ? (
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">
                {user.email || "Not provided"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={userProfile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-500 py-2">
                {userProfile.phone || "Not provided"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            {isEditing ? (
              <select
                value={userProfile.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className="text-gray-500 py-2 capitalize">
                {userProfile.gender || "Not provided"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={userProfile.dob}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-500 py-2">
                {userProfile.dob || "Not provided"}
              </p>
            )}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Account Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium"> 0 </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wishlist Items:</span>
                <span className="font-medium"> 0 </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reviews Given:</span>
                <span className="font-medium"> 0 </span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Wallet</h3>
            <div className="text-2xl font-bold text-green-600">₹0</div>
            <p className="text-sm text-gray-600">Available Balance</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Add Money
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
