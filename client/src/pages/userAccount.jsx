import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  MapPin, 
  CreditCard, 
  LogOut, 
  Package, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  Wallet,
  Gift,
  Edit2,
  Home,
  Grid,
  ShoppingCart,
  Bell,
  Menu,
  ArrowLeft,
  ShoppingBag,
  Calendar,
  BookOpen,
  GraduationCap,
  Phone,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ cartCount, active = 'account' }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => navigate('/') },
    { id: 'categories', label: 'Categories', icon: Grid, action: () => navigate('/categories') },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: ShoppingCart, 
      action: () => navigate('/cart'),
      badge: cartCount > 0 ? cartCount : null
    },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, action: () => navigate('/wishlist') },
    { id: 'account', label: 'Account', icon: User, action: () => navigate('/useraccount') },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50">
      <div className="flex justify-around items-center py-3 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center relative min-w-[60px] p-1 transition-all duration-200 ${
              active === item.id 
                ? 'text-[#f68b1e] scale-105' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="relative">
              <item.icon size={22} />
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
            {active === item.id && (
              <div className="absolute top-0 w-12 h-1 bg-[#f68b1e] rounded-full -translate-y-1"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Header with Navigation (for mobile)
const MobileHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 md:hidden">
      <button 
        onClick={() => navigate(-1)}
        className="p-2 -ml-2"
      >
        <ArrowLeft size={20} className="text-gray-700" />
      </button>
      <h1 className="text-lg font-bold text-gray-800">My Account</h1>
      <button className="p-2 -mr-2">
        <Settings size={20} className="text-gray-600" />
      </button>
    </div>
  );
};

// Reusable Components
const MobileProfileHeader = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return 'CS';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-gradient-to-r from-[#f68b1e] to-[#ff9f43] text-white p-4 pt-16 pb-8 md:pt-4 md:rounded-t-lg">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white text-[#f68b1e] flex items-center justify-center text-xl font-bold border-2 border-white shadow-md">
          {getInitials(user?.name)}
        </div>
        <div>
          <h2 className="text-lg font-bold">{user?.name || 'Campus User'}</h2>
          <p className="text-sm text-white/90">{user?.email || 'user@campus.edu.ng'}</p>
          <p className="text-xs text-white/70 mt-1">Member since 2024</p>
        </div>
      </div>
    </div>
  );
};

const WalletCard = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-2 md:mb-0">
    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
      <h3 className="text-sm font-bold text-gray-700 uppercase">Campus Sell Credits</h3>
      <Wallet className="text-[#f68b1e]" size={20} />
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[#f68b1e] font-bold text-lg">₦</span>
      <span className="text-2xl font-bold text-gray-800">12,450.00</span>
    </div>
    <p className="text-xs text-gray-500 mt-1">Available Balance</p>
    <button className="w-full mt-4 bg-[#f68b1e] hover:bg-[#e07e1b] text-white py-2 rounded-md text-sm font-medium transition-colors">
      Add Credits
    </button>
  </div>
);

