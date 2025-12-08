/**
 * useDashboard Hook
 * =================
 * Hook React para carregar dados agregados do dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '@/types';
import { getDashboardStats, StatCard, formatDashboardCards } from '@/services/dashboardService';

interface UseDashboardOptions {
  autoLoad?: boolean;
  refreshInterval?: number; // em ms, 0 para desabilitar
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const { autoLoad = true, refreshInterval = 0 } = options;
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cards, setCards] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Timeout de 10 segundos para evitar loading infinito
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao carregar dados')), 10000)
      );
      
      const dashboardStats = await Promise.race([
        getDashboardStats(),
        timeoutPromise
      ]);
      
      setStats(dashboardStats);
      setCards(formatDashboardCards(dashboardStats));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar dashboard'));
      console.error('Erro ao carregar dashboard:', err);
      // Definir stats vazios para mostrar o conteúdo mesmo com erro
      setStats({
        solicitations: { total: 0, pending: 0, responded: 0, confirmed: 0, cancelled: 0, starred: 0 },
        reservations: { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0, monthCount: 0, monthRevenue: 0, totalRevenue: 0, todayCount: 0, weekCount: 0 },
        clients: { total: 0, vip: 0, regular: 0, newThisMonth: 0, corporate: 0, totalTrips: 0, totalRevenue: 0, averageSpent: 0 },
        recentActivity: [],
        popularRoutes: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto load
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const interval = setInterval(loadData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval, loadData]);

  return {
    stats,
    cards,
    loading,
    error,
    lastUpdated,
    refresh: loadData,
  };
}
