/**
 * Dashboard Service
 * =================
 * Serviço para agregar dados do dashboard
 */

import { getSolicitationStats } from './solicitationService';
import { getReservationStats } from './reservationService';
import { getClientStats } from './clientService';
import { DashboardStats, ActivityLog } from '@/types';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ACTIVITY_COLLECTION = 'activity_logs';

/**
 * Obter estatísticas completas do dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [solicitations, reservations, clients, recentActivity] = await Promise.all([
    getSolicitationStats(),
    getReservationStats(),
    getClientStats(),
    getRecentActivity(10),
  ]);

  // Por enquanto, popular routes vem vazio - implementar quando houver dados suficientes
  const popularRoutes: DashboardStats['popularRoutes'] = [];

  return {
    solicitations,
    reservations,
    clients,
    recentActivity,
    popularRoutes,
  };
}

/**
 * Obter atividades recentes
 */
export async function getRecentActivity(maxResults: number = 10): Promise<ActivityLog[]> {
  try {
    const collectionRef = collection(db, ACTIVITY_COLLECTION);
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(maxResults));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ActivityLog));
  } catch (error) {
    console.warn('Erro ao buscar atividades:', error);
    return [];
  }
}

/**
 * Registrar nova atividade
 */
export async function logActivity(data: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, ACTIVITY_COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Helper para formatar estatísticas em cards
 */
export interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  description?: string;
}

export function formatDashboardCards(stats: DashboardStats): StatCard[] {
  return [
    {
      title: 'Total de Solicitações',
      value: stats.solicitations.total,
      description: `${stats.solicitations.pending} pendentes`,
      icon: 'inbox',
    },
    {
      title: 'Reservas do Mês',
      value: stats.reservations.monthCount,
      description: `${stats.reservations.confirmed} confirmadas`,
      icon: 'calendar',
    },
    {
      title: 'Clientes Cadastrados',
      value: stats.clients.total,
      description: `${stats.clients.vip} VIP`,
      icon: 'users',
    },
    {
      title: 'Receita do Mês',
      value: formatCurrency(stats.reservations.monthRevenue),
      description: 'Pagamentos recebidos',
      icon: 'dollar-sign',
    },
  ];
}

/**
 * Formatar valor como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Calcular métricas de crescimento (comparação com período anterior)
 */
export interface GrowthMetrics {
  solicitationsGrowth: number;
  reservationsGrowth: number;
  clientsGrowth: number;
  revenueGrowth: number;
}

// Placeholder para implementação futura com dados históricos
export async function calculateGrowthMetrics(): Promise<GrowthMetrics> {
  // TODO: Implementar quando houver dados suficientes para comparação
  return {
    solicitationsGrowth: 0,
    reservationsGrowth: 0,
    clientsGrowth: 0,
    revenueGrowth: 0,
  };
}
