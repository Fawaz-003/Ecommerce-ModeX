import React, { useState, useEffect, useCallback } from "react";
import { ShieldCheck, ArrowLeft, IndianRupee, UserCheck } from "lucide-react";
import { useAppContext } from "../Context/AppContext";
import { getCart, getCartTotal } from "../utils/cartUtils";
import { toast } from "react-toastify";
import CartSkeleton from "../Layout/Skeleton/CartSkeleton";
import ProgressBar from "../Components/ProgressBar";
import AddressStep from "../Components/AddressStep";
import PaymentStep from "../Components/PaymentStep";
import AddressModal from "../Components/AddressModal";

const Checkout = () => {
  const { user, axios, navigate } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1); // 1: Login, 2: Address, 3: Payment, 4: Review
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginVerificationComplete, setIsLoginVerificationComplete] =
    useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentMethod: "cod",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });

  const handlePaymentInputChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = useCallback((address) => {
    setSelectedAddress(address);
  }, []);

  const fetchCheckoutData = useCallback(async () => {
    if (!user) {
      toast.error("Please login to proceed to checkout.");
      navigate("/login");
      return;
    }

    setLoading(true); // Show skeleton during verification and data fetch
    setIsLoginVerificationComplete(false); // Reset for new verification

    // Simulate login verification delay
    setTimeout(async () => {
      try {
        const [cartData, profileData] = await Promise.all([
          getCart(axios),
          axios.get(`/api/profile/${user._id}`),
        ]);

        if (cartData.length === 0) {
          navigate("/cart");
          return;
        }
        setCartItems(cartData);
        setAddresses(profileData.data.profile.addresses || []);
        if (profileData.data.profile.addresses?.length > 0) {
          // Pre-select the first address
          handleAddressSelect(profileData.data.profile.addresses[0]);
        }
      } catch (error) {
        console.error("Failed to load checkout data:", error);
        toast.error("Could not load checkout information.");
        navigate("/cart");
      } finally {
        setLoading(false);
        setIsLoginVerificationComplete(true); // Mark verification as complete after data fetch attempt
      }
    }, 1500); // 1.5 seconds delay
  }, [user, axios, navigate, handleAddressSelect]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const subtotal = getCartTotal(cartItems);
  const shipping = subtotal > 500 ? 0 : 50; // Example shipping logic
  const platformFee = 20;
  const tax = subtotal * 0.01; // 1% tax
  const total = subtotal + shipping + tax + platformFee;

  const handleAddNewAddress = useCallback(() => {
    setEditMode(false);
    setAddressToEdit(null);
    setIsAddressModalOpen(true);
  }, []);

  const handleEditAddress = useCallback((address) => {
    setEditMode(true);
    setAddressToEdit(address);
    setIsAddressModalOpen(true);
  }, []);

  const handleSaveAddress = async (formData) => {
    try {
      if (editMode && addressToEdit) {
        // Update existing address
        const response = await axios.put(
          `/api/addresses/edit/${user._id}/${addressToEdit._id}`,
          formData
        );
        if (response.status === 200) {
          toast.success("Address updated successfully");
        }
      } else {
        // Add new address
        const response = await axios.post(
          `/api/addresses/add/${user._id}`,
          formData
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("Address added successfully");
        }
      }
      // Refetch addresses and close modal
      await fetchCheckoutData();
      setIsAddressModalOpen(false);
      setEditMode(false);
      setAddressToEdit(null);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(
        editMode ? "Failed to update address" : "Failed to add address"
      );
    }
  };

  const handleStepClick = (stepNumber) => {
    // Allow navigation only to previous, completed steps
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  if (loading) {
    return <CartSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        editMode={editMode}
        addressToEdit={addressToEdit}
        userId={user?._id}
        onSave={handleSaveAddress}
      />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Please complete the steps below to place your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Section - Steps */}
          <div className="lg:col-span-8">
            <ProgressBar
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
            {currentStep > 1 && currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="mt-6 flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            )}
            <div className="mt-8">
              {currentStep === 1 && ( // Login Step (implicitly handled by useEffect)
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                    Login Verification
                  </h3>
                  {!isLoginVerificationComplete ? (
                    <div className="text-center">
                      <p className="text-gray-600">
                        Verifying your credentials...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <UserCheck className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-800">
                            Logged in as {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                      >
                        Continue to Addresses
                      </button>
                    </>
                  )}
                </div>
              )}

              {currentStep === 2 && ( // Address Step
                <AddressStep
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  handleAddressSelect={handleAddressSelect}
                  handleAddNewAddress={handleAddNewAddress}
                  handleEditAddress={handleEditAddress}
                  onContinue={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 3 && ( // Payment Step
                <PaymentStep
                  formData={paymentData}
                  handleInputChange={handlePaymentInputChange}
                  onContinue={() => setCurrentStep(4)}
                />
              )}
              {currentStep === 4 && ( // Final Review Step
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Review Your Order
                  </h3>
                  <p className="text-gray-600">
                    Please review your order details on the right and click
                    "Place Order" to complete your purchase.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Right Section - Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Products */}
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium mb-2 px-1">
                  <span className="flex-1">Product</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="w-20 text-right">Price</span>
                </div>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.product._id}-${item.color}-${item.size}`}
                      className="flex justify-between items-center text-sm gap-2"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                          <img
                            src={item.product.images[0]?.url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-gray-700 font-medium truncate">
                          {item.product.name}
                        </span>
                      </div>
                      <span className="w-12 text-center font-bold text-gray-600">
                        {item.quantity}
                      </span>
                      <span className="w-20 text-right font-medium flex items-center justify-end text-gray-900">
                        <IndianRupee size={12} className="mr-0.5" />
                        {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900 flex items-center">
                      <IndianRupee size={12} className="mr-1" />
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium text-gray-900 flex items-center">
                      <IndianRupee size={12} className="mr-1" />
                      {platformFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600 flex items-center">
                      {shipping === 0 ? (
                        "FREE"
                      ) : (
                        <>
                          <IndianRupee size={12} className="mr-1" />
                          {shipping.toFixed(2)}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Tax (1%)</span>
                    <span className="font-medium text-gray-900 flex items-center">
                      <IndianRupee size={12} className="mr-1" />
                      {tax.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-200 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="flex items-center gap-1 text-xl font-bold text-indigo-600">
                      <IndianRupee className="w-5 h-5" />
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  // onClick={handlePlaceOrder} // TODO: Implement place order logic
                  disabled={currentStep < 4}
                  className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                  <p className="text-sm text-gray-600">
                    Secure payment. Your information is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
