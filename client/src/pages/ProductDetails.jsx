// client/src/pages/ProductDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  ChevronRight,
  Check,
  Package,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Minus,
  Plus,
  X,
  User,
  Send,
  Edit2,
  Trash2
} from 'lucide-react';

// Mock product data - in real app, you'd fetch this from an API
const PRODUCTS_DATA = [
  {
    id: 101,
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviews: 1240,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
    ],
    discount: 25,
    description: 'Industry-leading noise cancellation with Dual Noise Sensor technology. Premium sound with Integrated Processor V1. Multipoint connection lets you connect to two devices simultaneously.',
    features: [
      'Industry-leading noise cancellation',
      '30-hour battery life with quick charging',
      'Multi-point connection',
      'Speak-to-chat technology',
      'Precise voice pickup',
      'Wearing detection'
    ],
    specifications: {
      'Color': 'Black',
      'Connectivity': 'Bluetooth 5.2',
      'Battery Life': '30 hours',
      'Charging Time': '3 hours',
      'Weight': '250g',
      'Warranty': '1 year'
    },
    stock: 45,
    category: 'Electronics',
    brand: 'Sony',
    tags: ['Audio', 'Wireless', 'Noise Cancelling', 'Premium']
  },
  {
    id: 102,
    title: 'Nike Air Max 270 React',
    price: 120,
    originalPrice: 160,
    rating: 4.7,
    reviews: 850,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80',
    ],
    discount: 25,
    description: 'The Nike Air Max 270 React combines a full-length React foam midsole with a 270 Max Air unit for unrivaled comfort and a striking visual experience.',
    features: [
      'React foam cushioning',
      '270-degree Max Air unit',
      'Breathable mesh upper',
      'Rubber outsole for traction',
      'Lightweight design'
    ],
    specifications: {
      'Color': 'Black/White',
      'Size': 'US 7-13',
      'Material': 'Mesh/Synthetic',
      'Closure': 'Lace-up',
      'Weight': '300g',
      'Warranty': '6 months'
    },
    stock: 120,
    category: 'Fashion',
    brand: 'Nike',
    tags: ['Shoes', 'Sports', 'Running', 'Casual']
  },
  {
    id: 103,
    title: 'Apple Watch Series 8',
    price: 349,
    originalPrice: 429,
    rating: 4.8,
    reviews: 2100,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1434493650001-5d43a6fea0cc?auto=format&fit=crop&w=1000&q=80',
    ],
    discount: 18,
    description: 'Apple Watch Series 8 features temperature sensing for deeper insights into women\'s health, crash detection, and innovative safety technologies.',
    features: [
      'Temperature sensing',
      'Crash detection',
      'Low power mode',
      'Always-On Retina display',
      'Water resistant 50m',
      'Blood oxygen app'
    ],
    specifications: {
      'Color': 'Midnight',
      'Size': '45mm',
      'Connectivity': 'GPS + Cellular',
      'Battery Life': '18 hours',
      'Material': 'Aluminum',
      'Warranty': '1 year'
    },
    stock: 89,
    category: 'Electronics',
    brand: 'Apple',
    tags: ['Wearable', 'Smartwatch', 'Fitness', 'Premium']
  },
  {
    id: 301,
    title: 'Leather Crossbody Bag',
    price: 85,
    originalPrice: 120,
    rating: 4.6,
    reviews: 120,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    ],
    discount: 29,
    description: 'Genuine leather crossbody bag with multiple compartments. Perfect for everyday use with adjustable strap and secure zipper closure.',
    features: [
      'Genuine leather',
      'Adjustable crossbody strap',
      'Multiple compartments',
      'Secure zipper closure',
      'Lightweight and durable'
    ],
    specifications: {
      'Color': 'Brown',
      'Dimensions': '25 x 15 x 8 cm',
      'Material': 'Genuine Leather',
      'Compartments': '3 main + 2 inner',
      'Weight': '450g',
      'Warranty': '1 year'
    },
    stock: 34,
    category: 'Fashion',
    brand: 'LuxeLeather',
    tags: ['Bag', 'Leather', 'Accessory', 'Fashion']
  }
];

