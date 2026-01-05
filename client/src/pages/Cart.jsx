// client/src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Shield,
  Truck,
  CreditCard,
  Lock,
  Package,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  Heart,
  RefreshCw,
  Gift,
  Tag,
  Clock
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  
  // Use the cart context with fallback values
  const cartContext = useCart ? useCart() : {
    cartItems: [],
    updateQuantity: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    cartCount: 0,
    getCartTotal: () => 0
  };

  const { 
    cartItems = [], 
    updateQuantity = () => {}, 
    removeFromCart = () => {}, 
    clearCart = () => {}, 
    cartCount = 0, 
    getCartTotal = () => 0 
  } = cartContext;
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Mock shipping methods
  const shippingMethods = [
    { id: 'standard', name: 'Standard Delivery', price: 4.99, duration: '3-5 business days', icon: <Truck size={20} /> },
    { id: 'express', name: 'Express Delivery', price: 9.99, duration: '1-2 business days', icon: <Clock size={20} /> },
    { id: 'pickup', name: 'Store Pickup', price: 0, duration: 'Ready in 2 hours', icon: <Package size={20} /> }
  ];

  // Mock suggested products
  const mockSuggestedProducts = [
    { 
      id: 201, 
      name: 'Wireless Earbuds Pro', 
      price: 89.99, 
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?auto=format&fit=crop&w=800&q=80',
      discount: 30
    },
    { 
      id: 202, 
      name: 'Smart Watch Series 3', 
      price: 199.99, 
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      discount: 20
    },
    { 
      id: 203, 
      name: 'USB-C Fast Charger', 
      price: 24.99, 
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1565693412916-6e8e5bdf3f8e?auto=format&fit=crop&w=800&q=80',
      discount: 37
    }
  ];

  useEffect(() => {
    // Load suggested products
    setSuggestedProducts(mockSuggestedProducts);
    
    // Select all items by default
    setSelectedItems(cartItems.map(item => item.id));
  }, [cartItems]);

  const handleQuantityChange = (id, type) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
    
    if (newQuantity < 1) {
      setItemToDelete(id);
      setShowDeleteConfirm(true);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } else {
      setSelectedItems(prev => [...prev, id]);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim() && !promoApplied) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        if (promoCode.toLowerCase() === 'save20') {
          setDiscount(20);
          setPromoApplied(true);
        } else if (promoCode.toLowerCase() === 'jumia10') {
          setDiscount(10);
          setPromoApplied(true);
        } else {
          alert('Invalid promo code. Try "SAVE20" or "JUMIA10"');
        }
        setIsLoading(false);
      }, 500);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setDiscount(0);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to proceed to checkout');
      return;
    }
    
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      navigate('/checkout');
      setIsCheckingOut(false);
    }, 1000);
  };

  const getSelectedItemsTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const method = shippingMethods.find(m => m.id === shippingMethod);
    return method ? method.price : 0;
  };

  const getSubtotal = () => {
    return getSelectedItemsTotal();
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = getShippingCost();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + shipping - discountAmount;
  };

  const getSelectedCount = () => {
    return selectedItems.length;
  };

  const getSelectedWeight = () => {
    // Mock weight calculation
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + (item.quantity * 0.5), 0)
      .toFixed(1);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="text-gray-400" size={48} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Browse Products
              </button>
            </div>
            
            {/* Suggested Products */}
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 mb-6">You might like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </div>
                      )}
                      <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                        <Heart size={18} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-lg text-gray-900">
                            ${product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <button className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 text-sm">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            <button
              onClick={clearCart}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Trash2 size={18} />
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Header */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedItems.length === cartItems.length
                        ? 'bg-orange-600 border-orange-600'
                        : 'border-gray-300 hover:border-orange-600'
                    }`}
                  >
                    {selectedItems.length === cartItems.length && (
                      <CheckCircle size={14} className="text-white" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Select all items ({getSelectedCount()}/{cartItems.length})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Total weight: {getSelectedWeight()} kg
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* Selection Checkbox */}
                      <div className="flex items-start">
                        <button
                          onClick={() => handleSelectItem(item.id)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all mt-1 ${
                            selectedItems.includes(item.id)
                              ? 'bg-orange-600 border-orange-600'
                              : 'border-gray-300 hover:border-orange-600'
                          }`}
                        >
                          {selectedItems.includes(item.id) && (
                            <CheckCircle size={14} className="text-white" />
                          )}
                        </button>
                      </div>

                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.id}`}
                              className="font-medium text-gray-900 hover:text-orange-600 transition-colors text-sm md:text-base line-clamp-2"
                            >
                              {item.title || 'Product Name'}
                            </Link>
                            <p className="text-gray-500 text-sm mt-1">
                              Brand: <span className="font-medium">{item.brand || 'Generic'}</span>
                            </p>
                            
                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mt-2">
                              {item.stock > 10 ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs">
                                  <CheckCircle size={12} />
                                  <span>In Stock</span>
                                </div>
                              ) : item.stock > 0 ? (
                                <div className="flex items-center gap-1 text-yellow-600 text-xs">
                                  <AlertCircle size={12} />
                                  <span>Only {item.stock} left</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600 text-xs">
                                  <X size={12} />
                                  <span>Out of Stock</span>
                                </div>
                              )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mt-3">
                              {(item.tags || []).slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex flex-col items-end">
                            <div className="text-right mb-3">
                              <div className="text-xl font-bold text-gray-900">
                                ${((item.price || 0) * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item.price || 0} × {item.quantity}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 mb-4">
                              <button
                                onClick={() => handleQuantityChange(item.id, 'decrease')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-medium text-gray-900 w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 'increase')}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                disabled={item.quantity >= (item.stock || 99)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setItemToDelete(item.id);
                                  setShowDeleteConfirm(true);
                                }}
                                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                              >
                                <Trash2 size={16} />
                                Remove
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-sm">
                                <Heart size={16} />
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Gift size={20} />
                      <h3 className="font-bold text-lg">Apply Promo Code</h3>
                    </div>
                    <p className="text-sm text-white/90">
                      Save more with promo codes! Try "SAVE20" for 20% off or "JUMIA10" for 10% off
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent w-full md:w-48"
                      disabled={promoApplied}
                    />
                    {promoApplied ? (
                      <button
                        onClick={handleRemovePromo}
                        className="px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyPromo}
                        disabled={isLoading || !promoCode.trim()}
                        className="px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {isLoading ? 'Applying...' : 'Apply'}
                      </button>
                    )}
                  </div>
                </div>
                {promoApplied && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span className="font-medium">Promo Applied: {promoCode.toUpperCase()}</span>
                      </div>
                      <span className="font-bold">-{discount}% OFF</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({getSelectedCount()} items)</span>
                      <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                    </div>
                    
                    {/* Shipping Method */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">${getShippingCost().toFixed(2)}</span>
                      </div>
                      <div className="space-y-2">
                        {shippingMethods.map(method => (
                          <label
                            key={method.id}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              shippingMethod === method.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                shippingMethod === method.id
                                  ? 'border-orange-500 bg-orange-500'
                                  : 'border-gray-300'
                              }`}>
                                {shippingMethod === method.id && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {method.icon}
                                <div>
                                  <div className="font-medium text-sm">{method.name}</div>
                                  <div className="text-xs text-gray-500">{method.duration}</div>
                                </div>
                              </div>
                            </div>
                            <span className="font-bold">
                              {method.price === 0 ? 'FREE' : `$${method.price}`}
                            </span>
                            <input
                              type="radio"
                              name="shipping"
                              value={method.id}
                              checked={shippingMethod === method.id}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span className="font-bold">-${(getSubtotal() * discount / 100).toFixed(2)}</span>
                      </div>
                    )}

                    {/* Tax Estimate */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Estimate</span>
                      <span className="font-medium">${(getSubtotal() * 0.08).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">Total</div>
                        <div className="text-sm text-gray-500">Including ${(getSubtotal() * 0.08).toFixed(2)} in taxes</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">${getTotal().toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || getSelectedCount() === 0}
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isCheckingOut ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        Proceed to Checkout ({getSelectedCount()} items)
                      </>
                    )}
                  </button>

                  {/* Security Assurance */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield size={16} />
                    <span>Secure SSL Encryption</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <span className="text-xs text-gray-600">Free Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield size={16} className="text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-600">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Truck size={16} className="text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-600">Fast Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Package size={16} className="text-yellow-600" />
                      </div>
                      <span className="text-xs text-gray-600">Genuine Products</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Frequently bought together</h2>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
              View all
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Remove Item</h3>
                <p className="text-gray-600 text-sm">Are you sure you want to remove this item from your cart?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveItem(itemToDelete)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Remove Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;