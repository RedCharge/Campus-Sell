import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  ChevronLeft,
  Star,
  ShoppingCart,
  Heart,
  Filter,
  X,
  Grid,
  List,
  Zap,
  Package,
  Smartphone,
  Home as HomeIcon,
  Shirt,
  Watch,
  Headphones,
  Gift,
  Truck,
  ShieldCheck,
  RefreshCw,
  Check
} from 'lucide-react';

/* --- Mock Categories Data --- */
const CATEGORIES_DATA = [
  {
    id: 1,
    name: 'Electronics',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      { id: 101, name: 'Smartphones', count: 1250 },
      { id: 102, name: 'Laptops', count: 890 },
      { id: 103, name: 'Headphones', count: 670 },
      { id: 104, name: 'Smart Watches', count: 450 },
    ]
  },
  {
    id: 2,
    name: 'Fashion',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      { id: 201, name: "Men's Clothing", count: 2540 },
      { id: 202, name: "Women's Clothing", count: 3210 },
      { id: 203, name: 'Shoes', count: 1870 },
      { id: 204, name: 'Bags', count: 960 },
    ]
  },
  {
    id: 3,
    name: 'Home & Office',
    icon: HomeIcon,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      { id: 301, name: 'Furniture', count: 1120 },
      { id: 302, name: 'Kitchen Appliances', count: 890 },
      { id: 303, name: 'Home Decor', count: 670 },
      { id: 304, name: 'Lighting', count: 410 },
    ]
  },
  {
    id: 4,
    name: 'Audio',
    icon: Headphones,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      { id: 401, name: 'Headphones', count: 670 },
      { id: 402, name: 'Speakers', count: 450 },
      { id: 403, name: 'Earbuds', count: 890 },
      { id: 404, name: 'Sound Systems', count: 320 },
    ]
  },
  {
    id: 5,
    name: 'Accessories',
    icon: Watch,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      { id: 501, name: 'Watches', count: 720 },
      { id: 502, name: 'Sunglasses', count: 290 },
      { id: 503, name: 'Jewelry', count: 430 },
      { id: 504, name: 'Belts', count: 210 },
    ]
  },
  {
    id: 6,
    name: 'Gifts',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    subcategories: [
      { id: 601, name: 'Gift Cards', count: 450 },
      { id: 602, name: 'Premium Gifts', count: 320 },
      { id: 603, name: 'Seasonal', count: 890 },
      { id: 604, name: 'Personalized', count: 210 },
    ]
  }
];

/* --- Mock Products Data --- */
const CATEGORY_PRODUCTS = [
  {
    id: 1001,
    title: 'iPhone 14 Pro Max',
    price: 1099,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1eae1081?auto=format&fit=crop&w=500&q=80',
    discount: 15,
    category: 'Electronics',
    brand: 'Apple',
    stock: 45
  },
  {
    id: 1002,
    title: 'Samsung Galaxy S23 Ultra',
    price: 1199,
    originalPrice: 1399,
    rating: 4.7,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80',
    discount: 14,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 78
  },
  {
    id: 1003,
    title: 'Sony WH-1000XM5 Headphones',
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    discount: 12,
    category: 'Electronics',
    brand: 'Sony',
    stock: 120
  },
  {
    id: 1004,
    title: 'MacBook Air M2',
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 1560,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
    discount: 13,
    category: 'Electronics',
    brand: 'Apple',
    stock: 32
  }
];

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