// Sample reviews data structure
const SAMPLE_REVIEWS = [
  {
    id: 1,
    userId: 'user_001',
    userName: 'John Doe',
    userAvatar: '',
    rating: 5,
    comment: 'Excellent product! The noise cancellation is incredible and battery life lasts all day.',
    date: '2024-01-15',
    verifiedPurchase: true
  },
  {
    id: 2,
    userId: 'user_002',
    userName: 'Sarah Smith',
    userAvatar: '',
    rating: 4,
    comment: 'Great headphones, very comfortable. The sound quality is amazing for the price.',
    date: '2024-01-10',
    verifiedPurchase: true
  },
  {
    id: 3,
    userId: 'user_003',
    userName: 'Mike Johnson',
    userAvatar: '',
    rating: 5,
    comment: 'Best headphones I\'ve ever owned. Worth every penny!',
    date: '2024-01-05',
    verifiedPurchase: false
  }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Real-time reviews state
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    userName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  
  // Ref for auto-scroll to reviews
  const reviewsRef = useRef(null);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundProduct = PRODUCTS_DATA.find(p => p.id === parseInt(id)) || PRODUCTS_DATA[0];
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Real-time reviews functionality
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const review = {
        id: reviews.length + 1,
        userId: `user_${Date.now()}`,
        userName: newReview.userName || 'Anonymous User',
        userAvatar: '',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        verifiedPurchase: Math.random() > 0.5 // Random for demo
      };

      setReviews([review, ...reviews]);
      setNewReview({
        rating: 5,
        comment: '',
        userName: '',
      });
      setShowReviewForm(false);
      setIsSubmitting(false);
      
      // Update product rating (average)
      if (product) {
        const newAvgRating = (
          (product.rating * product.reviews + review.rating) / 
          (product.reviews + 1)
        ).toFixed(1);
        
        setProduct(prev => ({
          ...prev,
          rating: parseFloat(newAvgRating),
          reviews: prev.reviews + 1
        }));
      }
    }, 1000);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: quantity
      });
      alert(`Added ${quantity} ${product.title} to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: quantity
      });
      navigate('/cart');
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, product?.stock || 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Jumia MVP!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Scroll to reviews
  const scrollToReviews = () => {
    setActiveTab('reviews');
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Mobile responsive handlers
  const handleImageNavigation = (direction) => {
    if (!product) return;
    if (direction === 'next') {
      setSelectedImage(prev => (prev + 1) % product.images.length);
    } else {
      setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
          <div className="animate-pulse">
            <div className="h-4 md:h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="h-[300px] md:h-[500px] bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 mx-auto text-sm md:text-base"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 fixed top-16 left-0 right-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
            {product.title}
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Share2 size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 lg:pt-8">
        {/* Breadcrumb - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-orange-600 transition-colors"
          >
            Home
          </button>
          <ChevronRight size={16} />
          <button 
            onClick={() => navigate(`/category/${product.category.toLowerCase()}`)}
            className="hover:text-orange-600 transition-colors"
          >
            {product.category}
          </button>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Product Images - Mobile Optimized */}
          <div>
            {/* Main Image with Mobile Navigation */}
            <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-white border border-gray-200 mb-3 md:mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {product.discount > 0 && (
                <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-red-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                  -{product.discount}%
                </div>
              )}
              
              {/* Mobile Image Navigation */}
              <div className="lg:hidden absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-2">
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className="absolute top-3 md:top-4 right-3 md:right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  size={20} 
                  className={isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'} 
                />
              </button>
            </div>

            {/* Image Counter for Mobile */}
            <div className="lg:hidden text-center text-sm text-gray-600 mb-3">
              {selectedImage + 1} / {product.images.length}
            </div>

            {/* Thumbnail Images - Scrollable on Mobile */}
            <div className="hidden lg:flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-orange-500 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Mobile Thumbnail Carousel */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-orange-500 scale-105' 
                      : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6 lg:pt-4">
            {/* Title and Brand */}
            <div>
              <div className="hidden md:flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-500">{product.brand}</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                {product.title}
              </h1>
              
              {/* Rating - Mobile Compact */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                        className={i < Math.floor(product.rating) ? "" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm md:text-base text-gray-700 font-medium ml-1">
                    {product.rating}
                  </span>
                </div>
                <button
                  onClick={scrollToReviews}
                  className="text-sm text-gray-500 hover:text-orange-600"
                >
                  ({product.reviews} reviews)
                </button>
                <span className="text-xs md:text-sm text-green-600 font-medium flex items-center gap-1">
                  <Check size={12} />
                  In Stock
                </span>
              </div>
            </div>

            {/* Price - Mobile Optimized */}
            <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="flex flex-wrap items-baseline gap-2 md:gap-3 mb-1 md:mb-2">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-base md:text-xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm md:text-base font-bold text-red-600">
                      Save ${product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-600">Price includes all taxes</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 md:space-y-3">
              <p className="text-gray-700 font-medium text-sm md:text-base">Quantity</p>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg self-start">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 md:w-16 text-center text-lg md:text-xl font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  Only {product.stock} items left
                </p>
              </div>
            </div>

            {/* Action Buttons - Stack on Mobile */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Buy Now
              </button>
              <button
                onClick={handleShare}
                className="hidden md:flex p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="Share product"
              >
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Delivery Info - Mobile Collapsible */}
            <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="text-green-600" size={18} />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Free Delivery</p>
                  <p className="text-xs md:text-sm text-gray-600">Delivery in 2-3 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="text-blue-600" size={18} />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Easy Returns</p>
                  <p className="text-xs md:text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-purple-600" size={18} />
                <div>
                  <p className="font-medium text-gray-900 text-sm md:text-base">Warranty</p>
                  <p className="text-xs md:text-sm text-gray-600">{product.specifications.Warranty} warranty</p>
                </div>
              </div>
            </div>

            {/* Tags - Mobile Scrollable */}
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Mobile Friendly */}
        <div className="mt-8 md:mt-12" ref={reviewsRef}>
          {/* Mobile Tab Selector */}
          <div className="lg:hidden overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 min-w-max">
              {['description', 'features', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Tab Selector */}
          <div className="hidden lg:block border-b border-gray-200">
            <div className="flex gap-8">
              {['description', 'features', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium text-lg capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-6 md:py-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Product Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Key Features</h3>
                <ul className="space-y-2 md:space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 md:gap-3">
                      <Check className="text-green-500 mt-0.5 md:mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Technical Specifications</h3>
                <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 md:py-3 border-b border-gray-200 last:border-0">
                        <span className="text-gray-600 text-sm md:text-base mb-1 sm:mb-0">{key}</span>
                        <span className="font-medium text-gray-900 text-sm md:text-base">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">Customer Reviews</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {product.reviews} reviews • {product.rating} average rating
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 md:px-6 py-2 md:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm md:text-base whitespace-nowrap"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form Modal */}
                {showReviewForm && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-4 md:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewReview({...newReview, rating: star})}
                                className="text-2xl"
                              >
                                <Star 
                                  size={32}
                                  fill={star <= newReview.rating ? "currentColor" : "none"}
                                  className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={newReview.userName}
                            onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Your name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            placeholder="Share your experience with this product..."
                            required
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !newReview.comment.trim()}
                            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            {!isSubmitting && <Send size={16} />}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4 md:space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={20} className="text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 text-sm md:text-base">
                              {review.userName}
                            </p>
                            {review.verifiedPurchase && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Verified Purchase
                              </span>
                            )}
                            <span className="text-xs md:text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={14} 
                                  fill={i < review.rating ? "currentColor" : "none"} 
                                  className={i < review.rating ? "" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products - Mobile Scrollable */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            You Might Also Like
          </h2>
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto hide-scrollbar pb-4">
            {PRODUCTS_DATA.filter(p => p.id !== product.id).slice(0, 4).map(related => (
              <div 
                key={related.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer min-w-[200px] md:min-w-0 flex-shrink-0"
                onClick={() => navigate(`/product/${related.id}`)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={related.images[0]} 
                    alt={related.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-xs md:text-sm line-clamp-2 mb-2">
                    {related.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-base md:text-lg text-gray-900">
                      ${related.price}
                    </span>
                    {related.originalPrice > related.price && (
                      <span className="text-xs md:text-sm text-gray-400 line-through">
                        ${related.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-2 z-40">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-bold text-sm"
        >
          Buy Now
        </button>
      </div>

      {/* Add CSS for hiding scrollbar on mobile */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 768px) {
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;