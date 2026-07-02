import { Product, Project, Negotiation, LandingSettings } from './types';

export const DEFAULT_LANDING_SETTINGS: LandingSettings = {
  heroTitle: 'Architectural Serenity for Modern Living',
  heroSubtitle: 'Where luxury meets restraint. Experience custom-crafted furniture pieces built with material honesty, timeless aesthetics, and premium wood accents.',
  heroBadge: 'Curated Modern Classic Design',
  whatsappNumber: '628123456789',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  showroomAddress: 'Kawasan Seni & Desain Atelier, Blok C No. 15 Kebayoran Baru, Jakarta Selatan, 12130',
  operationalHours: 'Senin – Jumat: 10.00 – 18.00 WIB\nSabtu: Khusus Janji Temu (By Appointment)',
  emailContact: 'concierge@dinarfurniture.com',
  phoneContact: '+62 812-3456-789',
  googleMapsUrl: 'https://maps.google.com',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNPPVdHft1gbq7GcKVNGUm3-59uHzJU0XKQ5YtPUHIbyY8edsqDS0E4LNZ99wCIPRZaNRb50mg11_LitTEtBfwPEA71l34hBSOlbx36zT79u7qiKnBGebJg3F71UbCpsl6AetPt_7-DIwY-UBTFog-e9ghEBDkMUf77nAGTCb7dSl3FwjmebpgCFsjPxqwfbDg7CXle2YdcqkdHtrZlsQqJYtjBCuubKrcZcfY4Xg_ptq0b_CWIzYlDwIw6QeTxswgDl8eZkHdatg',
  googleMapsIframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126914.8872922116!2d110.61203405786131!3d-6.585818967926296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e711faf6f6ebef7%3A0x6b4efd8c04ec54cf!2sJepara%2C%20Jepara%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid',
  logoImage: '',
  showroomName: 'Dinar Furniture Showroom Jepara'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'The Aurelius Lounge',
    category: 'living',
    description: 'A masterpiece of understatement. Designed to anchor your living spaces with high comfort, featuring solid walnut sideboards and warm boucle fabric accented with gold lining.',
    price: 18500000, // IDR 18.5M
    stock: 5,
    rating: 4.9,
    soldCount: 12,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMJt80tq1le-qfi6aGaNVm6UjHwkJSe6EVu3eo2J3wxNKfj9wtIz0BRag8Mw7wscpAtIDm7fTOuLzKm9Q0Cpu24zqIlFqjwka0ezGU_7GyNb4lDk928RcW0petAVT2SjS0FCgcypPyEcP9I3LPgQgFEwWB7L0lzFBJJPtffkPEDFbU0kx7kp1e9CdU5cK9qHQVxOC0LOi4Qu-OFKsldt_wl7_NA5AUXvumOnhHdK6I1-qHzN9UUTYVOttA6VD0lAkbiMM7ym839qA8',
    isBestSeller: true,
    reviews: [
      {
        id: 'rev-1',
        author: 'Elena Rossi',
        rating: 5,
        comment: 'Absolutely stunning quality! The material honesty is fully felt. Solid walnut frame and incredible finish.',
        date: '2026-06-15',
        approved: true
      },
      {
        id: 'rev-2',
        author: 'Hendra Wijaya',
        rating: 4.8,
        comment: 'Sangat nyaman dan berkelas. Pengiriman rapi dan cepat.',
        date: '2026-06-20',
        approved: true
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Vesper Dining Chair',
    category: 'seating',
    description: 'An elegant dining chair showcasing natural timber grain, a masterfully hand-woven rattan seat, and beautiful solid brass joints that add a classic accent.',
    price: 3200000, // IDR 3.2M
    stock: 8,
    rating: 4.8,
    soldCount: 34,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeTyiFPqCZZVKMvYw9lljkA2GJ3pQT0v8YWSTeXfLos0wJQnDX2tQIWY7wvn8rxw6GrvXxhvqiXX3T1DO3BtPyRY7KZA9GKCvfxJSp3-PC3XmcIO8ydBla2w2MAHFnm7jxH9wW1mEG39TLlEMca0pifrkliBAbddyTf_OpF-8fmTvXWavTbn_IUAjEGi9NMstT8BDATX2xOWaEDxkxQfXNdsw9VvaeV1Fbi-lowxBfzW57QKZT3qkB36nl-hfGbxwsvjD373yIsVkY',
    isBestSeller: true,
    reviews: [
      {
        id: 'rev-3',
        author: 'Sarah Jenkins',
        rating: 5,
        comment: 'The rattan detail and brass connections look incredibly neat. Perfect match for our oak dining table.',
        date: '2026-05-10',
        approved: true
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Monolith Bed Frame',
    category: 'bedroom',
    description: 'A luxurious custom-tailored bed frame wrapped in rich natural cotton with tufted details, framed by a hand-sanded premium teakwood frame.',
    price: 15400000, // IDR 15.4M
    stock: 2,
    rating: 5.0,
    soldCount: 6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEROWbnvIrIYws8r_RmrwuaEWZoDSXqmwXd7IgOa9Nad38p2Z2LorRMyiNl-Af4PbI5BarbWD-1Zg1c7YGM97wmc9rSNRjze8XeR4-rfnPvKPee1mtLYUjMp9xoAunJXg3uhaJ_BL0G30klhM0mf8bp4Jk_IUCTn0LDKYtNohUqVssGcKdl4jU1K_O9xoqq363gW154AJTCYjDPsALxjpCdsdYAux1TJiWq7jiEjJng55sb8nA6vSQcpv135BLhLg7bXGhDwR-ZgZt',
    reviews: []
  },
  {
    id: 'prod-4',
    name: 'Koto Dining Table',
    category: 'tables',
    description: 'Architectural serenity realized. A stunning inlaid dining table made of premium solid rosewood with intricate golden inlay details designed to host premium dining experiences.',
    price: 24500000, // IDR 24.5M
    stock: 3,
    rating: 4.7,
    soldCount: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEqvPvkRF71MVKd8JVWLZAHVD8ecTSt-LQ84piM_DjXqY7ij4o37wkfcfeWHOPvAiXDqZNSyxkzO2HhZZVaCLorNxCGd_X4qhLfxOIIYH23FUZxe4gG8pk69h82jV4RDXHvvyJJYi_YnJixCMxQZtWMEEkl_6HhCvh2rnXBPSDxZcFwTh9yiFG295dcXhg4STVBcFw3yU9nDVUT0x-rdrOf8vpMlnxa6JVZQfSI39YTQUe3189JzeCm9LVxXlOsNH186JCd3Nj5xkv',
    reviews: []
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'The Kensington Residence',
    category: 'Residential',
    description: 'A serene, minimalist living room featuring luxury walnut and beige sofa setups, bathed in soft, natural morning light. Anchored by a fluted marble coffee table.',
    beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200', // simple empty/dusty room
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSkVgD82u00Zp9k5PJj7DjP70CAhW38eZy7H2YjQ2aU2IY-uvP1gaVYsTtJ3CMQ4xNVcuAsMJ2kEXjBSWd5T_T9h6zRCKuhty7QFdTrMes0wGA-T_gMtDekLIjtr7dvJmcku5wLITLdkY20qgllW5ZzcPMwRq-Pr_3QKO5vsp-69wSWQILcJ-gV9S1qz6uidURLoKxKgVPIonp2a16idTo0K5YIKMX2FVo43YhBMONiUGgFt9-IR2wbMZGu664LEccq9L5ljIi620i'
  },
  {
    id: 'proj-2',
    name: 'Mayfair Classic Townhouse',
    category: 'Dining',
    description: 'An elegant dining room highlighting architectural symmetry, finished in off-white tones with a golden rosewood table and classic boucle chairs.',
    beforeImage: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80&w=1200', // plain room before renovation
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCNPPVdHft1gbq7GcKVNGUm3-59uHzJU0XKQ5YtPUHIbyY8edsqDS0E4LNZ99wCIPRZaNRb50mg11_LitTEtBfwPEA71l34hBSOlbx36zT79u7qiKnBGebJg3F71UbCpsl6AetPt_7-DIwY-UBTFog-e9ghEBDkMUf77nAGTCb7dSl3FwjmebpgCFsjPxqwfbDg7CXle2YdcqkdHtrZlsQqJYtjBCuubKrcZcfY4Xg_ptq0b_CWIzYlDwIw6QeTxswgDl8eZkHdatg'
  }
];

export const INITIAL_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'neg-1',
    productId: 'prod-1',
    productName: 'The Aurelius Lounge',
    clientName: 'Ir. Budi Santoso',
    clientPhone: '08123456789',
    originalPrice: 18500000,
    proposedPrice: 17200000,
    message: 'Saya sangat menyukai desain sofa ini untuk proyek lobby butik saya. Apakah bisa dinegosiasikan jika saya memesan 2 unit?',
    status: 'pending',
    date: '2026-07-01'
  },
  {
    id: 'neg-2',
    productId: 'prod-2',
    productName: 'Vesper Dining Chair',
    clientName: 'Amelia Wijaya (Interior Designer)',
    clientPhone: '081987654321',
    originalPrice: 3200000,
    proposedPrice: 2900000,
    message: 'Halo, saya interior designer dari Jakarta. Mau memesan 8 unit Vesper Dining Chair untuk klien saya. Apakah harganya bisa disesuaikan?',
    status: 'approved',
    date: '2026-06-29'
  }
];

export function getLocalStorageState<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key', key, error);
    return defaultValue;
  }
}

export function setLocalStorageState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key', key, error);
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
