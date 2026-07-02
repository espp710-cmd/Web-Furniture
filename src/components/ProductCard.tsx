import { Product } from '../types';
import { Heart, Star, ShoppingCart, MessageSquareCode } from 'lucide-react';
import { formatCurrency } from '../data';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onNegotiate: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onNegotiate,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 35 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
          opacity: 0,
          y: -20,
          transition: { duration: 0.3 }
        }
      }}
      className="group relative bg-white border border-brand-beige rounded-sm overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(44,36,30,0.02)] hover:shadow-[0_20px_40px_rgba(44,36,30,0.06)] hover:-translate-y-1 transition-all duration-300"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={product.image}
        />
        
        {/* Soft tone tint */}
        <div className="absolute inset-0 bg-brand-dark/5 opacity-40 group-hover:opacity-10 transition-opacity" />

        {/* Badges on Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isBestSeller && (
            <span className="font-sans text-[9px] tracking-widest uppercase font-bold bg-brand-gold text-brand-dark px-2.5 py-1 rounded-sm shadow-sm">
              Best Seller
            </span>
          )}
          {isOutOfStock ? (
            <span className="font-sans text-[9px] tracking-widest uppercase font-bold bg-brand-brown text-white px-2.5 py-1 rounded-sm shadow-sm">
              Stok Habis
            </span>
          ) : isLowStock ? (
            <span className="font-sans text-[9px] tracking-widest uppercase font-bold bg-red-600 text-white px-2.5 py-1 rounded-sm shadow-sm">
              Sisa {product.stock} Unit
            </span>
          ) : null}
        </div>

        {/* Wishlist Button on Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-brand-beige text-brand-dark hover:text-red-500 hover:bg-white transition-all"
        >
          <Heart
            className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="font-sans text-[10px] tracking-widest uppercase text-brand-brown font-bold mb-1">
          {product.category}
        </span>

        <h3 
          onClick={() => onViewDetails(product)}
          className="font-serif text-xl text-brand-dark hover:text-brand-brown transition-colors cursor-pointer mb-2 line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Rating and Sold Count */}
        <div className="flex items-center gap-3 text-xs text-brand-dark/70 mb-4 font-sans">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
            <span className="font-semibold text-brand-dark">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-brand-beige-dark">|</span>
          <span>Terjual {product.soldCount} unit</span>
        </div>

        <p className="font-sans text-xs text-brand-dark/60 line-clamp-2 mb-5">
          {product.description}
        </p>

        {/* Price and Actions */}
        <div className="mt-auto pt-4 border-t border-brand-beige flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-wider uppercase text-brand-dark/40 font-semibold">Harga</span>
            <span className="font-serif text-lg font-bold text-brand-brown">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Detail/View Button */}
            <button
              onClick={() => onViewDetails(product)}
              className="p-2.5 bg-brand-cream hover:bg-brand-beige text-brand-dark rounded-sm transition-colors"
              title="Lihat Detail"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            {/* Price Negotiation Button */}
            <button
              onClick={() => onNegotiate(product)}
              disabled={isOutOfStock}
              className={`font-sans text-[10px] tracking-widest uppercase font-bold border px-3.5 py-2.5 rounded-sm transition-all duration-300 ${
                isOutOfStock
                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white inline-flex items-center gap-1.5'
              }`}
            >
              <MessageSquareCode className="w-3 h-3" />
              <span>Nego</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
