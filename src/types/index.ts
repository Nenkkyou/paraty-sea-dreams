/**
 * Tipos do Sistema ParatyBoat
 * ===========================
 * Definições de tipos para todas as entidades do sistema
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// TIPOS BASE
// ============================================

export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ============================================
// SOLICITAÇÕES (Contact Requests)
// ============================================

export type SolicitationType = 'reservation' | 'inquiry' | 'cancellation' | 'feedback' | 'other';
export type SolicitationStatus = 'pending' | 'responded' | 'confirmed' | 'cancelled' | 'archived';

export interface Solicitation extends BaseDocument {
  // Dados do cliente
  name: string;
  email: string;
  phone: string;
  
  // Detalhes da solicitação
  subject: string;
  message: string;
  type: SolicitationType;
  status: SolicitationStatus;
  
  // Preferências
  route?: string | null;
  guests?: number | null;
  preferredDate?: string | null;
  
  // Metadados
  starred: boolean;
  readAt?: Timestamp | null;
  respondedAt?: Timestamp | null;
  respondedBy?: string | null;
  response?: string | null;
  
  // Rastreamento
  source: 'website' | 'whatsapp' | 'phone' | 'email' | 'other';
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface SolicitationStats {
  total: number;
  pending: number;
  responded: number;
  confirmed: number;
  cancelled: number;
  starred: number;
}

// ============================================
// RESERVAS (Reservations)
// ============================================

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface Reservation extends BaseDocument {
  // Referência ao cliente
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  
  // Detalhes do passeio
  routeId: string;
  routeName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // em horas
  
  // Participantes
  guests: number;
  guestDetails?: GuestDetail[];
  
  // Financeiro
  price: number;
  discount?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'transfer';
  paidAmount: number;
  
  // Status
  status: ReservationStatus;
  
  // Observações
  notes?: string;
  internalNotes?: string;
  
  // Confirmações
  confirmedAt?: Timestamp | null;
  confirmedBy?: string | null;
  cancelledAt?: Timestamp | null;
  cancelledBy?: string | null;
  cancellationReason?: string | null;
  
  // Origem
  solicitationId?: string | null;
  source: 'website' | 'whatsapp' | 'phone' | 'admin' | 'other';
}

export interface GuestDetail {
  name: string;
  age?: number;
  isChild?: boolean;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalRevenue: number;
  monthRevenue: number;
}

// ============================================
// CLIENTES (Clients)
// ============================================

export type ClientType = 'regular' | 'vip' | 'corporate';

export interface Client extends BaseDocument {
  // Dados pessoais
  name: string;
  email: string;
  phone: string;
  document?: string; // CPF/CNPJ
  
  // Endereço
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  
  // Classificação
  type: ClientType;
  tags?: string[];
  
  // Métricas
  totalTrips: number;
  totalSpent: number;
  lastTripDate?: Timestamp | null;
  favoriteRoute?: string | null;
  
  // Marketing
  acceptsMarketing: boolean;
  referredBy?: string | null;
  referralCode?: string;
  
  // Observações
  notes?: string;
  
  // Origem
  source: 'website' | 'whatsapp' | 'phone' | 'referral' | 'other';
}

export interface ClientStats {
  total: number;
  vip: number;
  regular: number;
  corporate: number;
  newThisMonth: number;
  totalTrips: number;
  totalRevenue: number;
  averageSpent: number;
}

// ============================================
// ROTEIROS (Routes)
// ============================================

export interface Route extends BaseDocument {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  
  // Detalhes
  duration: number; // em horas
  difficulty: 'easy' | 'medium' | 'hard';
  capacity: number;
  
  // Preços
  price: number;
  childPrice?: number;
  groupDiscount?: number; // percentual
  
  // Mídia
  images: string[];
  thumbnailUrl?: string;
  
  // Localização
  departure: string;
  destinations: string[];
  
  // Recursos
  includes: string[];
  notIncludes?: string[];
  recommendations?: string[];
  
  // Disponibilidade
  isActive: boolean;
  availableDays?: number[]; // 0-6 (domingo a sábado)
  seasonStart?: string; // MM-DD
  seasonEnd?: string; // MM-DD
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Ordenação
  order: number;
  featured: boolean;
}

// ============================================
// CONFIGURAÇÕES (Settings)
// ============================================

export interface SystemSettings extends BaseDocument {
  // Empresa
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyWhatsapp: string;
  companyAddress: string;
  
  // Operação
  operatingHours: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  operatingDays: number[]; // 0-6
  
  // Notificações
  notifyOnNewSolicitation: boolean;
  notifyOnNewReservation: boolean;
  notifyOnCancellation: boolean;
  notificationEmails: string[];
  
  // Pagamentos
  acceptedPaymentMethods: string[];
  pixKey?: string;
  bankDetails?: {
    bank: string;
    agency: string;
    account: string;
    holder: string;
  };
  
  // Políticas
  cancellationPolicy: string;
  privacyPolicy?: string;
  termsOfService?: string;
  
  // Integrações
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  
  // Manutenção
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

// ============================================
// LOGS E ATIVIDADES
// ============================================

export interface ActivityLog extends BaseDocument {
  userId: string;
  userEmail: string;
  action: string;
  entityType: 'solicitation' | 'reservation' | 'client' | 'route' | 'settings';
  entityId: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

// ============================================
// DASHBOARD
// ============================================

export interface DashboardStats {
  solicitations: SolicitationStats;
  reservations: ReservationStats;
  clients: ClientStats;
  recentActivity: ActivityLog[];
  popularRoutes: {
    routeId: string;
    routeName: string;
    bookings: number;
    revenue: number;
  }[];
}
