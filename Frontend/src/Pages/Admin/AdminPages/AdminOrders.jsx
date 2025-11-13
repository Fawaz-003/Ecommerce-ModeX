import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../../../Context/AppContext.jsx";
import { toast } from "react-toastify";
import { 
  IndianRupee, 
  Package, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axios } = useAppContext();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/orders");
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        setError("Failed to fetch orders");
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Payment Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Error Loading Orders
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-indigo-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Package className="w-16 h-16 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No orders yet
            </h2>
            <p className="text-gray-600">
              Orders will appear here once customers place them.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Manage Orders
            </h1>
            <p className="text-gray-600">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "Failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Section - Products */}
                  <div className="lg:col-span-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-white">
                            <img
                              className="w-full h-full object-cover"
                              src={
                                item.product?.images?.[0]?.url ||
                                "https://via.placeholder.com/150"
                              }
                              alt={item.product?.name || "Product"}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              {item.product?.name || "Product Name"}
                            </h5>
                            {item.product?.brand && (
                              <p className="text-sm text-gray-600 mb-2">
                                Brand: {item.product.brand}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Size:</span>
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm font-semibold">
                                  {item.size}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Color:</span>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                                    style={{ backgroundColor: item.color }}
                                    title={item.color}
                                  ></div>
                                  <span className="text-xs text-gray-500 capitalize">
                                    {item.color}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Qty:</span>
                                <span className="font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600">Price:</span>
                                <span className="flex items-center gap-1 text-green-600 font-semibold">
                                  <IndianRupee className="w-4 h-4" />
                                  {item.price}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <span className="text-sm text-gray-600">Item Total: </span>
                              <span className="flex items-center gap-1 text-lg font-bold text-gray-900">
                                <IndianRupee className="w-4 h-4" />
                                {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Section - Order Summary & Details */}
                  <div className="lg:col-span-4">
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Customer
                        </h4>
                        <p className="text-gray-900 font-medium">
                          {order.customerName || order.user?.name || "N/A"}
                        </p>
                        {order.user?.email && (
                          <p className="text-sm text-gray-600 mt-1">
                            {order.user.email}
                          </p>
                        )}
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p className="font-medium">
                              {order.shippingAddress.name || order.shippingAddress.fullName || "N/A"}
                            </p>
                            {order.shippingAddress.label && (
                              <p className="text-xs text-gray-500 italic">
                                ({order.shippingAddress.label})
                              </p>
                            )}
                            <p>
                              {order.shippingAddress.doorNo && `${order.shippingAddress.doorNo}, `}
                              {order.shippingAddress.street || order.shippingAddress.address || "N/A"}
                            </p>
                            {order.shippingAddress.city && (
                              <p>
                                {order.shippingAddress.city}
                                {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
                              </p>
                            )}
                            {(order.shippingAddress.postalCode || order.shippingAddress.pincode) && (
                              <p>PIN: {order.shippingAddress.postalCode || order.shippingAddress.pincode}</p>
                            )}
                            {order.shippingAddress.phone && (
                              <p>Phone: {order.shippingAddress.phone}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment Details */}
                      {order.paymentDetails && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">Payment Verified</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Payment ID: </span>
                              <span className="font-mono text-xs text-gray-900 break-all">
                                {order.paymentDetails.razorpay_payment_id}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Order ID: </span>
                              <span className="font-mono text-xs text-gray-900 break-all">
                                {order.paymentDetails.razorpay_order_id}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>Signature verified</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Order Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Items ({order.items.length})
                            </span>
                            <span className="font-medium text-gray-900">
                              {order.items.reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}{" "}
                              items
                            </span>
                          </div>
                          <div className="pt-2 border-t border-indigo-200">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-900">
                                Total Amount
                              </span>
                              <span className="flex items-center gap-1 text-xl font-bold text-indigo-600">
                                <IndianRupee className="w-5 h-5" />
                                {order.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;