export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'seating' | 'tables' | 'bedroom' | 'living' | 'other';
  description: string;
  price: number;
  stock: number;
  rating: number;
  soldCount: number;
  image: string;
  isBestSeller?: boolean;
  reviews: Review[];
}

export interface Negotiation {
  id: string;
  productId: string;
  productName: string;
  clientName: string;
  clientPhone: string;
  originalPrice: number;
  proposedPrice: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

export interface LandingSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  showroomAddress: string;
  operationalHours: string;
  emailContact: string;
  phoneContact: string;
  googleMapsUrl: string;
  heroImage: string;
  googleMapsIframeUrl?: string;
  logoImage?: string;
  showroomName?: string;
}

