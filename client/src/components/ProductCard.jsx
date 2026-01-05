import React from 'react';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './Button';

const ProductCard = ({ product, isFlash = false, className = '', showReason = false }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const inCart = isInCart(product.id);
  const quantityInCart = getItemQuantity(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer ${className}`}>
      {/* ... rest of your existing product card code ... */}
      
      {/* Quick Add Overlay - UPDATE THIS */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <Button 
          variant={inCart ? "secondary" : "primary"} 
          className="w-full text-sm py-2 shadow-lg flex items-center justify-center gap-2"
          onClick={handleAddToCart}
        >
          {inCart ? (
            <>
              <span>Added ({quantityInCart})</span>
              <span className="text-xs">Click to add more</span>
            </>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </div>
      
      {/* ... rest of your existing product card code ... */}
    </div>
  );
};

export default ProductCard;