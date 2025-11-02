import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Trash2, ArrowLeft, CreditCard, Wallet, Plus, Minus } from 'lucide-react';
import { 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  getCartTotal,
  getCartItemCount 
} from '../utils/cartUtils';
import { toast } from 'react-toastify';

const Cart = () => {
    const [showAddress, setShowAddress] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const navigate = useNavigate();

    // Load cart items on component mount and when cart updates
    useEffect(() => {
        loadCart();
        
        // Listen for cart updates
        const handleCartUpdate = () => {
            loadCart();
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const loadCart = () => {
        const cart = getCart();
        setCartItems(cart);
        setCartCount(getCartItemCount());
    };

    const handleQuantityChange = (productId, size, color, newQuantity) => {
        const result = updateCartQuantity(productId, size, color, newQuantity);
        if (result.success) {
            loadCart();
            toast.success('Quantity updated', {
                position: 'top-right',
                autoClose: 1500,
            });
        } else {
            toast.error(result.message || 'Failed to update quantity', {
                position: 'top-right',
            });
        }
    };

    const handleRemoveItem = (productId, size, color, productName) => {
        if (window.confirm(`Remove "${productName}" from cart?`)) {
            removeFromCart(productId, size, color);
            loadCart();
            toast.success('Item removed from cart', {
                position: 'top-right',
                autoClose: 1500,
            });
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear the entire cart?')) {
            clearCart();
            loadCart();
            toast.success('Cart cleared', {
                position: 'top-right',
                autoClose: 1500,
            });
        }
    };

    const calculateSubtotal = () => {
        return getCartTotal();
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.02; // 2% tax
    };

    const calculateShipping = () => {
        return 0; // Free shipping
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateShipping();
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 min-h-[70vh] bg-gray-50">
                <div className="text-center max-w-md px-4">
                    <div className="bg-indigo-100 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-indigo-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items Section */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Items in Cart</h2>
                                {cartItems.length > 0 && (
                                    <button 
                                        onClick={handleClearCart}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear Cart
                                    </button>
                                )}
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Product Image */}
                                            <div 
                                                className="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-indigo-500 transition-colors flex-shrink-0 bg-white"
                                                onClick={() => navigate(`/products/${item.productId}`)}
                                            >
                                                <img 
                                                    className="w-full h-full object-cover" 
                                                    src={item.productImage || "https://via.placeholder.com/150"} 
                                                    alt={item.productName} 
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 
                                                        className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
                                                        onClick={() => navigate(`/products/${item.productId}`)}
                                                    >
                                                        {item.productName}
                                                    </h3>
                                                    
                                                    {/* Variant Details */}
                                                    <div className="flex flex-wrap gap-4 mb-4">
                                                        {/* Size */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600 font-medium">Size:</span>
                                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-sm font-semibold">
                                                                {item.variant.size}
                                                            </span>
                                                        </div>

                                                        {/* Color */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600 font-medium">Color:</span>
                                                            <div className="flex items-center gap-2">
                                                                <div 
                                                                    className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                                                                    style={{ backgroundColor: item.variant.color }}
                                                                    title={item.variant.color}
                                                                ></div>
                                                                <span className="text-xs text-gray-500 capitalize">
                                                                    {item.variant.color}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-sm text-gray-600 font-medium">Price:</span>
                                                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                                                                <IndianRupee className="w-4 h-4" />
                                                                {item.variant.price}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity and Actions */}
                                                <div className="flex items-center justify-between">
                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.productId, item.variant.size, item.variant.color, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="px-4 py-1 border-x border-gray-300 font-semibold min-w-[3rem] text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange(item.productId, item.variant.size, item.variant.color, item.quantity + 1)}
                                                                disabled={item.quantity >= item.variant.quantity}
                                                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <span className="text-xs text-gray-400">
                                                            (Max: {item.variant.quantity})
                                                        </span>
                                                    </div>

                                                    {/* Item Total and Remove */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">Item Total</p>
                                                            <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                                                <IndianRupee className="w-4 h-4" />
                                                                {(item.variant.price * item.quantity).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleRemoveItem(item.productId, item.variant.size, item.variant.color, item.productName)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Continue Shopping Button */}
                        <button 
                            className="mt-6 flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors group"
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Continue Shopping
                        </button>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:w-96">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                {/* Delivery Address */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 uppercase mb-3">Delivery Address</p>
                                    <div className="relative">
                                        <p className="text-gray-600 text-sm mb-2">No address found</p>
                                        <button 
                                            onClick={() => setShowAddress(!showAddress)} 
                                            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                                        >
                                            {showAddress ? 'Cancel' : 'Change'}
                                        </button>
                                        {showAddress && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 overflow-hidden">
                                                <p 
                                                    onClick={() => setShowAddress(false)} 
                                                    className="text-gray-600 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                                                >
                                                    New York, USA
                                                </p>
                                                <p 
                                                    onClick={() => setShowAddress(false)} 
                                                    className="text-indigo-600 text-center cursor-pointer p-3 hover:bg-indigo-50 font-medium"
                                                >
                                                    Add address
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 uppercase mb-3">Payment Method</p>
                                    <div className="relative">
                                        <select 
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="COD">Cash On Delivery</option>
                                            <option value="Online">Online Payment</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {paymentMethod === 'Online' ? (
                                                <CreditCard className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <Wallet className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-6 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Price ({cartCount} items)</span>
                                        <span className="flex items-center gap-1 font-medium text-gray-900">
                                            <IndianRupee className="w-4 h-4" />
                                            {calculateSubtotal().toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Shipping Fee</span>
                                        <span className="text-green-600 font-medium">
                                            {calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tax (2%)</span>
                                        <span className="flex items-center gap-1 text-gray-900">
                                            <IndianRupee className="w-4 h-4" />
                                            {calculateTax().toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t-2 border-gray-200 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                        <span className="flex items-center gap-1 text-xl font-bold text-indigo-600">
                                            <IndianRupee className="w-5 h-5" />
                                            {calculateTotal().toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Place Order / Checkout Button */}
                                <button 
                                    className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                                        paymentMethod === 'Online' 
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    {paymentMethod === 'Online' ? 'Proceed to Checkout' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;