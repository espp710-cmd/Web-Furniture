import React, { useState } from 'react';
import { Product, Negotiation, Review, Project, LandingSettings } from '../types';
import { 
  KeyRound, ShieldCheck, TrendingUp, Sparkles, Plus, Edit, Trash2, 
  Check, X, FileText, BarChart3, Package, FileCheck, Star, RefreshCw,
  Users, Image, Globe, Info, Eye, Sliders, EyeOff, MapPin
} from 'lucide-react';
import { formatCurrency } from '../data';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  products: Product[];
  negotiations: Negotiation[];
  onAddProduct: (product: Omit<Product, 'id' | 'reviews'> & { rating?: number; soldCount?: number }) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateNegotiationStatus: (negotiationId: string, status: 'approved' | 'rejected') => void;
  onApproveReview: (productId: string, reviewId: string) => void;
  onDeleteReview: (productId: string, reviewId: string) => void;
  onClose: () => void;
  // NEW ADDITIONS:
  visitorCount: number;
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  landingSettings: LandingSettings;
  onUpdateLandingSettings: (settings: LandingSettings) => void;
}

export default function AdminDashboard({
  products,
  negotiations,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateNegotiationStatus,
  onApproveReview,
  onDeleteReview,
  onClose,
  // NEW ADDITIONS:
  visitorCount,
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  landingSettings,
  onUpdateLandingSettings
}: AdminDashboardProps) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Navigation tabs: 'stats' | 'products' | 'negotiations' | 'reviews' | 'projects' | 'landing'
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'negotiations' | 'reviews' | 'projects' | 'landing'>('stats');

  // Success Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showSuccess = (msg: string) => {
    setNotification({ message: msg, type: 'success' });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper: Convert File to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
          showSuccess(`Gambar "${file.name}" berhasil diunggah!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD product form states (including dynamic soldCount and rating editing!)
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'living' as Product['category'],
    description: '',
    price: 0,
    stock: 0,
    image: '',
    isBestSeller: false,
    soldCount: 0,
    rating: 5.0
  });

  // CRUD portfolio project form states
  const [isProjEditing, setIsProjEditing] = useState(false);
  const [selectedProjId, setSelectedProjId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    client: '',
    year: '',
    imageBefore: '',
    imageAfter: '',
    description: ''
  });

  // Landing Page customizable settings state
  const [landingFormData, setLandingFormData] = useState<LandingSettings>({ ...landingSettings });

  // Sync landing settings
  React.useEffect(() => {
    setLandingFormData({ ...landingSettings });
  }, [landingSettings]);

  // Handle Admin Authorization
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'dinar123') {
      setIsAuthenticated(true);
      setAuthError('');
      showSuccess('Selamat datang di Atelier Admin Panel!');
    } else {
      setAuthError('PIN salah. Gunakan pin default: dinar123');
    }
  };

  // Preset Premium Furniture Images for quick select
  const PRESET_IMAGES = [
    { name: 'Aurelius Lounge (Sofa)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMJt80tq1le-qfi6aGaNVm6UjHwkJSe6EVu3eo2J3wxNKfj9wtIz0BRag8Mw7wscpAtIDm7fTOuLzKm9Q0Cpu24zqIlFqjwka0ezGU_7GyNb4lDk928RcW0petAVT2SjS0FCgcypPyEcP9I3LPgQgFEwWB7L0lzFBJJPtffkPEDFbU0kx7kp1e9CdU5cK9qHQVxOC0LOi4Qu-OFKsldt_wl7_NA5AUXvumOnhHdK6I1-qHzN9UUTYVOttA6VD0lAkbiMM7ym839qA8' },
    { name: 'Vesper (Dining Chair)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeTyiFPqCZZVKMvYw9lljkA2GJ3pQT0v8YWSTeXfLos0wJQnDX2tQIWY7wvn8rxw6GrvXxhvqiXX3T1DO3BtPyRY7KZA9GKCvfxJSp3-PC3XmcIO8ydBla2w2MAHFnm7jxH9wW1mEG39TLlEMca0pifrkliBAbddyTf_OpF-8fmTvXWavTbn_IUAjEGi9NMstT8BDATX2xOWaEDxkxQfXNdsw9VvaeV1Fbi-lowxBfzW57QKZT3qkB36nl-hfGbxwsvjD373yIsVkY' },
    { name: 'Monolith Frame (Bed)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEROWbnvIrIYws8r_RmrwuaEWZoDSXqmwXd7IgOa9Nad38p2Z2LorRMyiNl-Af4PbI5BarbWD-1Zg1c7YGM97wmc9rSNRjze8XeR4-rfnPvKPee1mtLYUjMp9xoAunJXg3uhaJ_BL0G30klhM0mf8bp4Jk_IUCTn0LDKYtNohUqVssGcKdl4jU1K_O9xoqq363gW154AJTCYjDPsALxjpCdsdYAux1TJiWq7jiEjJng55sb8nA6vSQcpv135BLhLg7bXGhDwR-ZgZt' },
    { name: 'Koto Dining Table', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqvPvkRF71MVKd8JVWLZAHVD8ecTSt-LQ84piM_DjXqY7ij4o37wkfcfeWHOPvAiXDqZNSyxkzO2HhZZVaCLorNxCGd_X4qhLfxOIIYH23FUZxe4gG8pk69h82jV4RDXHvvyJJYi_YnJixCMxQZtWMEEkl_6HhCvh2rnXBPSDxZcFwTh9yiFG295dcXhg4STVBcFw3yU9nDVUT0x-rdrOf8vpMlnxa6JVZQfSI39YTQUe3189JzeCm9LVxXlOsNH186JCd3Nj5xkv' }
  ];

  // Submit product create / edit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;

    if (isEditing && selectedProductId) {
      const original = products.find(p => p.id === selectedProductId);
      if (original) {
        onUpdateProduct({
          ...original,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: formData.image,
          isBestSeller: formData.isBestSeller,
          soldCount: Number(formData.soldCount || 0),
          rating: Number(formData.rating || 5.0)
        });
        showSuccess(`Produk "${formData.name}" berhasil diperbarui!`);
      }
      setIsEditing(false);
      setSelectedProductId(null);
    } else {
      onAddProduct({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image,
        isBestSeller: formData.isBestSeller,
        soldCount: Number(formData.soldCount || 0),
        rating: Number(formData.rating || 5.0)
      });
      showSuccess(`Produk baru "${formData.name}" berhasil ditambahkan!`);
    }

    // Reset Form
    setFormData({
      name: '',
      category: 'living',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      isBestSeller: false,
      soldCount: 0,
      rating: 5.0
    });
  };

  const startEditProduct = (prod: Product) => {
    setIsEditing(true);
    setSelectedProductId(prod.id);
    setFormData({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
      isBestSeller: prod.isBestSeller,
      soldCount: prod.soldCount,
      rating: prod.rating
    });
  };

  // Submit portfolio project create / edit
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.title || !projectFormData.imageAfter) return;

    if (isProjEditing && selectedProjId) {
      onUpdateProject({
        id: selectedProjId,
        name: projectFormData.title,
        category: projectFormData.client,
        description: projectFormData.description,
        beforeImage: projectFormData.imageBefore,
        afterImage: projectFormData.imageAfter
      });
      showSuccess(`Portofolio "${projectFormData.title}" berhasil diperbarui!`);
      setIsProjEditing(false);
      setSelectedProjId(null);
    } else {
      onAddProject({
        name: projectFormData.title,
        category: projectFormData.client,
        description: projectFormData.description,
        beforeImage: projectFormData.imageBefore,
        afterImage: projectFormData.imageAfter
      });
      showSuccess(`Portofolio baru "${projectFormData.title}" berhasil ditambahkan!`);
    }

    // Reset Form
    setProjectFormData({
      title: '',
      client: '',
      year: '',
      imageBefore: '',
      imageAfter: '',
      description: ''
    });
  };

  const startEditProject = (proj: Project) => {
    setIsProjEditing(true);
    setSelectedProjId(proj.id);
    setProjectFormData({
      title: proj.name,
      client: proj.category,
      year: '',
      imageBefore: proj.beforeImage || '',
      imageAfter: proj.afterImage,
      description: proj.description
    });
  };

  const cancelProjEdit = () => {
    setIsProjEditing(false);
    setSelectedProjId(null);
    setProjectFormData({
      title: '',
      client: '',
      year: '',
      imageBefore: '',
      imageAfter: '',
      description: ''
    });
  };

  // Submit Landing Page customization settings
  const handleLandingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Robustly extract the src url if user pasted a full <iframe ...> tag from Google Maps
    const settingsCopy = { ...landingFormData };
    if (settingsCopy.googleMapsIframeUrl && settingsCopy.googleMapsIframeUrl.trim().startsWith('<iframe')) {
      const match = settingsCopy.googleMapsIframeUrl.match(/src="([^"]+)"/);
      if (match && match[1]) {
        settingsCopy.googleMapsIframeUrl = match[1];
      }
    }
    
    onUpdateLandingSettings(settingsCopy);
    showSuccess("Landing Page & Kontak berhasil diperbarui!");
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedProductId(null);
    setFormData({
      name: '',
      category: 'living',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      isBestSeller: false
    });
  };

  // Get total stats
  const totalSalesCount = products.reduce((acc, curr) => acc + curr.soldCount, 0);
  const estimatedRevenueYTD = products.reduce((acc, curr) => acc + (curr.soldCount * curr.price), 0);
  const pendingNegoCount = negotiations.filter(n => n.status === 'pending').length;

  // Render Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-brand-cream flex items-center justify-center px-4 font-sans text-xs">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-brand-beige p-8 rounded-sm shadow-2xl space-y-6 text-center"
        >
          <div className="mx-auto w-14 h-14 bg-brand-cream flex items-center justify-center rounded-full text-brand-brown border border-brand-gold">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-brand-dark">Atelier Curator Gate</h2>
            <p className="text-brand-dark/50 mt-1">
              Masukkan PIN Admin Dinar untuk masuk ke dashboard manajemen produk dan moderasi ulasan.
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN Admin (Default: dinar123)"
                className="w-full text-center bg-brand-cream border border-brand-beige-dark px-4 py-3 rounded-sm text-sm tracking-[0.2em] font-bold focus:outline-none focus:border-brand-brown focus:ring-0 text-brand-dark"
              />
            </div>

            {authError && (
              <p className="text-red-600 font-semibold">{authError}</p>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold py-3 uppercase tracking-wider rounded-sm transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 bg-brand-brown hover:bg-brand-dark text-white font-bold py-3 uppercase tracking-wider rounded-sm transition-all shadow-sm"
              >
                Masuk
              </button>
            </div>
          </form>

          <div className="text-[10px] text-brand-brown/60">
            Dinar Furniture Management System • v1.0
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-brand-cream font-sans flex flex-col select-none">
      {/* Floating success banner */}
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-brand-brown border-2 border-brand-gold/60 text-brand-beige px-6 py-3.5 rounded-sm shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="h-20 border-b border-brand-beige bg-white flex items-center justify-between px-6 md:px-10 z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-brand-brown/10 p-2 rounded-sm text-brand-brown">
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-brand-dark leading-none">Dinar. Curator Panel</h1>
            <span className="text-[10px] tracking-wider text-brand-brown uppercase font-semibold">Workspace</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="font-sans text-xs font-bold uppercase tracking-wider text-brand-dark hover:text-brand-brown border border-brand-beige-dark px-4 py-2 bg-brand-cream transition-colors rounded-sm"
        >
          Tutup Dashboard
        </button>
      </header>

      {/* Main Container: Sidebar + Panel Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-brand-beige bg-white flex flex-col hidden md:flex flex-shrink-0">
          <nav className="flex-1 p-4 flex flex-col gap-2 font-sans text-xs uppercase tracking-wider font-bold">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-colors text-left ${
                activeTab === 'stats' 
                  ? 'bg-brand-cream text-brand-brown border-l-2 border-brand-gold' 
                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-colors text-left ${
                activeTab === 'products' 
                  ? 'bg-brand-cream text-brand-brown border-l-2 border-brand-gold' 
                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>CRUD Katalog Produk</span>
            </button>

            <button
              onClick={() => setActiveTab('negotiations')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-colors text-left ${
                activeTab === 'negotiations' 
                  ? 'bg-brand-cream text-brand-brown border-l-2 border-brand-gold' 
                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Negosiasi WhatsApp</span>
              {pendingNegoCount > 0 && (
                <span className="ml-auto bg-brand-gold text-brand-dark rounded-full px-1.5 py-0.5 text-[9px]">
                  {pendingNegoCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-colors text-left ${
                activeTab === 'reviews' 
                  ? 'bg-brand-cream text-brand-brown border-l-2 border-brand-gold' 
                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Moderasi Ulasan</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-colors text-left ${
                activeTab === 'projects' 
                  ? 'bg-brand-cream text-brand-brown border-l-2 border-brand-gold' 
                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>CRUD Portofolio</span>
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-sm transition-colors text-left ${
                activeTab === 'landing' 
                  ? 'bg-brand-cream text-brand-brown border-l-2 border-brand-gold' 
                  : 'text-brand-dark/70 hover:bg-brand-cream/50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Landing & Settings</span>
            </button>
          </nav>
        </aside>

        {/* Panel View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-brand-cream/20">
          
          {/* Mobile Tab Quick Nav */}
          <div className="flex md:hidden bg-white border border-brand-beige p-1 rounded-sm gap-1 font-sans text-[10px] font-bold uppercase tracking-wider overflow-x-auto mb-4">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-shrink-0 px-3 py-2 rounded-sm ${activeTab === 'stats' ? 'bg-brand-brown text-white' : 'text-brand-dark'}`}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-shrink-0 px-3 py-2 rounded-sm ${activeTab === 'products' ? 'bg-brand-brown text-white' : 'text-brand-dark'}`}
            >
              Katalog
            </button>
            <button
              onClick={() => setActiveTab('negotiations')}
              className={`flex-shrink-0 px-3 py-2 rounded-sm ${activeTab === 'negotiations' ? 'bg-brand-brown text-white' : 'text-brand-dark'}`}
            >
              Negosiasi
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-shrink-0 px-3 py-2 rounded-sm ${activeTab === 'reviews' ? 'bg-brand-brown text-white' : 'text-brand-dark'}`}
            >
              Review
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-shrink-0 px-3 py-2 rounded-sm ${activeTab === 'projects' ? 'bg-brand-brown text-white' : 'text-brand-dark'}`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex-shrink-0 px-3 py-2 rounded-sm ${activeTab === 'landing' ? 'bg-brand-brown text-white' : 'text-brand-dark'}`}
            >
              Settings
            </button>
          </div>

          {/* TAB 1: OVERVIEW STATISTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* Header metadata */}
              <div>
                <h2 className="font-serif text-2xl text-brand-dark">Dashboard Overview</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Metrik performa penjualan katalog real-time.</p>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-sans text-xs">
                <div className="bg-white border border-brand-beige p-6 rounded-sm relative overflow-hidden group">
                  <span className="text-brand-dark/40 font-bold uppercase tracking-wider block mb-2">Total Unit Terjual</span>
                  <div className="text-3xl font-serif font-bold text-brand-dark">{totalSalesCount} Unit</div>
                  <p className="text-green-600 mt-2 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +12.5% vs minggu lalu
                  </p>
                </div>

                <div className="bg-white border border-brand-beige p-6 rounded-sm relative overflow-hidden group">
                  <span className="text-brand-dark/40 font-bold uppercase tracking-wider block mb-2">Estimasi Omzet</span>
                  <div className="text-3xl font-serif font-bold text-brand-brown">{formatCurrency(estimatedRevenueYTD)}</div>
                  <p className="text-brand-dark/40 mt-2">Dihitung dari kumulatif unit terjual</p>
                </div>

                <div className="bg-white border border-brand-beige p-6 rounded-sm relative overflow-hidden group">
                  <span className="text-brand-dark/40 font-bold uppercase tracking-wider block mb-2">Negosiasi WhatsApp Aktif</span>
                  <div className="text-3xl font-serif font-bold text-brand-dark">{negotiations.length} Pengajuan</div>
                  <p className="text-brand-gold font-semibold mt-2">{pendingNegoCount} Menunggu Keputusan</p>
                </div>

                <div className="bg-brand-dark border border-brand-gold/20 p-6 rounded-sm relative overflow-hidden group text-brand-beige">
                  <span className="text-brand-gold font-bold uppercase tracking-wider block mb-2">Statistik Pengunjung</span>
                  <div className="text-3xl font-serif font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-gold animate-pulse" />
                    <span>{visitorCount} Orang</span>
                  </div>
                  <p className="text-[10px] text-brand-beige/50 mt-2">Total pengunjung unik terakumulasi</p>
                </div>
              </div>

              {/* Premium Interactive Bar Chart with SVG */}
              <div className="bg-white border border-brand-beige p-6 md:p-8 rounded-sm">
                <h3 className="font-serif text-lg text-brand-dark mb-6">Performa Produk Terlaris</h3>
                
                <div className="space-y-4">
                  {products.map((prod) => {
                    const maxSold = Math.max(...products.map(p => p.soldCount), 1);
                    const percent = (prod.soldCount / maxSold) * 100;
                    
                    return (
                      <div key={prod.id} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-sans">
                          <span className="font-semibold text-brand-dark">{prod.name}</span>
                          <span className="text-brand-brown font-bold">{prod.soldCount} Unit Terjual</span>
                        </div>
                        <div className="w-full bg-brand-cream h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="bg-brand-brown h-full rounded-full border-r border-brand-gold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRUD KATALOG PRODUK */}
          {activeTab === 'products' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-2xl text-brand-dark">Manajemen Katalog Produk</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Tambah, edit, atau hapus item katalog furnitur modern klasik.</p>
              </div>

              {/* Flex Grid: Left CRUD Form, Right Products Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Product form panel */}
                <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-brand-beige space-y-4">
                  <h3 className="font-serif text-lg text-brand-dark">
                    {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </h3>

                  <form onSubmit={handleProductSubmit} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Nama Produk</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                        placeholder="Contoh: Aurelius Sofa"
                      />
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                      >
                        <option value="living">Living Room</option>
                        <option value="seating">Seating</option>
                        <option value="tables">Tables</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="other">Other Accessories</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Harga (IDR)</label>
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="18500000"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Stok Unit</label>
                        <input
                          type="number"
                          required
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Unit Terjual (CRUD Terjual)</label>
                        <input
                          type="number"
                          required
                          value={formData.soldCount}
                          onChange={(e) => setFormData({ ...formData, soldCount: Number(e.target.value) })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: 12"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Rating Bintang (1 - 5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          required
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: 4.8"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Gambar URL / Unggah Foto Produk</label>
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm mb-2"
                        placeholder="Masukkan image link..."
                      />
                      
                      {/* Local File Selector */}
                      <div className="bg-brand-cream/80 p-3.5 border border-dashed border-brand-beige-dark rounded-sm flex flex-col gap-1.5 hover:bg-brand-cream transition-colors">
                        <span className="text-[10px] text-brand-brown font-bold uppercase block">Unggah File Gambar Lokal (Base64):</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (base64) => setFormData({ ...formData, image: base64 }))}
                          className="text-[10px] text-brand-dark cursor-pointer block w-full file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[10px] file:font-semibold file:bg-brand-brown file:text-white hover:file:bg-brand-dark transition-colors"
                        />
                        {formData.image && formData.image.startsWith('data:image') && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] text-green-700 font-semibold">Berhasil memuat file gambar lokal!</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Presets shortcut */}
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] text-brand-dark/40 font-bold uppercase">Pilih Preset Gambar:</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {PRESET_IMAGES.map((preset, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: preset.url })}
                              className="bg-brand-cream border border-brand-beige-dark hover:border-brand-brown px-2 py-1 text-[9px] rounded-sm transition-colors text-brand-dark"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Deskripsi Produk</label>
                      <textarea
                        rows={3}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm resize-none"
                        placeholder="Deskripsi pengerjaan, material, dll..."
                      />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                        className="rounded-sm border-brand-beige-dark text-brand-brown focus:ring-brand-brown"
                      />
                      <label htmlFor="isBestSeller" className="text-brand-dark font-semibold">Tandai sebagai "Best Seller"</label>
                    </div>

                    <div className="flex gap-2">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold py-2 rounded-sm uppercase tracking-wider transition-colors"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-brand-brown hover:bg-brand-dark text-white font-bold py-2.5 rounded-sm uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-brand-gold" />
                        <span>{isEditing ? 'Simpan' : 'Tambah'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Products Table */}
                <div className="lg:col-span-8 bg-white border border-brand-beige rounded-sm overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead className="bg-brand-cream border-b border-brand-beige text-brand-dark/50 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Produk</th>
                          <th className="p-4">Kategori</th>
                          <th className="p-4">Harga</th>
                          <th className="p-4">Stok</th>
                          <th className="p-4">Terjual</th>
                          <th className="p-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-beige/50 text-brand-dark">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-brand-cream/30 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-sm overflow-hidden border border-brand-beige flex-shrink-0">
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-bold text-sm block">{prod.name}</span>
                                {prod.isBestSeller && (
                                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-brand-dark px-1.5 py-0.5 rounded-sm mt-0.5 inline-block">Best Seller</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 capitalize">{prod.category}</td>
                            <td className="p-4 font-bold text-brand-brown">{formatCurrency(prod.price)}</td>
                            <td className="p-4">
                              <span className={`font-bold px-2 py-1 rounded-sm ${prod.stock <= 3 ? 'bg-red-50 text-red-600' : 'bg-brand-cream text-brand-dark'}`}>
                                {prod.stock}
                              </span>
                            </td>
                            <td className="p-4">{prod.soldCount}</td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => startEditProduct(prod)}
                                  className="p-2 text-brand-brown hover:bg-brand-cream rounded-sm"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if(confirm(`Yakin ingin menghapus ${prod.name}?`)) {
                                      onDeleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-sm"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: NEGOTIATIONS WA DATA */}
          {activeTab === 'negotiations' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl text-brand-dark">Negosiasi & Pesanan WhatsApp</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Ulas pengajuan potongan harga dari calon pelanggan Anda.</p>
              </div>

              {negotiations.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-sm border border-brand-beige">
                  <FileText className="w-12 h-12 text-brand-dark/20 mx-auto mb-4" />
                  <h4 className="font-serif text-base text-brand-dark">Belum ada data negosiasi</h4>
                  <p className="text-xs text-brand-dark/50 mt-1">Negosiasi yang diajukan oleh user akan terekam otomatis di sini.</p>
                </div>
              ) : (
                <div className="bg-white border border-brand-beige rounded-sm overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead className="bg-brand-cream border-b border-brand-beige text-brand-dark/50 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Pelanggan</th>
                          <th className="p-4">Produk</th>
                          <th className="p-4">Harga Katalog</th>
                          <th className="p-4">Penawaran</th>
                          <th className="p-4">Catatan</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Moderasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-beige/50 text-brand-dark">
                        {negotiations.map((nego) => (
                          <tr key={nego.id} className="hover:bg-brand-cream/30 transition-colors">
                            <td className="p-4">
                              <span className="font-bold text-sm block">{nego.clientName}</span>
                              <span className="text-brand-dark/40 text-[10px]">{nego.clientPhone}</span>
                            </td>
                            <td className="p-4 font-semibold">{nego.productName}</td>
                            <td className="p-4">{formatCurrency(nego.originalPrice)}</td>
                            <td className="p-4 font-bold text-brand-brown">
                              {formatCurrency(nego.proposedPrice)}
                              <span className="text-[10px] text-brand-dark/40 block">
                                (Potongan {Math.round(((nego.originalPrice - nego.proposedPrice) / nego.originalPrice) * 100)}%)
                              </span>
                            </td>
                            <td className="p-4 italic text-brand-dark/70 max-w-xs truncate" title={nego.message}>
                              "{nego.message}"
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                                nego.status === 'approved' 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : nego.status === 'rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-brand-gold/20 text-brand-brown border border-brand-gold/40'
                              }`}>
                                {nego.status === 'approved' ? 'Disetujui' : nego.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {nego.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => onUpdateNegotiationStatus(nego.id, 'approved')}
                                    className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-sm"
                                    title="Setujui"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onUpdateNegotiationStatus(nego.id, 'rejected')}
                                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-sm"
                                    title="Tolak"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-brand-dark/30 italic">Sudah dimoderasi</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl text-brand-dark">Moderasi Ulasan Pelanggan</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Mencegah AI slop atau ulasan sampah demi kredibilitas brand Anda.</p>
              </div>

              {/* Accumulate all reviews with productId for ease of listing */}
              {(() => {
                const allReviews: { productId: string; prodName: string; review: Review }[] = [];
                products.forEach(p => {
                  p.reviews.forEach(r => {
                    allReviews.push({ productId: p.id, prodName: p.name, review: r });
                  });
                });

                if (allReviews.length === 0) {
                  return (
                    <div className="text-center p-12 bg-white rounded-sm border border-brand-beige">
                      <Star className="w-12 h-12 text-brand-dark/20 mx-auto mb-4" />
                      <h4 className="font-serif text-base text-brand-dark">Belum ada review masuk</h4>
                      <p className="text-xs text-brand-dark/50 mt-1">Ulasan dari pelanggan akan langsung terdaftar di sini.</p>
                    </div>
                  );
                }

                return (
                  <div className="bg-white border border-brand-beige rounded-sm overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-sans text-xs">
                        <thead className="bg-brand-cream border-b border-brand-beige text-brand-dark/50 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-4">Pengirim</th>
                            <th className="p-4">Produk</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Ulasan</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-beige/50 text-brand-dark">
                          {allReviews.map(({ productId, prodName, review }) => (
                            <tr key={review.id} className="hover:bg-brand-cream/30 transition-colors">
                              <td className="p-4">
                                <span className="font-bold block">{review.author}</span>
                                <span className="text-brand-dark/40 text-[10px]">{review.date}</span>
                              </td>
                              <td className="p-4 font-semibold">{prodName}</td>
                              <td className="p-4">
                                <div className="flex items-center text-brand-gold gap-0.5">
                                  {Array.from({ length: review.rating }).map((_, idx) => (
                                    <Star key={idx} className="w-3.5 h-3.5 fill-brand-gold" />
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 italic max-w-xs truncate" title={review.comment}>
                                "{review.comment}"
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase ${
                                  review.approved 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {review.approved ? 'Terbit' : 'Menunggu'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {!review.approved && (
                                    <button
                                      onClick={() => onApproveReview(productId, review.id)}
                                      className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-sm"
                                      title="Setujui & Terbitkan"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      if(confirm('Yakin ingin menghapus ulasan ini?')) {
                                        onDeleteReview(productId, review.id);
                                      }
                                    }}
                                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-sm"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: PORTFOLIO CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-2xl text-brand-dark">Manajemen Portofolio Proyek</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Kelola galeri transformasi Before & After proyek pengerjaan interior Anda.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Project form panel */}
                <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-brand-beige space-y-4">
                  <h3 className="font-serif text-lg text-brand-dark">
                    {isProjEditing ? 'Edit Portofolio Proyek' : 'Tambah Proyek Baru'}
                  </h3>

                  <form onSubmit={handleProjectSubmit} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Nama Proyek / Judul</label>
                      <input
                        type="text"
                        required
                        value={projectFormData.title}
                        onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                        placeholder="Contoh: Klasik Minimalis Cafe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Nama Klien / Pemesan</label>
                        <input
                          type="text"
                          required
                          value={projectFormData.client}
                          onChange={(e) => setProjectFormData({ ...projectFormData, client: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: PT Kuliner Nusantara"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Tahun Penyelesaian</label>
                        <input
                          type="text"
                          required
                          value={projectFormData.year}
                          onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: 2026"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Gambar Sebelum / Desain Render (URL)</label>
                      <input
                        type="text"
                        value={projectFormData.imageBefore}
                        onChange={(e) => setProjectFormData({ ...projectFormData, imageBefore: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm mb-1"
                        placeholder="Link Gambar Sebelum..."
                      />
                      
                      {/* Local File Selector for Before */}
                      <div className="bg-brand-cream/80 p-2.5 border border-dashed border-brand-beige-dark rounded-sm flex flex-col gap-1 hover:bg-brand-cream transition-colors">
                        <span className="text-[9px] text-brand-brown font-bold uppercase block">Atau Unggah Gambar Sebelum (Base64):</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (base64) => setProjectFormData({ ...projectFormData, imageBefore: base64 }))}
                          className="text-[9px] text-brand-dark cursor-pointer block w-full file:mr-2 file:py-0.5 file:px-1.5 file:rounded-sm file:border-0 file:text-[9px] file:font-semibold file:bg-brand-brown file:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Gambar Setelah / Realisasi Jadi (URL)</label>
                      <input
                        type="text"
                        required
                        value={projectFormData.imageAfter}
                        onChange={(e) => setProjectFormData({ ...projectFormData, imageAfter: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm mb-1"
                        placeholder="Link Gambar Setelah..."
                      />
                      
                      {/* Local File Selector for After */}
                      <div className="bg-brand-cream/80 p-2.5 border border-dashed border-brand-beige-dark rounded-sm flex flex-col gap-1 hover:bg-brand-cream transition-colors">
                        <span className="text-[9px] text-brand-brown font-bold uppercase block">Atau Unggah Gambar Setelah (Base64):</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (base64) => setProjectFormData({ ...projectFormData, imageAfter: base64 }))}
                          className="text-[9px] text-brand-dark cursor-pointer block w-full file:mr-2 file:py-0.5 file:px-1.5 file:rounded-sm file:border-0 file:text-[9px] file:font-semibold file:bg-brand-brown file:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Deskripsi Proyek</label>
                      <textarea
                        rows={3}
                        required
                        value={projectFormData.description}
                        onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm resize-none"
                        placeholder="Sebutkan detail furnitur yang dibuat, material kayu yang digunakan, dll..."
                      />
                    </div>

                    <div className="flex gap-2">
                      {isProjEditing && (
                        <button
                          type="button"
                          onClick={cancelProjEdit}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-dark font-bold py-2 rounded-sm uppercase tracking-wider transition-colors"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-brand-brown hover:bg-brand-dark text-white font-bold py-2.5 rounded-sm uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isProjEditing ? 'Simpan Perubahan' : 'Terbitkan Proyek'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Projects list panel */}
                <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-brand-beige">
                  <h3 className="font-serif text-lg text-brand-dark mb-4">Daftar Portofolio Proyek Aktif</h3>

                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-brand-dark/40 font-serif">
                      Tidak ada proyek portofolio ditemukan.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {projects.map((proj) => (
                        <div key={proj.id} className="border border-brand-beige/60 p-4 rounded-sm flex flex-col sm:flex-row gap-4 items-center bg-brand-cream/10 hover:bg-brand-cream/30 transition-colors">
                          <div className="flex gap-2 flex-shrink-0">
                            {proj.beforeImage && (
                              <div className="text-center">
                                <img src={proj.beforeImage} alt="Before" className="w-16 h-12 object-cover rounded-sm border border-brand-beige-dark" />
                                <span className="text-[8px] text-brand-dark/40 uppercase font-bold block mt-0.5">Desain</span>
                              </div>
                            )}
                            <div className="text-center">
                              <img src={proj.afterImage} alt="After" className="w-16 h-12 object-cover rounded-sm border border-brand-beige-dark" />
                              <span className="text-[8px] text-brand-brown uppercase font-bold block mt-0.5">Hasil Jadi</span>
                            </div>
                          </div>

                          <div className="flex-1 text-center sm:text-left min-w-0">
                            <h4 className="font-serif text-sm font-bold text-brand-dark truncate">{proj.name}</h4>
                            <p className="text-[10px] text-brand-brown font-semibold uppercase tracking-wider mt-0.5">{proj.category}</p>
                            <p className="text-[10px] text-brand-dark/60 line-clamp-1 mt-1">{proj.description}</p>
                          </div>

                          <div className="flex sm:flex-col gap-2 flex-shrink-0">
                            <button
                              onClick={() => startEditProject(proj)}
                              className="p-2 text-brand-brown hover:bg-brand-cream rounded-sm border border-brand-beige-dark bg-white"
                              title="Edit Portofolio"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus proyek "${proj.name}" dari portofolio?`)) {
                                  onDeleteProject(proj.id);
                                  showSuccess(`Portofolio "${proj.name}" berhasil dihapus!`);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm border border-red-100 bg-white"
                              title="Hapus Proyek"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LANDING PAGE & SETTINGS CRUD */}
          {activeTab === 'landing' && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-2xl text-brand-dark">Manajemen Landing Page & Kontak</h2>
                <p className="text-xs text-brand-dark/50 mt-1">Ubah identitas visual, kontak WhatsApp, tautan sosial media, dan peta Google Maps dalam satu atap.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Settings Form */}
                <form onSubmit={handleLandingSubmit} className="lg:col-span-12 bg-white p-8 rounded-sm border border-brand-beige space-y-8 font-sans text-xs">
                  
                  {/* Hero Settings Section */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base text-brand-dark border-b border-brand-beige pb-2 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-brand-gold" />
                      <span>1. Tampilan Beranda (Hero Section)</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Badge Kategori Beranda</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.heroBadge}
                          onChange={(e) => setLandingFormData({ ...landingFormData, heroBadge: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="e.g., Dinar Furniture Atelier"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Slogan Judul Utama</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.heroTitle}
                          onChange={(e) => setLandingFormData({ ...landingFormData, heroTitle: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="e.g., Seni Pertukangan Klasik Modern"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Deskripsi Tambahan Beranda</label>
                      <textarea
                        rows={2}
                        required
                        value={landingFormData.heroSubtitle}
                        onChange={(e) => setLandingFormData({ ...landingFormData, heroSubtitle: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm resize-none"
                        placeholder="Deskripsi singkat brand furniture..."
                      />
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Gambar Latar Belakang Hero (URL / File Lokal)</label>
                      <input
                        type="text"
                        required
                        value={landingFormData.heroImage}
                        onChange={(e) => setLandingFormData({ ...landingFormData, heroImage: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm mb-2"
                        placeholder="Link gambar utama beranda..."
                      />

                      {/* File Upload background */}
                      <div className="bg-brand-cream/80 p-3.5 border border-dashed border-brand-beige-dark rounded-sm flex flex-col gap-1.5 hover:bg-brand-cream transition-colors">
                        <span className="text-[10px] text-brand-brown font-bold uppercase block">Unggah Latar Belakang Baru (Base64):</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (base64) => setLandingFormData({ ...landingFormData, heroImage: base64 }))}
                          className="text-[10px] text-brand-dark cursor-pointer block w-full file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[10px] file:font-semibold file:bg-brand-brown file:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Brand Identity (Logo CRUD) */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base text-brand-dark border-b border-brand-beige pb-2 flex items-center gap-2">
                      <Image className="w-4 h-4 text-brand-gold" />
                      <span>2. Logo & Identitas Brand (Logo CRUD)</span>
                    </h3>
                    
                    <div className="bg-brand-cream/40 p-4 border border-brand-beige rounded-sm space-y-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">URL Logo Kustom (Opsional)</label>
                        <input
                          type="text"
                          value={landingFormData.logoImage || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, logoImage: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm mb-2"
                          placeholder="Masukkan tautan link gambar logo Anda..."
                        />
                      </div>
                      
                      <div className="bg-brand-cream/80 p-3.5 border border-dashed border-brand-beige-dark rounded-sm flex flex-col gap-1.5 hover:bg-brand-cream transition-colors">
                        <span className="text-[10px] text-brand-brown font-bold uppercase block">Atau Unggah Logo File Baru (Base64):</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, (base64) => setLandingFormData({ ...landingFormData, logoImage: base64 }))}
                          className="text-[10px] text-brand-dark cursor-pointer block w-full file:mr-2 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[10px] file:font-semibold file:bg-brand-brown file:text-white"
                        />
                      </div>
                      
                      {landingFormData.logoImage && (
                        <div className="flex items-center gap-4 bg-white p-3 border border-brand-beige rounded-sm">
                          <span className="text-xs text-brand-dark/55">Pratinjau Logo Saat Ini:</span>
                          <img src={landingFormData.logoImage} alt="Preview logo" className="h-10 object-contain rounded border bg-brand-cream/30 p-1" />
                          <button
                            type="button"
                            onClick={() => setLandingFormData({ ...landingFormData, logoImage: '' })}
                            className="text-xs text-red-600 hover:underline ml-auto"
                          >
                            Hapus Logo (Gunakan Teks Default)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Details Section */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base text-brand-dark border-b border-brand-beige pb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-brand-gold" />
                      <span>3. Kontak, Media Sosial & Jam Operasional</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Nomor WhatsApp Admin (Link Chat)</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.whatsappNumber}
                          onChange={(e) => setLandingFormData({ ...landingFormData, whatsappNumber: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Format angka tanpa tanda + atau spasi: 6281xxx"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Nomor Telepon Kontak (Teks Tampilan)</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.phoneContact || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, phoneContact: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: +62 812-3456-789"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Alamat Email Kontak Showroom</label>
                        <input
                          type="email"
                          required
                          value={landingFormData.emailContact || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, emailContact: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: info@dinarfurniture.com"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Jam Operasional</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.operationalHours || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, operationalHours: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: Senin - Jumat: 10.00 - 18.00 WIB"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Link Instagram Profile</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.instagramUrl}
                          onChange={(e) => setLandingFormData({ ...landingFormData, instagramUrl: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Link Facebook Page</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.facebookUrl}
                          onChange={(e) => setLandingFormData({ ...landingFormData, facebookUrl: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-brand-dark/70 font-semibold mb-1">Alamat Lengkap Showroom & Workshop</label>
                      <input
                        type="text"
                        required
                        value={landingFormData.showroomAddress}
                        onChange={(e) => setLandingFormData({ ...landingFormData, showroomAddress: e.target.value })}
                        className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                        placeholder="Contoh: Jl. Pemuda No. 45, Jepara, Jawa Tengah"
                      />
                    </div>
                  </div>

                  {/* Google Maps Configuration */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-base text-brand-dark border-b border-brand-beige pb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                      <span>4. Konfigurasi Lokasi & Peta Google Maps</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Nama Showroom (Tampilan Peta)</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.showroomName || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, showroomName: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="Contoh: Dinar Showroom"
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Link Google Maps Standard (Arah Rute)</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.googleMapsUrl || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, googleMapsUrl: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                      <div>
                        <label className="block text-brand-dark/70 font-semibold mb-1">Link Iframe Google Maps Embed (Src Link)</label>
                        <input
                          type="text"
                          required
                          value={landingFormData.googleMapsIframeUrl || ''}
                          onChange={(e) => setLandingFormData({ ...landingFormData, googleMapsIframeUrl: e.target.value })}
                          className="w-full bg-brand-cream border border-brand-beige-dark px-3 py-2 text-brand-dark rounded-sm"
                          placeholder="https://www.google.com/maps/embed?pb=..."
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-dark/40 block">
                      Tips Embed: Dapatkan link embed (src) dari Google Maps Web &gt; Klik Bagikan &gt; Pilih "Sematkan peta" &gt; Salin isi atribut "src" dari tag iframe.
                    </span>
                  </div>

                  <div className="pt-4 border-t border-brand-beige flex justify-end">
                    <button
                      type="submit"
                      className="bg-brand-brown hover:bg-brand-dark text-white font-bold px-8 py-3 rounded-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md"
                    >
                      <Check className="w-4 h-4 text-brand-gold" />
                      <span>Simpan Perubahan Landing Page</span>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
