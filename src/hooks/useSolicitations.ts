/**
 * useSolicitations Hook
 * =====================
 * Hook React para gerenciar solicitações com dados do Firestore
 */

import { useState, useEffect, useCallback } from 'react';
import { Solicitation, SolicitationStats, SolicitationStatus } from '@/types';
import {
  getAllSolicitations,
  getSolicitationStats,
  updateSolicitation,
  deleteSolicitation,
  toggleStarred,
  subscribeSolicitations,
} from '@/services/solicitationService';

interface UseSolicitationsOptions {
  realtime?: boolean;
  autoLoad?: boolean;
}

export function useSolicitations(options: UseSolicitationsOptions = {}) {
  const { realtime = true, autoLoad = true } = options;
  
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [stats, setStats] = useState<SolicitationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [solicitationsData, statsData] = await Promise.all([
        getAllSolicitations(),
        getSolicitationStats(),
      ]);
      
      setSolicitations(solicitationsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar solicitações'));
      console.error('Erro ao carregar solicitações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup realtime listener
  useEffect(() => {
    if (autoLoad && !realtime) {
      loadData();
    }
  }, [autoLoad, realtime, loadData]);

  useEffect(() => {
    if (!realtime) return;
    
    setLoading(true);
    
    let hasReceivedData = false;
    
    const unsubscribe = subscribeSolicitations((data) => {
      hasReceivedData = true;
      setSolicitations(data);
      setLoading(false);
    });

    // Carregar stats separadamente (não tem listener)
    getSolicitationStats()
      .then(setStats)
      .catch((err) => {
        console.error('Erro ao carregar stats:', err);
      })
      .finally(() => {
        // Garantir que loading pare mesmo se o listener não disparar
        setTimeout(() => {
          if (!hasReceivedData) {
            setLoading(false);
          }
        }, 3000);
      });

    return () => unsubscribe();
  }, [realtime]);

  // Atualizar status
  const updateStatus = useCallback(async (id: string, status: SolicitationStatus) => {
    try {
      await updateSolicitation(id, { status });
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Marcar como respondida
  const markAsResponded = useCallback(async (id: string, response: string, respondedBy: string) => {
    try {
      await updateSolicitation(id, {
        status: 'responded',
        response,
        respondedBy,
      });
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao marcar como respondida:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Alternar estrela
  const toggleStar = useCallback(async (id: string, currentStarred?: boolean) => {
    try {
      // Se currentStarred não for passado, busca da lista atual
      const solicitation = solicitations.find(s => s.id === id);
      const newStarred = currentStarred !== undefined ? !currentStarred : !solicitation?.starred;
      await toggleStarred(id, newStarred);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao alternar estrela:', err);
      throw err;
    }
  }, [realtime, loadData, solicitations]);

  // Deletar
  const remove = useCallback(async (id: string) => {
    try {
      await deleteSolicitation(id);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Filtrar por status
  const filterByStatus = useCallback((status: SolicitationStatus | 'all') => {
    if (status === 'all') return solicitations;
    return solicitations.filter(s => s.status === status);
  }, [solicitations]);

  // Filtrar por termo de busca
  const search = useCallback((term: string) => {
    const lowerTerm = term.toLowerCase();
    return solicitations.filter(s => 
      s.name.toLowerCase().includes(lowerTerm) ||
      s.email.toLowerCase().includes(lowerTerm) ||
      s.subject.toLowerCase().includes(lowerTerm) ||
      s.message.toLowerCase().includes(lowerTerm)
    );
  }, [solicitations]);

  return {
    solicitations,
    stats,
    loading,
    error,
    refresh: loadData,
    updateStatus,
    markAsResponded,
    toggleStar,
    remove,
    filterByStatus,
    search,
  };
}
