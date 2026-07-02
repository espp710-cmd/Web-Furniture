import { Product } from '../types';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '../data';
import { motion } from 'motion/react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onViewDetails: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onViewDetails
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="w-screen max-w-md bg-white border-l border-brand-beige flex flex-col h-full shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-beige flex justify-between items-center bg-brand-cream">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="font-serif text-lg font-bold text-brand-dark">Wishlist Saya</h3>
              <span className="bg-brand-brown text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {wishlistItems.length}
              </span>
            </div>
            <button onClick={onClose} className="p-1 text-brand-dark hover:text-brand-brown">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 bg-brand-cream rounded-full text-brand-dark/30">
                  <Heart className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-brand-dark">Belum ada wishlist</h4>
                  <p className="text-xs text-brand-dark/50 mt-1 max-w-xs mx-auto">
                    Katalog Dinar Furniture dipenuhi mahakarya. Tandai produk kesukaan Anda untuk merencanakan tata ruang impian.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex gap-4 p-4 bg-brand-cream/30 border border-brand-beige rounded-sm hover:border-brand-beige-dark transition-colors group relative"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-sm overflow-hidden border border-brand-beige flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 
                          onClick={() => {
                            onClose();
                            onViewDetails(product);
                          }}
                          className="font-serif text-sm font-semibold text-brand-dark hover:text-brand-brown cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <span className="font-sans text-[10px] tracking-wider uppercase text-brand-brown block mt-0.5">
                          {product.category}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline mt-2">
                        <span className="font-serif text-xs font-bold text-brand-brown">
                          {formatCurrency(product.price)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onClose();
                              onViewDetails(product);
                            }}
                            className="p-1.5 text-brand-dark hover:text-brand-brown bg-white border border-brand-beige rounded-sm"
                            title="Detail"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 bg-white border border-brand-beige rounded-sm"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Action */}
          {wishlistItems.length > 0 && (
            <div className="p-6 border-t border-brand-beige bg-brand-cream flex flex-col gap-3 font-sans text-xs">
              <div className="flex justify-between items-baseline font-serif">
                <span className="text-brand-dark/70">Estimasi Total Investasi</span>
                <span className="text-base font-bold text-brand-brown">
                  {formatCurrency(wishlistItems.reduce((acc, curr) => acc + curr.price, 0))}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3 uppercase tracking-wider text-center rounded-sm transition-colors"
              >
                Kembali ke Katalog
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
