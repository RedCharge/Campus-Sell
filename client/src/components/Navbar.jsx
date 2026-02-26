import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart,
  User,
  X,
  LogOut,
  Settings,
  Package,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Debounce utility for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// User Dropdown Component
const UserDropdown = ({ userEmail = "user@example.com", onLogout, onClose }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const userInitials = userEmail
    .split('@')[0]
    .substring(0, 2)
    .toUpperCase();

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slide-down"
    >
      {/* User Info Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Welcome!</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => handleNavigation('/account')}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
        >
          <User size={18} className="text-gray-400 group-hover:text-orange-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">My Account</span>
        </button>

        <button
          onClick={() => handleNavigation('/orders')}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
        >
          <Package size={18} className="text-gray-400 group-hover:text-orange-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">My Orders</span>
        </button>

        <button
          onClick={() => handleNavigation('/wishlist')}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
        >
          <Heart size={18} className="text-gray-400 group-hover:text-orange-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Wishlist</span>
        </button>

        <button
          onClick={() => handleNavigation('/settings')}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
        >
          <Settings size={18} className="text-gray-400 group-hover:text-orange-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Settings</span>
        </button>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 p-2">
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition-colors group rounded-lg"
        >
          <LogOut size={18} className="text-gray-400 group-hover:text-red-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Logout</span>
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ onSearch, searchQuery = '', searchResults = [], isSearching = false, userEmail = "user@example.com" }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef(null);
  const userButtonRef = useRef(null);
  
  const debouncedQuery = useDebounce(localQuery, 300);
  
  // Get user initials from email
  const userInitials = userEmail
    .split('@')[0]
    .substring(0, 2)
    .toUpperCase();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search suggestions
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      
      // Close user dropdown
      if (userButtonRef.current && !userButtonRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() && onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && localQuery.trim()) {
      onSearch(localQuery);
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    setShowSuggestions(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSuggestionClick = (product) => {
    setLocalQuery(product.name);
    if (onSearch) {
      onSearch(product.name);
    }
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const handleLogoClick = () => {
    setLocalQuery('');
    if (onSearch) {
      onSearch('');
    }
    navigate('/');
  };

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowSuggestions(false); // Close search if open
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    setShowUserDropdown(false);
    // Example: localStorage.removeItem('authToken');
    // Example: navigate('/login');
  };

  // Mock suggestions (replace with actual API)
  const getSuggestions = () => {
    if (!localQuery.trim() || searchResults.length === 0) return [];
    
    return searchResults.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      category: product.category || 'Product'
    }));
  };

  const suggestions = getSuggestions();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        {/* Top Bar */}
        <div className="bg-orange-600 text-white text-xs py-1.5 text-center hidden sm:block">
          Free Shipping on Orders Over $50 | Use Code: <strong>NEWUSER</strong>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            
            {/* Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 hidden sm:block">
                LuxeMarket
              </span>
            </button>

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
              <form onSubmit={handleSubmit} className="relative group">
                <input 
                  type="text" 
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search products, brands and categories..." 
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all group-hover:bg-white group-hover:shadow-md"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" size={18} />
                
                {localQuery && (
                  <button 
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
                
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-orange-700 transition-colors"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                        Suggestions
                      </div>
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Search size={14} className="text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-800">{suggestion.name}</div>
                              <div className="text-xs text-gray-500">{suggestion.category}</div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-900">${suggestion.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* User Profile Dropdown */}
              <div className="relative" ref={userButtonRef}>
                <button
                  onClick={handleUserClick}
                  className="hidden md:flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors group relative"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userInitials}
                  </div>
                  <div className="flex flex-col text-xs text-left">
                    <span className="text-gray-500">Hello</span>
                    <span className="font-semibold text-gray-800">Account</span>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <UserDropdown
                    userEmail={userEmail}
                    onLogout={handleLogout}
                    onClose={() => setShowUserDropdown(false)}
                  />
                )}
              </div>
              
              {/* Cart Icon */}
              <button 
                onClick={() => navigate('/cart')}
                className="hidden md:block relative p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
              >
                <ShoppingCart size={24} className="text-gray-600 group-hover:text-orange-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search (Visible only on small screens) */}
        <div className="md:hidden px-4 pb-3" ref={searchRef}>
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search..." 
              className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            
            {localQuery && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}

            {/* Mobile Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="py-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Search size={14} className="text-gray-400" />
                        <div className="text-sm font-medium text-gray-800">{suggestion.name}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">${suggestion.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[73px] md:h-[65px]"></div>
    </>
  );
};

export default Navbar;