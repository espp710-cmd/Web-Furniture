import React, { useState } from 'react';
import { Product, Negotiation } from '../types';
import { X, MessageSquare, Handshake, Info } from 'lucide-react';
import { formatCurrency } from '../data';
import { motion } from 'motion/react';

interface NegotiationModalProps {
  product: Product;
  onClose: () => void;
  onSubmitNegotiation: (negotiation: Omit<Negotiation, 'id' | 'status' | 'date'>) => void;
  whatsappNumber: string;
}

export default function NegotiationModal({
  product,
  onClose,
  onSubmitNegotiation,
  whatsappNumber
}: NegotiationModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [proposedPrice, setProposedPrice] = useState(product.price * 0.9); // default to 10% off
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePriceChange = (value: number) => {
    if (value > product.price) {
      setError('Harga penawaran tidak boleh melebihi harga katalog asli.');
    } else if (value < product.price * 0.6) {
      setError('Penawaran terlalu rendah. Batas negosiasi minimum adalah 60% dari harga katalog.');
    } else {
      setError('');
    }
    setProposedPrice(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (proposedPrice > product.price) {
      setError('Harga penawaran tidak boleh melebihi harga katalog asli.');
      return;
    }
    if (proposedPrice < product.price * 0.6) {
      setError('Penawaran terlalu rendah. Batas negosiasi minimum adalah 60% dari harga katalog.');
      return;
    }

    onSubmitNegotiation({
      productId: product.id,
      productName: product.name,
      clientName,
      clientPhone,
      originalPrice: product.price,
      proposedPrice,
      message
    });

    // Create custom WhatsApp redirect message
    const waMessage = `Halo Dinar Furniture,%0A%0ASaya ingin melakukan negosiasi harga untuk produk berikut:%0A- Produk: ${encodeURIComponent(product.name)}%0A- Harga Asli: ${encodeURIComponent(formatCurrency(product.price))}%0A- Penawaran Saya: ${encodeURIComponent(formatCurrency(proposedPrice))}%0A- Nama: ${encodeURIComponent(clientName)}%0A- No. HP: ${encodeURIComponent(clientPhone)}%0A- Catatan: ${encodeURIComponent(message)}%0A%0AMohon info lebih lanjut apakah penawaran ini dapat disetujui. Terima kasih!`;
    
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${waMessage}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white max-w-md w-full rounded-sm overflow-hidden border border-brand-beige shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-brand-beige flex justify-between items-center bg-brand-cream">
          <div className="flex items-center gap-2 text-brand-brown">
            <Handshake className="w-5 h-5 text-brand-gold" />
            <h3 className="font-serif text-lg font-bold text-brand-dark">Form Negosiasi Harga</h3>
          </div>
          <button onClick={onClose} className="p-1 text-brand-dark hover:text-brand-brown">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-sans text-xs">
          {/* Product Mini card */}
          <div className="flex items-center gap-3 p-3 bg-brand-cream/40 border border-brand-beige rounded-sm">
            <div className="w-16 h-16 rounded-sm overflow-hidden border border-brand-beige flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-serif text-sm text-brand-dark font-semibold leading-tight">{product.name}</h4>
              <span className="text-brand-dark/40 block mt-0.5">Harga Katalog:</span>
              <span className="font-bold text-brand-brown">{formatCurrency(product.price)}</span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-sm text-blue-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed text-[11px]">
              Curator Dinar Furniture menghargai apresiasi seni Anda. Silakan tawarkan harga yang adil. Batas penawaran minimum adalah <strong>60% ({formatCurrency(product.price * 0.6)})</strong> dari harga resmi.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-brand-dark/70 font-semibold mb-1">Nama Pengaju</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm focus:outline-none focus:border-brand-brown"
                placeholder="Contoh: Amelia Wijaya"
              />
            </div>

            <div>
              <label className="block text-brand-dark/70 font-semibold mb-1">Nomor WhatsApp / HP</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm focus:outline-none focus:border-brand-brown"
                placeholder="Contoh: 08123456789"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-brand-dark/70 font-semibold">Harga yang Anda Tawarkan</label>
                <span className="text-[10px] text-brand-brown font-bold">
                  Hemat {Math.round(((product.price - proposedPrice) / product.price) * 100)}%
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold text-brand-dark/40">Rp</span>
                <input
                  type="number"
                  required
                  value={proposedPrice}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="w-full bg-white border border-brand-beige-dark pl-9 pr-3 py-2 text-brand-dark font-bold rounded-sm focus:outline-none focus:border-brand-brown"
                />
              </div>
              {error ? (
                <p className="text-red-600 text-[11px] mt-1 font-semibold">{error}</p>
              ) : (
                <p className="text-brand-dark/40 text-[10px] mt-1">
                  Rekomendasi penawaran: {formatCurrency(product.price * 0.9)} (Potongan 10%)
                </p>
              )}
            </div>

            <div>
              <label className="block text-brand-dark/70 font-semibold mb-1">Pesan / Alasan Negosiasi</label>
              <textarea
                required
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm focus:outline-none focus:border-brand-brown resize-none"
                placeholder="Tulis alasan atau penawaran grosir Anda..."
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3.5 uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-brand-gold" />
            <span>Kirim & Ajukan ke WhatsApp</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
