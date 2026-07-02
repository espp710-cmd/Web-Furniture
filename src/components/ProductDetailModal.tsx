import React, { useState } from 'react';
import { Product, Review } from '../types';
import { X, Star, Heart, ArrowRight, MessageSquareCode, ShoppingBag, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onNegotiate: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'approved'>) => void;
  whatsappNumber: string;
}

export default function ProductDetailModal({
  product,
  onClose,
  onNegotiate,
  isWishlisted,
  onToggleWishlist,
  onAddReview,
  whatsappNumber
}: ProductDetailModalProps) {
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  // Filter approved reviews only for user side
  const approvedReviews = product.reviews.filter(r => r.approved);

  const handleOrderWhatsApp = () => {
    const formattedMessage = `Halo Dinar Furniture,%0A%0ASaya ingin memesan produk berikut:%0A- Produk: ${encodeURIComponent(product.name)}%0A- Harga: ${encodeURIComponent(formatCurrency(product.price))}%0A%0AMohon info ketersediaan stok dan tata cara pengirimannya. Terima kasih!`;
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${formattedMessage}`, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    onAddReview(product.id, {
      author: reviewName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewName('');
    setReviewRating(5);
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white max-w-4xl w-full rounded-sm overflow-hidden border border-brand-beige shadow-2xl relative max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-brand-dark hover:text-brand-brown bg-white/80 backdrop-blur-sm rounded-full border border-brand-beige"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body Scroll Container */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Product Image & Badges */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-brand-beige">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && (
                  <span className="bg-brand-gold text-brand-dark text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
                    Best Seller
                  </span>
                )}
                {isOutOfStock ? (
                  <span className="bg-brand-brown text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
                    Stok Habis
                  </span>
                ) : isLowStock ? (
                  <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
                    Sisa {product.stock} Unit!
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right: Product Meta Details */}
            <div className="flex flex-col space-y-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-brown font-bold">
                {product.category}
              </span>
              
              <h2 className="font-serif text-3xl text-brand-dark leading-tight">{product.name}</h2>

              {/* Rating header */}
              <div className="flex items-center gap-3 text-xs font-sans text-brand-dark/70">
                <div className="flex items-center gap-1 text-brand-gold">
                  <Star className="w-4 h-4 fill-brand-gold" />
                  <span className="font-bold text-brand-dark">{product.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>Terjual {product.soldCount} unit</span>
                <span>•</span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} Tersedia` : 'Habis'}
                </span>
              </div>

              <div className="text-xl font-serif font-bold text-brand-brown py-2 border-y border-brand-beige">
                {formatCurrency(product.price)}
              </div>

              <p className="font-sans text-xs text-brand-dark/70 leading-relaxed">
                {product.description}
              </p>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-sans text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={handleOrderWhatsApp}
                  className="w-full bg-brand-brown hover:bg-brand-dark text-white py-3.5 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-gold" />
                  <span>Pesan via WA</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNegotiate(product);
                  }}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-4 rounded-sm border transition-colors flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                      : 'border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white'
                  }`}
                >
                  <MessageSquareCode className="w-4 h-4" />
                  <span>Negosiasi Harga</span>
                </button>
              </div>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className="text-xs font-sans font-bold text-brand-dark/70 hover:text-red-500 flex items-center gap-2 pt-2 transition-colors"
              >
                <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Bottom section: Reviews */}
          <div className="pt-8 border-t border-brand-beige grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Approved Reviews List */}
            <div className="space-y-6">
              <h3 className="font-serif text-lg text-brand-dark">Review Pelanggan ({approvedReviews.length})</h3>
              
              {approvedReviews.length === 0 ? (
                <div className="text-xs text-brand-dark/50 italic bg-brand-cream/50 p-4 rounded-sm">
                  Belum ada review untuk produk ini. Jadilah yang pertama memberikan ulasan.
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {approvedReviews.map((rev) => (
                    <div key={rev.id} className="bg-brand-cream/50 p-4 rounded-sm border border-brand-beige/50 font-sans text-xs">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-brand-dark">{rev.author}</span>
                        <span className="text-brand-dark/40 text-[10px]">{rev.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-0.5 text-brand-gold mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-brand-gold' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-brand-dark/80 italic leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Submission Form */}
            <div className="bg-brand-cream p-6 rounded-sm border border-brand-beige">
              <h3 className="font-serif text-lg text-brand-dark mb-4">Tulis Ulasan</h3>
              
              {reviewSubmitted ? (
                <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-sm flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Review Terkirim!</span>
                    Review Anda telah berhasil diserahkan dan sedang menunggu proses moderasi oleh Admin Dinar Furniture demi menjaga ulasan berkualitas.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 font-sans text-xs">
                  <div>
                    <label className="block text-brand-dark/70 font-semibold mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                      placeholder="Contoh: Marcus Chen"
                    />
                  </div>

                  <div>
                    <label className="block text-brand-dark/70 font-semibold mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewRating(i + 1)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              i < reviewRating ? 'fill-brand-gold text-brand-gold' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-brand-dark/70 font-semibold mb-1">Komentar Ulasan</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm resize-none"
                      placeholder="Bagikan pengalaman Anda mengenai kualitas pengerjaan, material, dll..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-brown hover:bg-brand-dark text-white font-semibold py-2.5 uppercase tracking-wider transition-colors rounded-sm"
                  >
                    Kirim Ulasan
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
