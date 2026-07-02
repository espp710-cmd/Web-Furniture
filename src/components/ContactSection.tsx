import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Globe, MessageSquare, Info, Code } from 'lucide-react';
import { motion } from 'motion/react';
import { LandingSettings } from '../types';

interface ContactSectionProps {
  settings: LandingSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    type: 'Bespoke Design Inquiry',
    message: ''
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedMessage = `Halo Dinar Furniture,%0A%0ASaya ingin menjadwalkan kunjungan atelier/konsultasi:%0A- Nama: ${encodeURIComponent(formData.name)}%0A- No. HP: ${encodeURIComponent(formData.phone)}%0A- Tanggal Rencana: ${encodeURIComponent(formData.date)}%0A- Jenis Konsultasi: ${encodeURIComponent(formData.type)}%0A- Catatan Tambahan: ${encodeURIComponent(formData.message)}%0A%0ATerima kasih.`;
    
    // Redirect to whatsapp with dynamic number
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${formattedMessage}`, '_blank');
  };

  return (
    <motion.section 
      id="kontak" 
      className="py-24 bg-white border-b border-brand-beige/50"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 flex flex-col space-y-10">
            <div>
              <span className="font-sans text-[10px] tracking-[0.25em] text-brand-gold uppercase font-bold block mb-3">
                Kunjungi Atelier Kami
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-brand-dark mb-4">
                Visit Our Atelier
              </h2>
              <p className="font-sans text-xs text-brand-dark/70 leading-relaxed">
                Rasakan kehalusan tekstur kayu, ketahanan sambungan kuningan, dan kenyamanan kain boucle kami secara langsung. Kami sangat merekomendasikan janji temu terlebih dahulu untuk pelayanan prima dari curator kami.
              </p>
            </div>

            <div className="flex flex-col space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-cream rounded-sm text-brand-brown">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-dark mb-1">Alamat Showroom</h4>
                  <p className="font-sans text-xs text-brand-dark/70 leading-relaxed whitespace-pre-line">
                    {settings.showroomAddress}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-cream rounded-sm text-brand-brown">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-dark mb-1">Jam Operasional</h4>
                  <p className="font-sans text-xs text-brand-dark/70 leading-relaxed whitespace-pre-line">
                    {settings.operationalHours}
                  </p>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-cream rounded-sm text-brand-brown">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans text-xs tracking-wider uppercase font-bold text-brand-dark mb-1">Kontak & Pertanyaan</h4>
                  <p className="font-sans text-xs text-brand-dark/70 leading-relaxed">
                    {settings.emailContact}<br/>
                    {settings.phoneContact} (WhatsApp & Telepon)
                  </p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-6 border-t border-brand-beige flex items-center space-x-6">
              <a 
                href={settings.instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="font-sans text-xs tracking-widest uppercase font-bold text-brand-dark hover:text-brand-brown transition-colors"
              >
                Instagram
              </a>
              <span className="text-brand-beige-dark">•</span>
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="font-sans text-xs tracking-widest uppercase font-bold text-brand-dark hover:text-brand-brown transition-colors"
              >
                WhatsApp
              </a>
              <span className="text-brand-beige-dark">•</span>
              <a 
                href={settings.facebookUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="font-sans text-xs tracking-widest uppercase font-bold text-brand-dark hover:text-brand-brown transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Form and Map Panel */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Appointment Booking Form */}
            <div className="md:col-span-6 bg-brand-cream p-6 rounded-sm border border-brand-beige/80">
              <h3 className="font-serif text-xl text-brand-dark mb-4">Book Appointment</h3>
              
              <form onSubmit={handleBookAppointment} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-brand-dark/70 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brown rounded-sm"
                    placeholder="Contoh: Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="block text-brand-dark/70 font-semibold mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brown rounded-sm"
                    placeholder="Contoh: 08123456789"
                  />
                </div>

                <div>
                  <label className="block text-brand-dark/70 font-semibold mb-1">Rencana Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brown rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-brand-dark/70 font-semibold mb-1">Tujuan Konsultasi</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brown rounded-sm"
                  >
                    <option>Bespoke Design Inquiry</option>
                    <option>Product Viewing / Fitting</option>
                    <option>Price Negotiation Discussion</option>
                    <option>Interior Designer Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brand-dark/70 font-semibold mb-1">Pesan Tambahan (Opsional)</label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-brand-beige-dark px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brown rounded-sm resize-none"
                    placeholder="Beri tahu kami produk yang Anda minati..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-brown hover:bg-brand-dark text-white font-semibold py-3 uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 rounded-sm shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-brand-gold" />
                  <span>Kirim via WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Stylized London / Jakarta Monochrome Luxury Map or dynamic iframe */}
            <div className="md:col-span-6 h-full min-h-[300px] relative rounded-sm overflow-hidden border border-brand-beige group">
              {settings.googleMapsIframeUrl ? (
                <iframe
                  src={settings.googleMapsIframeUrl}
                  className="w-full h-full border-0 min-h-[300px]"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dinar Furniture Showroom Map"
                ></iframe>
              ) : (
                <>
                  <img
                    alt="Map to Dinar Furniture Showroom"
                    className="w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9OTijvf9LzqGWxRzv4mpQNyO1YvKGV0PMrhIdsu4FE4sI0ztHiZ2CQzqF5LDFwmAoFfNK4cHXqWkNQxj7SvRbt-T2hAX6u2L5BWE6ShhKaaHrEKJOGFJcnYMuXa1FAenlIslBA3Tl1W7Z-FmR70rqXRW8Oa05jSL_Q9IGMmziUb1SpPbbDAdy2RkEbJ5HV78Af3d3jUlamta3-nXA60d4zn11UI9rxcDurY_WkGQ9wuenSvCWHd-H1q8TBzjc4hD8TU7o2pVmf3vp"
                  />
                  {/* Inner glowing locator dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-brown border-2 border-brand-gold"></span>
                    </span>
                    <span className="mt-1 bg-brand-dark text-white text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase">
                      {settings.showroomName || 'Dinar Showroom'}
                    </span>
                  </div>
                </>
              )}

              {/* Directions layer */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3.5 border border-brand-beige text-brand-dark shadow-md">
                <p className="font-serif text-xs font-semibold">{settings.showroomName || 'Atelier Showroom Kav.15'}</p>
                <p className="font-sans text-[10px] text-brand-dark/70 mt-1 line-clamp-2">{settings.showroomAddress}</p>
                <a 
                  href={settings.googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-sans text-[10px] font-bold tracking-wider text-brand-brown hover:text-brand-gold uppercase mt-2 inline-flex items-center gap-1"
                >
                  <span>Buka Google Maps</span>
                  <Globe className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.section>
  );
}