const ProductCard = ({ product, className = '' }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    alert(`Added to cart: ${product.title}`);
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer ${className}`}
      onClick={handleViewDetails}
    >
      {product.discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{product.discount}%
        </span>
      )}
      
      <button 
        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100 duration-300 shadow-sm"
        onClick={(e) => {
          e.stopPropagation();
          alert(`Added to wishlist: ${product.title}`);
        }}
      >
        <Heart size={16} />
      </button>

      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-x-0 bottom-0 p-4">
          <button 
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors text-sm shadow-lg flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs font-medium text-gray-500">{product.brand}</span>
          {product.stock < 50 && (
            <span className="text-xs text-red-600 font-bold">Low Stock</span>
          )}
        </div>
        
        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-lg text-gray-900">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          
          <Rating rating={product.rating} count={product.reviews} />
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-green-600 flex items-center gap-1">
              <Truck size={10} />
              Free Delivery
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Package size={10} />
              {product.stock} left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ category, onSelect }) => {
  const Icon = category.icon;

  return (
    <button 
      onClick={() => onSelect(category)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden text-left"
    >
      <div className="relative h-32 overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-bold text-sm">{category.name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <Icon className="text-orange-600" size={20} />
          </div>
          <div className="text-xs text-gray-600">
            {category.subcategories?.length || 0} subcategories
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 group-hover:text-orange-600 transition-colors">
            Browse products
          </span>
          <ChevronRight size={14} className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </button>
  );
};

const SubcategoryCard = ({ subcategory }) => {
  return (
    <button className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 text-left w-full">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{subcategory.count.toString().charAt(0)}</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
            {subcategory.name}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">{subcategory.count} products</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );
};

const FilterModal = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  const priceRanges = [
    { id: 'under50', label: 'Under $50' },
    { id: '50-100', label: '$50 - $100' },
    { id: '100-200', label: '$100 - $200' },
    { id: '200-500', label: '$200 - $500' },
    { id: 'over500', label: 'Over $500' },
  ];

  const brands = ['Apple', 'Samsung', 'Sony', 'Nike'];

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-800 mb-4">Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <label key={range.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value={range.id}
                    checked={filters.priceRange === range.id}
                    onChange={() => onFilterChange('priceRange', range.id)}
                    className="peer hidden"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-orange-500 peer-checked:bg-orange-500">
                    <div className="w-2 h-2 rounded-full bg-white peer-checked:block hidden"></div>
                  </div>
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-800 mb-4">Brands</h4>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={(e) => {
                      const newBrands = e.target.checked
                        ? [...filters.brands, brand]
                        : filters.brands.filter(b => b !== brand);
                      onFilterChange('brands', newBrands);
                    }}
                    className="peer hidden"
                  />
                  <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center peer-checked:border-orange-500 peer-checked:bg-orange-500">
                    <Check size={12} className="text-white hidden peer-checked:block" />
                  </div>
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-white pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => {
                onFilterChange('reset', true);
              }}
            >
              <RefreshCw size={16} />
              Reset
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={onClose}
            >
              <Check size={16} />
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Main Component --- */
const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES_DATA[0]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState({
    priceRange: '',
    brands: [],
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        priceRange: '',
        brands: [],
        minRating: 0
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    Array.isArray(v) ? v.length > 0 : v && v !== 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-sm text-gray-600">
                Browse all {CATEGORIES_DATA.length} categories
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Categories Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Categories</h2>
            <div className="text-sm text-gray-600">
              {CATEGORIES_DATA.length} categories available
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES_DATA.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onSelect={handleCategorySelect}
              />
            ))}
          </div>
        </section>

        {/* Selected Category Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          {/* Category Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <selectedCategory.icon className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h2>
                  <p className="text-gray-600">
                    Explore {selectedCategory.subcategories?.length || 0} subcategories
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Zap size={16} />
                  Flash Deals
                </Button>
              </div>
            </div>
          </div>

          {/* Subcategories */}
          <div className="p-6">
            <h3 className="font-bold text-gray-800 mb-4">Subcategories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {selectedCategory.subcategories?.map(subcat => (
                <SubcategoryCard key={subcat.id} subcategory={subcat} />
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Products Header with Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Products</h3>
                <p className="text-sm text-gray-600">
                  {CATEGORY_PRODUCTS.length} products found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="hidden md:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>

                {/* Filter Button */}
                <Button
                  variant="secondary"
                  onClick={() => setShowFilters(true)}
                  className="relative"
                >
                  <Filter size={16} />
                  Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-6">
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {CATEGORY_PRODUCTS.map(product => (
                viewMode === 'grid' ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 hover:text-orange-600 transition-colors">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-gray-500">{product.brand}</span>
                          <Rating rating={product.rating} count={product.reviews} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className="font-bold text-lg text-gray-900">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice}</span>
                            )}
                          </div>
                          <Button variant="primary" size="sm">
                            <ShoppingCart size={16} />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Truck className="text-green-600" size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Free Shipping</h4>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <RefreshCw className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Easy Returns</h4>
              <p className="text-xs text-gray-500">30-day return policy</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ShieldCheck className="text-purple-600" size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-500">100% secure checkout</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Package className="text-orange-600" size={20} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800 text-sm">Genuine Products</h4>
              <p className="text-xs text-gray-500">Authentic brands</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default Categories;