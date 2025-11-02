// Cart utility functions for managing cart in localStorage

const CART_KEY = 'ecommerce_cart';

// Get cart from localStorage
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch custom event to notify cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// Add item to cart
export const addToCart = (product, variant, quantity = 1) => {
  const cart = getCart();
  
  // Check if item with same product, size, and color already exists
  const existingItemIndex = cart.findIndex(
    item => 
      item.productId === product._id && 
      item.variant.size === variant.size && 
      item.variant.color === variant.color
  );

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
    
    // Check stock availability
    if (cart[existingItemIndex].quantity > variant.quantity) {
      return { success: false, message: 'Insufficient stock available' };
    }
  } else {
    // Add new item
    const cartItem = {
      productId: product._id,
      productName: product.name,
      productImage: product.images?.[0]?.url || '',
      variant: {
        size: variant.size,
        color: variant.color,
        price: variant.price,
        quantity: variant.quantity, // available stock
      },
      quantity: quantity,
      addedAt: new Date().toISOString(),
    };
    
    cart.push(cartItem);
  }

  saveCart(cart);
  return { success: true, message: 'Added to cart successfully' };
};

// Remove item from cart
export const removeFromCart = (productId, size, color) => {
  const cart = getCart();
  const updatedCart = cart.filter(
    item => !(
      item.productId === productId && 
      item.variant.size === size && 
      item.variant.color === color
    )
  );
  saveCart(updatedCart);
  return { success: true };
};

// Update item quantity in cart
export const updateCartQuantity = (productId, size, color, newQuantity) => {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    item => 
      item.productId === productId && 
      item.variant.size === size && 
      item.variant.color === color
  );

  if (itemIndex !== -1) {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      return removeFromCart(productId, size, color);
    }
    
    // Check stock availability
    if (newQuantity > cart[itemIndex].variant.quantity) {
      return { success: false, message: 'Insufficient stock available' };
    }
    
    cart[itemIndex].quantity = newQuantity;
    saveCart(cart);
    return { success: true };
  }
  
  return { success: false, message: 'Item not found in cart' };
};

// Clear entire cart
export const clearCart = () => {
  saveCart([]);
  return { success: true };
};

// Get cart total
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + (item.variant.price * item.quantity);
  }, 0);
};

// Get cart item count
export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Check if item is in cart
export const isItemInCart = (productId, size, color) => {
  const cart = getCart();
  return cart.some(
    item => 
      item.productId === productId && 
      item.variant.size === size && 
      item.variant.color === color
  );
};
