import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../services/supabaseClient'; // Updated import path
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Zap, 
  Smartphone, 
  Shirt, 
  Home as HomeIcon, 
  Watch, 
  Headphones, 
  Gift,
  ArrowRight,
  Eye,
  TrendingUp,
  ShoppingCart,
  User,
  Grid,
  Package,
  X,
  Search,
  Filter,
  Clock,
  Flame,
  Award,
  Tag,
  Shield,
  Truck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

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

// Countdown Component
const Countdown = () => {
  const [time, setTime] = useState({ h: 2, m: 45, s: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 items-center">
      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">{String(time.h).padStart(2, '0')}</div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">{String(time.m).padStart(2, '0')}</div>
      <span className="text-red-600 font-bold">:</span>
      <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">{String(time.s).padStart(2, '0')}</div>
    </div>
  );
};

// ProductRow Component (for horizontal scrolling sections)
const ProductRow = ({ title, products, linkText = "See All", showReason = false, onViewDetails, onAddToCart, loading = false }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700">
            {linkText} <ChevronRight size={16} />
          </button>
          <div className="flex gap-1">
            <button 
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[180px] w-[180px] sm:min-w-[240px] sm:w-[240px] flex-shrink-0">
              <div className="h-[320px] bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {products.map(product => (
            <div key={product.id} className="min-w-[180px] w-[180px] sm:min-w-[240px] sm:w-[240px] flex-shrink-0">
              <ProductCard 
                product={product} 
                showReason={showReason}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* --- Expanded Categories (Jumia-like) --- */
const CATEGORIES = [
  { id: 1, name: 'Electronics', icon: Smartphone, image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80', count: '2.5k', slug: 'electronics' },
  { id: 2, name: 'Fashion', icon: Shirt, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80', count: '8.1k', slug: 'fashion' },
  { id: 3, name: 'Home & Office', icon: HomeIcon, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', count: '1.2k', slug: 'home-office' },
  { id: 4, name: 'Watches', icon: Watch, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80', count: '3.4k', slug: 'watches' },
  { id: 5, name: 'Audio', icon: Headphones, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80', count: '900+', slug: 'audio' },
  { id: 6, name: 'Gifts', icon: Gift, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', count: '500+', slug: 'gifts' },
  { id: 7, name: 'Groceries', icon: Package, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', count: '3.8k', slug: 'groceries' },
  { id: 8, name: 'Health & Beauty', icon: Heart, image: 'https://images.unsplash.com/photo-1522338242990-e8f5c5df5a5a?auto=format&fit=crop&w=600&q=80', count: '1.7k', slug: 'health-beauty' },
  { id: 9, name: 'Baby & Kids', icon: Gift, image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80', count: '1.3k', slug: 'baby-kids' },
  { id: 10, name: 'Sports & Fitness', icon: TrendingUp, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80', count: '800+', slug: 'sports-fitness' },
  { id: 11, name: 'Automotive', icon: Truck, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80', count: '450+', slug: 'automotive' },
  { id: 12, name: 'Phones & Tablets', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', count: '3.2k', slug: 'phones-tablets' },
];

// Mock data fallback in case Supabase is not configured
const MOCK_PRODUCTS = {
  flashDeals: [
    {
      id: 101,
      name: 'Sony WH-1000XM5 Wireless',
      price: 299,
      original_price: 399,
      rating: 4.9,
      review_count: 1240,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
      discount_percentage: 25,
      is_flash_deal: true
    },
    {
      id: 102,
      name: 'Nike Air Max 270',
      price: 120,
      original_price: 160,
      rating: 4.7,
      review_count: 850,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
      discount_percentage: 25,
      is_flash_deal: true
    },
    {
      id: 103,
      name: 'Apple Watch Series 8',
      price: 349,
      original_price: 429,
      rating: 4.8,
      review_count: 2100,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
      discount_percentage: 18,
      is_flash_deal: true
    },
    {
      id: 104,
      name: 'Fujifilm Instax Mini 11',
      price: 69,
      original_price: 89,
      rating: 4.6,
      review_count: 530,
      image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80',
      discount_percentage: 22,
      is_flash_deal: true
    }
  ],
  bestSellers: [
    {
      id: 301,
      name: 'Leather Crossbody Bag',
      price: 85,
      original_price: 120,
      rating: 4.6,
      review_count: 120,
      image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80',
      sales_count: 500
    },
    {
      id: 302,
      name: 'Minimalist Wrist Watch',
      price: 145,
      original_price: 199,
      rating: 4.8,
      review_count: 340,
      image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80',
      sales_count: 450
    }
  ],
  newArrivals: [
    {
      id: 201,
      name: 'Modern Leather Sofa',
      price: 899,
      original_price: 1200,
      rating: 4.5,
      review_count: 45,
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 202,
      name: 'MacBook Air M2',
      price: 1099,
      original_price: 1199,
      rating: 5.0,
      review_count: 320,
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80'
    }
  ],
  recommended: [
    {
      id: 401,
      name: 'Premium Wireless Headphones',
      price: 199,
      original_price: 299,
      rating: 4.8,
      review_count: 890,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
      reason: 'Based on your search: "wireless headphones"'
    },
    {
      id: 402,
      name: 'Gaming Laptop Pro',
      price: 1299,
      original_price: 1599,
      rating: 4.7,
      review_count: 450,
      image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80',
      reason: 'Based on your search: "gaming laptop"'
    }
  ],
  trending: [
    {
      id: 501,
      name: 'Foldable Drone Camera',
      price: 399,
      original_price: 549,
      rating: 4.6,
      review_count: 89,
      image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=500&q=80',
      views_count: 1200
    },
    {
      id: 502,
      name: 'Wireless Charging Pad',
      price: 29,
      original_price: 49,
      rating: 4.3,
      review_count: 120,
      image_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=500&q=80',
      views_count: 800
    }
  ]
};

/* --- Components --- */
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-200",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100",
    outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50",
    dark: "bg-gray-900 text-white hover:bg-gray-800"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Rating = ({ rating, count }) => (
  <div className="flex items-center gap-1 text-xs text-gray-500">
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          fill={i < Math.floor(rating) ? "currentColor" : "none"} 
          className={i < Math.floor(rating) ? "" : "text-gray-300"}
        />
      ))}
    </div>
    <span>({count})</span>
  </div>
);

// Enhanced ProductCard with Supabase integration
const ProductCard = ({ product, isFlash = false, className = '', showReason = false, onViewDetails, onAddToCart, showDiscountBadge = true }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    
    if (onAddToCart) {
      await onAddToCart(product);
    }
    
    setIsAddingToCart(false);
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (!supabase) {
        setIsWishlisted(!isWishlisted);
        return;
      }
      
      if (isWishlisted) {
        // Remove from wishlist
        await supabase
          .from('wishlists')
          .delete()
          .eq('product_id', product.id)
          .eq('user_id', supabase.auth.user()?.id);
      } else {
        // Add to wishlist
        await supabase
          .from('wishlists')
          .insert({
            product_id: product.id,
            user_id: supabase.auth.user()?.id,
            created_at: new Date().toISOString()
          });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Wishlist error:', error);
      setIsWishlisted(!isWishlisted); // Fallback to local state
    }
  };

  const discount = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : product.discount_percentage || 0;

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer ${className}`}
      onClick={handleViewDetails}
    >
      {showDiscountBadge && discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </span>
      )}
      
      {product.badge && (
        <span className={`absolute top-3 right-3 ${product.badge === 'Trending' ? 'bg-purple-600' : product.badge === 'Limited Deal' ? 'bg-green-600' : 'bg-blue-600'} text-white text-[10px] font-bold px-2 py-1 rounded-full z-10`}>
          {product.badge}
        </span>
      )}
      
      <button 
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-sm"
        onClick={toggleWishlist}
      >
        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image_url || product.image} 
          alt={product.title || product.name} 
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=500&q=80';
          }}
        />
        
        {product.fast_delivery && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Truck size={8} /> Fast
          </span>
        )}
        
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <RefreshCw size={16} className="animate-spin text-orange-600" />
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {product.title || product.name}
        </h3>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-lg text-gray-900">${product.price || product.original_price}</span>
            {product.original_price && product.price < product.original_price && (
              <span className="text-xs text-gray-400 line-through">${product.original_price}</span>
            )}
          </div>
          
          <Rating rating={product.rating || 4.0} count={product.review_count || 0} />
          
          {showReason && product.reason && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Eye size={12} />
              {product.reason}
            </p>
          )}
          
          {product.stock_quantity !== undefined && (
            <div className="mt-2 text-xs flex items-center gap-1">
              {product.stock_quantity > 0 ? (
                <span className="text-green-600">✓ In Stock ({product.stock_quantity})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Search Component
const SearchBar = ({ onSearch, placeholder = "Search for products, brands and categories..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (searchQuery) => {
    try {
      if (!supabase) {
        // Use mock suggestions if Supabase is not available
        const mockSuggestions = [
          { id: 1, name: 'Wireless Headphones', category: 'Electronics', brand: 'Sony' },
          { id: 2, name: 'Smart Watch', category: 'Wearables', brand: 'Apple' },
          { id: 3, name: 'Running Shoes', category: 'Sports', brand: 'Nike' },
        ].filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(mockSuggestions);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, brand')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`)
        .limit(5);

      if (!error && data) {
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    if (onSearch) {
      onSearch(suggestion.name);
    }
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-4 py-1.5 rounded-full hover:bg-orange-700 transition-colors text-sm font-medium"
        >
          Search
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
              Suggestions
            </div>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <Search size={14} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-800">{suggestion.name}</div>
                  <div className="text-xs text-gray-500">{suggestion.brand} • {suggestion.category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// CategoryShowcase Component
const CategoryShowcase = ({ onCategoryClick }) => {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
        <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          View All <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <button 
            key={cat.id} 
            className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-lg transition-all duration-300 text-left"
            onClick={() => onCategoryClick && onCategoryClick(cat)}
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-0.5">{cat.name}</h3>
                <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{cat.count} Products</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

// RecommendedForYou Component
const RecommendedForYou = ({ onViewDetails, onAddToCart, products, loading }) => {
  return (
    <section className="bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="text-orange-600" size={24} />
            Recommended For You
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Personalized picks based on your shopping behavior
          </p>
        </div>
      </div>

      <ProductRow 
        title="Personalized Picks"
        products={products}
        linkText="See More Recommendations"
        showReason={true}
        onViewDetails={onViewDetails}
        onAddToCart={onAddToCart}
        loading={loading}
      />
    </section>
  );
};

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ cartCount, active = 'home' }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, action: () => navigate('/') },
    { id: 'categories', label: 'Categories', icon: Grid, action: () => navigate('/categories') },
    { 
      id: 'cart', 
      label: 'Cart', 
      icon: ShoppingCart, 
      action: () => navigate('/cart'),
      badge: cartCount > 0 ? cartCount : null
    },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, action: () => console.log('Navigate to Wishlist') },
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
                ? 'text-orange-600 scale-105' 
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
              <div className="absolute top-0 w-12 h-1 bg-orange-600 rounded-full -translate-y-1"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/* --- Main Home Component --- */
const Home = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const [activeTab, setActiveTab] = useState('home');
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  
  // State for products
  const [products, setProducts] = useState({
    flashDeals: [],
    bestSellers: [],
    newArrivals: [],
    recommended: [],
    trending: []
  });
  
  const [loading, setLoading] = useState({
    flashDeals: false,
    bestSellers: false,
    newArrivals: false,
    recommended: false,
    trending: false
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Check if Supabase is available
  useEffect(() => {
    if (!supabase) {
      console.warn('Supabase client not found, using mock data');
      setUseMockData(true);
      loadMockData();
    } else {
      fetchAllProducts();
    }
  }, []);

  const loadMockData = () => {
    setProducts(MOCK_PRODUCTS);
    setLoading({
      flashDeals: false,
      bestSellers: false,
      newArrivals: false,
      recommended: false,
      trending: false
    });
  };

  const fetchAllProducts = async () => {
    setLoading({
      flashDeals: true,
      bestSellers: true,
      newArrivals: true,
      recommended: true,
      trending: true
    });

    try {
      await Promise.all([
        fetchFlashDeals(),
        fetchBestSellers(),
        fetchNewArrivals(),
        fetchRecommendedProducts(),
        fetchTrendingProducts()
      ]);
    } catch (error) {
      console.error('Error fetching products, falling back to mock data:', error);
      setUseMockData(true);
      loadMockData();
    }
  };

  const fetchFlashDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_flash_deal', true)
        .gt('discount_percentage', 20)
        .order('discount_percentage', { ascending: false })
        .limit(4);

      if (!error) {
        setProducts(prev => ({ ...prev, flashDeals: data || [] }));
      }
    } catch (error) {
      console.error('Error fetching flash deals:', error);
    } finally {
      setLoading(prev => ({ ...prev, flashDeals: false }));
    }
  };

  const fetchBestSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('sales_count', 100)
        .order('sales_count', { ascending: false })
        .limit(6);

      if (!error) {
        setProducts(prev => ({ ...prev, bestSellers: data || [] }));
      }
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    } finally {
      setLoading(prev => ({ ...prev, bestSellers: false }));
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error) {
        setProducts(prev => ({ ...prev, newArrivals: data || [] }));
      }
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(prev => ({ ...prev, newArrivals: false }));
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);

      if (!error) {
        setProducts(prev => ({ ...prev, recommended: data || [] }));
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoading(prev => ({ ...prev, recommended: false }));
    }
  };

  const fetchTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('views_count', { ascending: false })
        .limit(4);

      if (!error) {
        setProducts(prev => ({ ...prev, trending: data || [] }));
      }
    } catch (error) {
      console.error('Error fetching trending products:', error);
    } finally {
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      if (!supabase || useMockData) {
        // Use mock search results
        const mockResults = Object.values(MOCK_PRODUCTS)
          .flat()
          .filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            (product.category && product.category.toLowerCase().includes(query.toLowerCase())) ||
            (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
          );
        setSearchResults(mockResults.slice(0, 20));
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%`)
          .limit(20);

        if (!error) {
          setSearchResults(data || []);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewDetails = (product) => {
    if (supabase && !useMockData) {
      // Track product view
      supabase
        .from('products')
        .update({ views_count: (product.views_count || 0) + 1 })
        .eq('id', product.id);
    }
    
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (product) => {
    try {
      addToCart({
        id: product.id,
        title: product.name || product.title,
        price: product.price,
        originalPrice: product.original_price || product.originalPrice,
        image: product.image_url || product.image,
        brand: product.brand || 'Generic',
        stock: product.stock_quantity || 10,
        rating: product.rating || 4.0,
        reviews: product.review_count || 0
      });

      if (supabase && !useMockData) {
        // Update sales count in Supabase
        await supabase
          .from('products')
          .update({ 
            sales_count: (product.sales_count || 0) + 1 
          })
          .eq('id', product.id);
      }

      setAddedProduct({
        ...product,
        newQuantity: 1
      });
      setShowCartNotification(true);

      setTimeout(() => {
        setShowCartNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  const handleCloseNotification = () => {
    setShowCartNotification(false);
  };

  const handleViewCart = () => {
    navigate('/cart');
    setShowCartNotification(false);
  };

  return (
    <div className="pb-20 md:pb-6">
      {/* Cart Notification */}
      {showCartNotification && addedProduct && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={addedProduct.image_url || addedProduct.image} 
                  alt={addedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">Added to cart!</h4>
                  <button 
                    onClick={handleCloseNotification}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{addedProduct.name || addedProduct.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="font-bold text-orange-600">${addedProduct.price}</div>
                  <div className="text-xs text-gray-500">Qty: {addedProduct.newQuantity}</div>
                </div>
                <button 
                  onClick={handleViewCart}
                  className="w-full mt-3 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* Search Bar */}
        <div className="sticky top-0 z-40 bg-white py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for electronics, fashion, groceries, and more..."
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              <span className="text-sm text-gray-500">
                {searchResults.length} products found
              </span>
            </div>
            
            {isSearching ? (
              <div className="flex justify-center py-8">
                <RefreshCw size={24} className="animate-spin text-orange-600" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map(product => (
                  <div key={product.id} className="h-full">
                    <ProductCard 
                      product={product}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600">No products found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-1">Try different keywords or browse categories</p>
              </div>
            )}
          </div>
        )}

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[480px]">
          {/* Categories Sidebar */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-full overflow-y-auto">
            <h2 className="font-bold text-gray-800 px-4 py-4 text-sm uppercase tracking-wide border-b border-gray-50 mb-2">All Categories</h2>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors group w-full text-left"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <cat.icon size={18} className="text-gray-400 group-hover:text-orange-500" />
                    {cat.name}
                    <span className="ml-auto text-xs text-gray-400">{cat.count}</span>
                    <ChevronRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Hero Banner */}
          <div className="lg:col-span-9 h-[300px] lg:h-full relative rounded-xl overflow-hidden shadow-lg group">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=80" 
              alt="Hero Banner" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent flex flex-col justify-center px-8 md:px-16">
              <span className="text-orange-400 font-bold tracking-wider mb-2 text-sm uppercase">Super Deals 2024</span>
              <h1 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-lg">
                Shop Everything <br/> Like Jumia
              </h1>
              <div className="flex gap-4">
                <Button 
                  variant="primary" 
                  className="py-3 px-6 text-base"
                  onClick={() => navigate('/products')}
                >
                  Shop All Products
                </Button>
                <Button 
                  variant="outline" 
                  className="py-3 px-6 text-base text-white border-white hover:bg-white/10"
                  onClick={() => navigate('/flash-deals')}
                >
                  Flash Deals
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Category Scroll */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button 
                key={cat.id} 
                className="flex flex-col items-center gap-2 min-w-[80px]"
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 text-gray-600">
                  <cat.icon size={24} />
                </div>
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended For You Section */}
        <RecommendedForYou 
          onViewDetails={handleViewDetails}
          onAddToCart={handleAddToCart}
          products={products.recommended}
          loading={loading.recommended}
        />

        {/* Visual Category Showcase Grid */}
        <CategoryShowcase onCategoryClick={handleCategoryClick} />

        {/* Flash Sales Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-orange-500 fill-orange-500" />
                Flash Sales
              </h2>
              <div className="flex items-center gap-2">
                <Clock className="text-red-500" size={16} />
                <span className="text-sm font-medium text-red-600">Ends in:</span>
                <Countdown />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-orange-600 hover:text-orange-700"
              onClick={() => navigate('/flash-deals')}
            >
              View All <ChevronRight size={16} />
            </Button>
          </div>
          
          {loading.flashDeals ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[300px] bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.flashDeals.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={product} 
                    isFlash={true}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Best Sellers Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="text-yellow-500 fill-yellow-500" />
              Best Sellers
            </h2>
            <Button 
              variant="ghost" 
              className="text-orange-600 hover:text-orange-700"
              onClick={() => navigate('/best-sellers')}
            >
              View All <ChevronRight size={16} />
            </Button>
          </div>
          
          {loading.bestSellers ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[250px] bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.bestSellers.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Trending Products */}
        <section className="bg-gradient-to-r from-orange-50 to-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Flame className="text-orange-600 fill-orange-600" />
                Trending Now
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Most viewed products this week
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
              onClick={() => navigate('/trending')}
            >
              See More
            </Button>
          </div>

          {loading.trending ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[300px] bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.trending.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* New Arrivals */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="text-green-600" />
              New Arrivals
            </h2>
            <Button 
              variant="ghost" 
              className="text-orange-600 hover:text-orange-700"
              onClick={() => navigate('/new-arrivals')}
            >
              View All <ChevronRight size={16} />
            </Button>
          </div>
          
          {loading.newArrivals ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[250px] bg-gray-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.newArrivals.map(product => (
                <div key={product.id} className="h-full">
                  <ProductCard 
                    product={product}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Promotional Banners */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="relative rounded-xl overflow-hidden h-64 group cursor-pointer"
            onClick={() => navigate('/category/electronics')}
          >
            <img 
              src="https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80" 
              alt="Tech Deals" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
              <span className="text-xs font-bold text-orange-400 bg-white/10 backdrop-blur-sm self-start px-3 py-1 rounded mb-3">TECH DEALS</span>
              <h3 className="text-3xl font-bold text-white mb-2">Electronics <br/> Up to 60% Off</h3>
              <Button variant="primary" className="self-start mt-4">
                Shop Now
              </Button>
            </div>
          </div>
          <div 
            className="relative rounded-xl overflow-hidden h-64 group cursor-pointer"
            onClick={() => navigate('/category/fashion')}
          >
            <img 
              src="https://images.unsplash.com/photo-1485230946329-8bba15383712?auto=format&fit=crop&w=800&q=80" 
              alt="Fashion Sale" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8">
              <span className="text-xs font-bold text-orange-400 bg-white/10 backdrop-blur-sm self-start px-3 py-1 rounded mb-3">FASHION SALE</span>
              <h3 className="text-3xl font-bold text-white mb-2">Summer <br/> Collection 2024</h3>
              <Button variant="primary" className="self-start mt-4">
                Shop Now
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Truck className="mx-auto text-green-600 mb-2" size={24} />
            <p className="font-medium text-gray-900 text-sm">Free Delivery</p>
            <p className="text-xs text-gray-500">On orders over $50</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Shield className="mx-auto text-blue-600 mb-2" size={24} />
            <p className="font-medium text-gray-900 text-sm">Secure Payment</p>
            <p className="text-xs text-gray-500">100% secure</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <RefreshCw className="mx-auto text-orange-600 mb-2" size={24} />
            <p className="font-medium text-gray-900 text-sm">Easy Returns</p>
            <p className="text-xs text-gray-500">30-day returns</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
            <Award className="mx-auto text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-900 text-sm">Best Price</p>
            <p className="text-xs text-gray-500">Guaranteed</p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cartCount} active={activeTab} />
    </div>
  );
};

export default Home;