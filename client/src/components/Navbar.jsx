import React from 'react';
import { 
  Search, 
  ShoppingCart,
  User
} from 'lucide-react';
import { useCart } from '../context/CartContext'; // Keep this import

const Navbar = () => {
  const { cartCount } = useCart(); // Keep cart count

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
       {/* Top Bar */}
      <div className="bg-orange-600 text-white text-xs py-1.5 text-center hidden sm:block">
        Free Shipping on Orders Over $50 | Use Code: <strong>NEWUSER</strong>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Logo - Mobile hamburger removed */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 hidden sm:block">
              LuxeMarket
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search products, brands and categories..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all group-hover:bg-white group-hover:shadow-md"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" size={18} />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-medium hover:bg-orange-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* User Actions - Cart hidden only on mobile */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
              <User size={20} className="text-gray-600 group-hover:text-orange-600" />
              <div className="flex flex-col text-xs">
                <span className="text-gray-500">Hello, Sign In</span>
                <span className="font-semibold text-gray-800">Account</span>
              </div>
            </div>
            
            {/* Cart Icon - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block relative p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
              <ShoppingCart size={24} className="text-gray-600 group-hover:text-orange-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search (Visible only on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;