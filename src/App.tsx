import { useState, useEffect } from 'react';
import { Product, Negotiation, Project, Review, LandingSettings } from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_PROJECTS, INITIAL_NEGOTIATIONS, 
  DEFAULT_LANDING_SETTINGS, getLocalStorageState, setLocalStorageState 
} from './data';
import Splash from './components/Splash';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import NegotiationModal from './components/NegotiationModal';
import WishlistDrawer from './components/WishlistDrawer';
import Portfolio from './components/Portfolio';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';
import { Search, SlidersHorizontal, Heart, CheckCircle, Info, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // Loading splash state
  const [isSplashActive, setIsSplashActive] = useState(true);

  // Core Data States (persisted in localStorage)
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // product IDs
  const [landingSettings, setLandingSettings] = useState<LandingSettings>(DEFAULT_LANDING_SETTINGS);
  const [visitorCount, setVisitorCount] = useState<number>(132);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);

  // Modals active states
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [activeNegotiateProduct, setActiveNegotiateProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Initialize data once splash finishes or app loads
  useEffect(() => {
    setProducts(getLocalStorageState('dinar_products_v1', INITIAL_PRODUCTS));
    setProjects(getLocalStorageState('dinar_projects_v1', INITIAL_PROJECTS));
    setNegotiations(getLocalStorageState('dinar_negotiations_v1', INITIAL_NEGOTIATIONS));
    setWishlist(getLocalStorageState('dinar_wishlist_v1', []));
    setLandingSettings(getLocalStorageState('dinar_landing_settings_v1', DEFAULT_LANDING_SETTINGS));
    
    // Visitor counter logic (start at 132 as default and increment on each load)
    const storedVisitors = getLocalStorageState('dinar_visitors_v1', 132);
    const newCount = storedVisitors + 1;
    setVisitorCount(newCount);
    setLocalStorageState('dinar_visitors_v1', newCount);
  }, []);

  // Synced updates to localStorage
  const updateProductsState = (newProducts: Product[]) => {
    setProducts(newProducts);
    setLocalStorageState('dinar_products_v1', newProducts);
  };

  const updateNegotiationsState = (newNegos: Negotiation[]) => {
    setNegotiations(newNegos);
    setLocalStorageState('dinar_negotiations_v1', newNegos);
  };

  const updateWishlistState = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    setLocalStorageState('dinar_wishlist_v1', newWishlist);
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Wishlist actions
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      const updated = wishlist.filter(id => id !== productId);
      updateWishlistState(updated);
    } else {
      const updated = [...wishlist, productId];
      updateWishlistState(updated);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    const updated = wishlist.filter(id => id !== productId);
    updateWishlistState(updated);
  };

  // Submit client-side custom review (marked approved=false until admin approves)
  const handleAddReview = (productId: string, partialReview: Omit<Review, 'id' | 'date' | 'approved'>) => {
    const updatedProducts = products.map(prod => {
      if (prod.id === productId) {
        const newReview: Review = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          author: partialReview.author,
          rating: partialReview.rating,
          comment: partialReview.comment,
          date: new Date().toISOString().split('T')[0],
          approved: false // starts as unapproved for moderation!
        };
        return {
          ...prod,
          reviews: [...prod.reviews, newReview]
        };
      }
      return prod;
    });
    updateProductsState(updatedProducts);
  };

  // Negotiation Action (client files a negotiation request)
  const handleCreateNegotiation = (partialNego: Omit<Negotiation, 'id' | 'status' | 'date'>) => {
    const newNego: Negotiation = {
      ...partialNego,
      id: `nego-${Date.now()}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    updateNegotiationsState([newNego, ...negotiations]);
  };

  // Admin CRUD Functions
  const handleAdminAddProduct = (newProd: Omit<Product, 'id' | 'reviews'> & { rating?: number; soldCount?: number }) => {
    const freshProduct: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      rating: newProd.rating ?? 5.0,
      soldCount: newProd.soldCount ?? 0,
      reviews: []
    };
    updateProductsState([freshProduct, ...products]);
  };

  const handleAdminUpdateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    updateProductsState(updated);
    // Refresh modal if active
    if (activeDetailProduct?.id === updatedProd.id) {
      setActiveDetailProduct(updatedProd);
    }
  };

  const handleAdminDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    updateProductsState(updated);
    // Remove from wishlist too
    if (wishlist.includes(productId)) {
      updateWishlistState(wishlist.filter(id => id !== productId));
    }
    if (activeDetailProduct?.id === productId) {
      setActiveDetailProduct(null);
    }
  };

  // Portfolio Project CRUD Functions
  const handleAdminAddProject = (newProj: Omit<Project, 'id'>) => {
    const freshProject: Project = {
      ...newProj,
      id: `proj-${Date.now()}`
    };
    const updated = [freshProject, ...projects];
    setProjects(updated);
    setLocalStorageState('dinar_projects_v1', updated);
  };

  const handleAdminUpdateProject = (updatedProj: Project) => {
    const updated = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(updated);
    setLocalStorageState('dinar_projects_v1', updated);
  };

  const handleAdminDeleteProject = (projectId: string) => {
    const updated = projects.filter(p => p.id !== projectId);
    setProjects(updated);
    setLocalStorageState('dinar_projects_v1', updated);
  };

  const handleUpdateLandingSettings = (newSettings: LandingSettings) => {
    setLandingSettings(newSettings);
    setLocalStorageState('dinar_landing_settings_v1', newSettings);
  };

  const handleAdminUpdateNegotiationStatus = (negotiationId: string, status: 'approved' | 'rejected') => {
    const updated = negotiations.map(n => {
      if (n.id === negotiationId) {
        // If approved, let's increment the sold count of the product as a mock sale!
        if (status === 'approved') {
          const matchingProduct = products.find(p => p.id === n.productId);
          if (matchingProduct) {
            handleAdminUpdateProduct({
              ...matchingProduct,
              soldCount: matchingProduct.soldCount + 1,
              stock: Math.max(0, matchingProduct.stock - 1)
            });
          }
        }
        return { ...n, status };
      }
      return n;
    });
    updateNegotiationsState(updated);
  };

  const handleAdminApproveReview = (productId: string, reviewId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const updatedReviews = p.reviews.map(r => r.id === reviewId ? { ...r, approved: true } : r);
        // Calculate new product rating average
        const approvedOnes = updatedReviews.filter(r => r.approved);
        const avgRating = approvedOnes.length > 0 
          ? approvedOnes.reduce((acc, curr) => acc + curr.rating, 0) / approvedOnes.length 
          : 5.0;
        return {
          ...p,
          reviews: updatedReviews,
          rating: avgRating
        };
      }
      return p;
    });
    updateProductsState(updated);
  };

  const handleAdminDeleteReview = (productId: string, reviewId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const updatedReviews = p.reviews.filter(r => r.id !== reviewId);
        const approvedOnes = updatedReviews.filter(r => r.approved);
        const avgRating = approvedOnes.length > 0 
          ? approvedOnes.reduce((acc, curr) => acc + curr.rating, 0) / approvedOnes.length 
          : 5.0;
        return {
          ...p,
          reviews: updatedReviews,
          rating: avgRating
        };
      }
      return p;
    });
    updateProductsState(updated);
  };

  // Filter & Sort core process
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesStock = !filterOutOfStock || prod.stock > 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'bestseller') return b.soldCount - a.soldCount;
    if (sortOption === 'rating') return b.rating - a.rating;
    return 0; // featured/default
  });

  // Derived wishlisted items array
  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col relative">
      {/* Ambient Splash Screen Intro */}
      <AnimatePresence>
        {isSplashActive && (
          <Splash 
            onComplete={() => setIsSplashActive(false)} 
            logoImage={landingSettings?.logoImage} 
          />
        )}
      </AnimatePresence>

      {!isSplashActive && (
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header
            wishlistCount={wishlist.length}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            isAdminMode={isAdminOpen}
            onExitAdmin={() => setIsAdminOpen(false)}
            scrollToSection={scrollToSection}
            settings={landingSettings}
          />

          {/* Hero section */}
          <Hero onExploreClick={() => scrollToSection('katalog')} settings={landingSettings} />

          {/* Core Feature: Interactive Product Gallery (Galeri Produk) */}
          <motion.section 
            id="katalog" 
            className="py-24 max-w-7xl mx-auto px-6 w-full flex flex-col gap-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            
            {/* Gallery Intro Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-beige pb-8">
              <div className="max-w-xl">
                <span className="font-sans text-[10px] tracking-[0.25em] text-brand-gold uppercase font-bold block mb-2">
                  Katalog Premium
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-brand-dark">
                  Galeri Produk Curation
                </h2>
                <p className="font-sans text-xs text-brand-dark/60 mt-2 leading-relaxed">
                  Jelajahi karya desain modern klasik dengan standar pengerjaan kayu dan jahitan terbaik. Semua produk dapat ditawar harganya melalui form negosiasi resmi kami.
                </p>
              </div>

              {/* Quick statistics/badge row */}
              <div className="flex items-center gap-4 bg-white px-5 py-3 border border-brand-beige rounded-sm">
                <Heart className="w-5 h-5 text-brand-gold fill-brand-gold animate-pulse" />
                <div className="font-sans text-xs">
                  <span className="font-bold text-brand-dark block">{wishlist.length} Item Tersimpan</span>
                  <span className="text-[10px] text-brand-dark/40 block">Di wishlist pribadi Anda</span>
                </div>
              </div>
            </div>

            {/* Filter controls row */}
            <div className="bg-white border border-brand-beige p-5 rounded-sm flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_4px_12px_rgba(107,79,58,0.01)]">
              {/* Category selector pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 font-sans text-xs font-bold uppercase tracking-wider">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'living', label: 'Living Room' },
                  { id: 'seating', label: 'Seating' },
                  { id: 'tables', label: 'Tables' },
                  { id: 'bedroom', label: 'Bedroom' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-sm border transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-brand-brown border-brand-brown text-white shadow-sm'
                        : 'border-brand-beige text-brand-dark/70 hover:bg-brand-cream'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar & Extra controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-dark/40">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari sofa, meja, ranjang..."
                    className="w-full bg-brand-cream border border-brand-beige-dark pl-9 pr-4 py-2 font-sans text-xs text-brand-dark rounded-sm focus:outline-none focus:border-brand-brown focus:ring-0"
                  />
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto font-sans text-xs">
                  <span className="text-brand-dark/40 font-bold whitespace-nowrap uppercase">Urutkan:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full sm:w-auto bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm focus:outline-none"
                  >
                    <option value="featured">Pilihan Utama</option>
                    <option value="bestseller">Terlaris (Best Seller)</option>
                    <option value="price-low">Harga Terendah</option>
                    <option value="price-high">Harga Tertinggi</option>
                    <option value="rating">Rating Tertinggi</option>
                  </select>
                </div>

                {/* Stock Checkbox */}
                <div className="flex items-center gap-2 whitespace-nowrap font-sans text-xs">
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={filterOutOfStock}
                    onChange={(e) => setFilterOutOfStock(e.target.checked)}
                    className="rounded-sm border-brand-beige-dark text-brand-brown focus:ring-brand-brown"
                  />
                  <label htmlFor="stockCheck" className="font-semibold text-brand-dark">Stok Tersedia</label>
                </div>
              </div>
            </div>

            {/* Product grid displaying items */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-brand-beige rounded-sm">
                <SlidersHorizontal className="w-12 h-12 text-brand-dark/20 mx-auto mb-4" />
                <h4 className="font-serif text-lg text-brand-dark">Tidak ada produk ditemukan</h4>
                <p className="font-sans text-xs text-brand-dark/50 mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter Anda.</p>
              </div>
            ) : (
              <motion.div 
                layout
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.02
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(prod) => setActiveDetailProduct(prod)}
                      onNegotiate={(prod) => setActiveNegotiateProduct(prod)}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.section>

          {/* Portfolio & Case Study Before-After section */}
          <Portfolio projects={projects} />

          {/* Contact Section & Booking Atelier */}
          <ContactSection settings={landingSettings} />

          {/* Footer of applet */}
          <footer className="bg-brand-dark text-brand-beige py-12 px-6 border-t border-brand-dark/95">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                {landingSettings?.logoImage ? (
                  <img src={landingSettings.logoImage} alt="Dinar Furniture Logo" className="h-10 max-w-[150px] object-contain mx-auto md:mx-0 mb-2 rounded-sm" />
                ) : (
                  <>
                    <span className="font-serif text-2xl font-bold tracking-tight text-white">Dinar</span>
                    <span className="font-sans text-[10px] tracking-[0.3em] text-brand-gold uppercase block font-semibold mt-0.5">Furniture</span>
                  </>
                )}
                <p className="font-sans text-[10px] text-brand-beige/40 mt-2">© 2026 Dinar Furniture Atelier. All rights reserved.</p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6 font-sans text-[10px] uppercase tracking-widest font-semibold text-brand-beige/60">
                <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded border border-white/5 text-brand-beige/50 text-[9px] tracking-normal">
                  <span>Pengunjung:</span>
                  <span className="font-bold text-brand-gold font-mono">{visitorCount}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="hover:text-brand-gold">Beranda</a>
                  <a href="#katalog" onClick={(e) => { e.preventDefault(); scrollToSection('katalog'); }} className="hover:text-brand-gold">Katalog</a>
                  <a href="#portofolio" onClick={(e) => { e.preventDefault(); scrollToSection('portofolio'); }} className="hover:text-brand-gold">Portofolio</a>
                  <a href="#kontak" onClick={(e) => { e.preventDefault(); scrollToSection('kontak'); }} className="hover:text-brand-gold">Atelier Kontak</a>
                </div>

                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="p-1.5 text-brand-beige/40 hover:text-brand-gold hover:bg-white/5 rounded transition-all focus:outline-none"
                  title="Atelier Admin Settings"
                  id="footer-admin-btn"
                >
                  <Settings className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
                </button>
              </div>
            </div>
          </footer>

          {/* Modals & Slide-outs */}
          <AnimatePresence>
            {/* Product Details Modal */}
            {activeDetailProduct && (
              <ProductDetailModal
                product={activeDetailProduct}
                onClose={() => setActiveDetailProduct(null)}
                onNegotiate={(prod) => setActiveNegotiateProduct(prod)}
                isWishlisted={wishlist.includes(activeDetailProduct.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddReview={handleAddReview}
                whatsappNumber={landingSettings?.whatsappNumber || '628123456789'}
              />
            )}

            {/* Negotiation Form Modal */}
            {activeNegotiateProduct && (
              <NegotiationModal
                product={activeNegotiateProduct}
                onClose={() => setActiveNegotiateProduct(null)}
                onSubmitNegotiation={handleCreateNegotiation}
                whatsappNumber={landingSettings?.whatsappNumber || '628123456789'}
              />
            )}

            {/* Wishlist Drawer */}
            {isWishlistOpen && (
              <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlistItems={wishlistItems}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onViewDetails={(prod) => {
                  setIsWishlistOpen(false);
                  setActiveDetailProduct(prod);
                }}
              />
            )}

            {/* Admin Management Panel Overlay */}
            {isAdminOpen && (
              <AdminDashboard
                products={products}
                negotiations={negotiations}
                onAddProduct={handleAdminAddProduct}
                onUpdateProduct={handleAdminUpdateProduct}
                onDeleteProduct={handleAdminDeleteProduct}
                onUpdateNegotiationStatus={handleAdminUpdateNegotiationStatus}
                onApproveReview={handleAdminApproveReview}
                onDeleteReview={handleAdminDeleteReview}
                onClose={() => setIsAdminOpen(false)}
                visitorCount={visitorCount}
                projects={projects}
                onAddProject={handleAdminAddProject}
                onUpdateProject={handleAdminUpdateProject}
                onDeleteProject={handleAdminDeleteProject}
                landingSettings={landingSettings}
                onUpdateLandingSettings={handleUpdateLandingSettings}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
