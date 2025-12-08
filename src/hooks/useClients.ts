/**
 * useClients Hook
 * ===============
 * Hook React para gerenciar clientes com dados do Firestore
 */

import { useState, useEffect, useCallback } from 'react';
import { Client, ClientStats, ClientType } from '@/types';
import {
  getAllClients,
  getClientStats,
  updateClient,
  deleteClient,
  getVIPClients,
  getTopClientsBySpent,
  subscribeClients,
} from '@/services/clientService';

interface UseClientsOptions {
  realtime?: boolean;
  autoLoad?: boolean;
}

export function useClients(options: UseClientsOptions = {}) {
  const { realtime = true, autoLoad = true } = options;
  
  const [clients, setClients] = useState<Client[]>([]);
  const [vipClients, setVipClients] = useState<Client[]>([]);
  const [topClients, setTopClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [clientsData, statsData, vipData, topData] = await Promise.all([
        getAllClients(),
        getClientStats(),
        getVIPClients(),
        getTopClientsBySpent(5),
      ]);
      
      setClients(clientsData);
      setStats(statsData);
      setVipClients(vipData);
      setTopClients(topData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar clientes'));
      console.error('Erro ao carregar clientes:', err);
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
    
    const unsubscribe = subscribeClients((data) => {
      setClients(data);
      setLoading(false);
    });

    // Carregar stats separadamente
    Promise.all([
      getClientStats(),
      getVIPClients(),
      getTopClientsBySpent(5),
    ]).then(([statsData, vipData, topData]) => {
      setStats(statsData);
      setVipClients(vipData);
      setTopClients(topData);
    }).catch(console.error);

    return () => unsubscribe();
  }, [realtime]);

  // Atualizar cliente
  const update = useCallback(async (id: string, data: Partial<Client>) => {
    try {
      await updateClient(id, data);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Promover a VIP
  const promoteToVIP = useCallback(async (id: string) => {
    try {
      await updateClient(id, { type: 'vip' });
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao promover cliente:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Deletar
  const remove = useCallback(async (id: string) => {
    try {
      await deleteClient(id);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Filtrar por tipo
  const filterByType = useCallback((type: ClientType | 'all') => {
    if (type === 'all') return clients;
    return clients.filter(c => c.type === type);
  }, [clients]);

  // Buscar
  const search = useCallback((term: string) => {
    const lowerTerm = term.toLowerCase();
    return clients.filter(c => 
      c.name.toLowerCase().includes(lowerTerm) ||
      c.email.toLowerCase().includes(lowerTerm) ||
      c.phone.includes(term)
    );
  }, [clients]);

  return {
    clients,
    vipClients,
    topClients,
    stats,
    loading,
    error,
    refresh: loadData,
    update,
    promoteToVIP,
    remove,
    filterByType,
    search,
  };
}