const MenuItem = ({ icon: Icon, label, subLabel, onClick, active, isDestructive, badge, disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${active ? 'bg-orange-50' : ''} ${isDestructive ? 'hover:bg-red-50' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className="relative">
        <Icon size={22} className={isDestructive ? 'text-red-500' : 'text-gray-600'} />
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px]">
            {badge}
          </span>
        )}
      </div>
      <div className="text-left">
        <p className={`text-sm font-medium ${isDestructive ? 'text-red-600' : 'text-gray-800'}`}>{label}</p>
        {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-300" />
  </button>
);

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, isLoggingOut }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 border-b border-gray-100 bg-gray-50 hidden md:block">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#f68b1e] text-white flex items-center justify-center font-bold">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CS'}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">{user?.name || 'User'}</h3>
          <p className="text-xs text-gray-500">{user?.email || 'user@campus.edu.ng'}</p>
        </div>
      </div>
    </div>
    <div className="flex flex-col">
      <button 
        onClick={() => setActiveTab('overview')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <User size={18} /> Account Overview
      </button>
      <button 
        onClick={() => setActiveTab('orders')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <Package size={18} /> My Orders
      </button>
      <button 
        onClick={() => setActiveTab('wishlist')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'wishlist' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <Heart size={18} /> Wishlist
      </button>
      <button 
        onClick={() => setActiveTab('messages')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'messages' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <MessageSquare size={18} /> Messages
        <span className="ml-auto bg-[#f68b1e] text-white text-xs px-2 py-0.5 rounded-full">3</span>
      </button>
    </div>
    
    <div className="p-4 border-b border-gray-100 bg-gray-50 hidden md:block mt-2">
      <h3 className="font-bold text-gray-800">Settings</h3>
    </div>
    <div className="flex flex-col">
      <button 
        onClick={() => setActiveTab('profile')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <Settings size={18} /> Profile Settings
      </button>
      <button 
        onClick={() => setActiveTab('address')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'address' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <MapPin size={18} /> Address Book
      </button>
      <button 
        onClick={() => setActiveTab('security')}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'security' ? 'text-[#f68b1e] bg-orange-50 border-l-4 border-[#f68b1e]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
      >
        <Shield size={18} /> Security
      </button>
      
      {/* FIXED LOGOUT BUTTON WITH onClick HANDLER */}
      <button 
        onClick={onLogout}
        disabled={isLoggingOut}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 border-l-4 border-transparent transition-colors mt-4 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <LogOut size={18} /> 
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  </div>
);

// Tab Content Components
const Overview = ({ user }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 hidden md:block border-b border-gray-200 pb-4">Account Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Account Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-0 overflow-hidden h-full">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-700 uppercase">Account Details</h3>
          <button className="text-[#f68b1e] hover:text-[#e07e1b]">
            <Edit2 size={16}/>
          </button>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#f68b1e]/10 text-[#f68b1e] flex items-center justify-center text-lg font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CS'}
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">{user?.name || 'Campus User'}</h4>
              <p className="text-gray-500 text-sm">{user?.email || 'user@campus.edu.ng'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap size={14} className="text-gray-400" />
              <span className="text-gray-600">University of Lagos</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen size={14} className="text-gray-400" />
              <span className="text-gray-600">Computer Science, 300 Level</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-gray-400" />
              <span className="text-gray-600">{user?.phone || '+234 812 345 6789'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-gray-600">Joined March 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Address Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-0 overflow-hidden h-full">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-700 uppercase">Campus Address</h3>
          <button className="text-[#f68b1e] hover:text-[#e07e1b]">
            <Edit2 size={16}/>
          </button>
        </div>
        <div className="p-4 space-y-1">
          <h4 className="font-bold text-gray-800 text-sm">Hall of Residence:</h4>
          <p className="text-gray-600 text-sm">Moremi Hall, Room 215</p>
          <p className="text-gray-600 text-sm">University of Lagos</p>
          <p className="text-gray-600 text-sm">Akoka, Yaba, Lagos</p>
          <div className="mt-3">
            <span className="inline-block px-2 py-1 bg-[#f68b1e] text-white text-xs rounded">Primary</span>
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded ml-2">On-Campus</span>
          </div>
        </div>
      </div>
      
      {/* Campus Sell Credits */}
      <div className="bg-white rounded-lg border border-gray-200 p-0 overflow-hidden h-full">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-700 uppercase">Campus Sell Credits</h3>
          <Wallet className="text-[#f68b1e]" size={20}/>
        </div>
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f68b1e]/10 flex items-center justify-center">
            <Wallet className="text-[#f68b1e]" size={20}/>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Available Balance</p>
            <div className="flex items-baseline gap-1">
              <span className="text-gray-500 text-sm">₦</span>
              <span className="text-2xl font-bold text-gray-800">12,450.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-0 overflow-hidden h-full">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-700 uppercase">Campus Preferences</h3>
          <button className="text-[#f68b1e] hover:text-[#e07e1b]">
            <Edit2 size={16}/>
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-3">You are subscribed to:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-[#f68b1e]/10 text-[#f68b1e] text-xs rounded">Textbook Alerts</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Campus Events</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Study Materials</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Roommate Finder</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrdersView = () => {
  const orders = [
    { 
      id: 'CS39482155', 
      date: '28-03-2024', 
      status: 'Delivered', 
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80', 
      name: 'Introduction to Algorithms Textbook',
      price: '₦ 8,500',
      items: 1,
      tracking: 'TRK-UNILAG-789'
    },
    { 
      id: 'CS39400211', 
      date: '15-03-2024', 
      status: 'In Transit', 
      img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=200&q=80', 
      name: 'Graphing Calculator',
      price: '₦ 15,000',
      items: 1,
      tracking: 'TRK-UNILAG-456'
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 min-h-[500px]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        <div className="flex gap-2">
          <button className="text-sm text-[#f68b1e] font-medium">All Orders (4)</button>
          <span className="text-gray-300">|</span>
          <button className="text-sm text-gray-500 hover:text-[#f68b1e]">Order History</button>
        </div>
      </div>
      <div>
        {orders.map((order, i) => (
          <div key={i} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              <img src={order.img} alt={order.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">{order.name}</h3>
                  <p className="text-xs text-gray-500">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">Placed on {order.date} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                  <p className="text-xs text-gray-500">Total: {order.price}</p>
                </div>
                <button className="text-[#f68b1e] text-sm font-medium hover:underline whitespace-nowrap">View Details</button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-xs text-gray-500">Tracking: {order.tracking}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center">
        <button className="text-[#f68b1e] font-medium hover:underline">
          View All Orders →
        </button>
      </div>
    </div>
  );
};

const WishlistView = () => (
  <div className="bg-white rounded-lg border border-gray-200 min-h-[500px] p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">My Wishlist</h2>
    <div className="text-center py-12">
      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">Your wishlist is empty</h3>
      <p className="text-gray-500 mb-6">Items you save for later will appear here</p>
      <button className="bg-[#f68b1e] hover:bg-[#e07e1b] text-white px-6 py-3 rounded-md font-medium">
        Browse Campus Store
      </button>
    </div>
  </div>
);

const MessagesView = () => (
  <div className="bg-white rounded-lg border border-gray-200 min-h-[500px]">
    <div className="p-4 border-b border-gray-100">
      <h2 className="text-lg font-bold text-gray-800">Messages</h2>
      <p className="text-sm text-gray-500 mt-1">Campus notifications and seller messages</p>
    </div>
    <div className="p-6 text-center">
      <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">No new messages</h3>
      <p className="text-gray-500">You're all caught up with campus updates!</p>
    </div>
  </div>
);

// Main UserAccount Component
export default function UserAccount() {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle logout function
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(); // This should be provided by your AuthContext
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
      setIsLoggingOut(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f68b1e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user (this will happen automatically after logout)
  if (!user) {
    navigate('/login');
    return null;
  }

  // Determine what to render on the right side
  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Overview user={user} />;
      case 'orders': return <OrdersView />;
      case 'wishlist': return <WishlistView />;
      case 'messages': return <MessagesView />;
      default: return <Overview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20 md:pb-12">
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Mobile-Only Profile Header */}
      <MobileProfileHeader user={user} />

      <div className="container mx-auto px-0 md:px-4 py-0 md:py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              user={user} 
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </aside>

          {/* Mobile Navigation List */}
          <div className="md:hidden">
            <div className="px-4 -mt-4 mb-4 relative z-10">
              <WalletCard />
            </div>

            <div className="bg-white border-t border-b border-gray-200 mb-2">
              <MenuItem 
                icon={Package} 
                label="My Orders" 
                subLabel="2 recent orders" 
                onClick={() => setActiveTab('orders')} 
              />
              <MenuItem 
                icon={Heart} 
                label="Wishlist" 
                subLabel="0 items saved" 
                onClick={() => setActiveTab('wishlist')} 
              />
              <MenuItem 
                icon={MessageSquare} 
                label="Messages" 
                subLabel="3 unread messages" 
                badge="3"
                onClick={() => setActiveTab('messages')} 
              />
              <MenuItem 
                icon={Gift} 
                label="Campus Vouchers" 
                subLabel="1 available voucher" 
                onClick={() => {}} 
              />
            </div>

            <div className="bg-white border-t border-b border-gray-200 mb-2">
              <h3 className="px-4 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase">My Settings</h3>
              <MenuItem 
                icon={Settings} 
                label="Profile Settings" 
                onClick={() => {}} 
              />
              <MenuItem 
                icon={MapPin} 
                label="Address Book" 
                subLabel="2 addresses" 
                onClick={() => {}} 
              />
              <MenuItem 
                icon={Shield} 
                label="Security" 
                onClick={() => {}} 
              />
              <MenuItem 
                icon={CreditCard} 
                label="CampusPay" 
                subLabel="₦ 12,450.00 balance" 
                onClick={() => {}} 
              />
            </div>
            
            <div className="bg-white border-t border-b border-gray-200 mb-8">
              {/* Mobile Logout Button - Fixed */}
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full flex items-center justify-between p-4 bg-white hover:bg-red-50 transition-colors border-b border-gray-100 ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <LogOut size={22} className="text-red-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-600">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <main className={`flex-1 min-w-0 ${activeTab === 'overview' ? 'hidden md:block' : 'block p-4 md:p-0'}`}>
            {/* Back button for mobile sub-pages */}
            <div className="md:hidden mb-4">
              {activeTab !== 'overview' && (
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className="flex items-center text-gray-800 font-bold gap-2"
                >
                  <ArrowLeft size={20}/> Back to Account
                </button>
              )}
            </div>
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cartCount} active="account" />
    </div>
  );
}