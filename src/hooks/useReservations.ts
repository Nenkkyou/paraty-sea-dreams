/**
 * useReservations Hook
 * ====================
 * Hook React para gerenciar reservas com dados do Firestore
 */

import { useState, useEffect, useCallback } from 'react';
import { Reservation, ReservationStats, ReservationStatus, PaymentStatus } from '@/types';
import {
  getAllReservations,
  getReservationStats,
  getTodayReservations,
  updateReservation,
  confirmReservation,
  cancelReservation,
  completeReservation,
  updatePayment,
  deleteReservation,
  subscribeReservations,
} from '@/services/reservationService';

interface UseReservationsOptions {
  realtime?: boolean;
  autoLoad?: boolean;
}

export function useReservations(options: UseReservationsOptions = {}) {
  const { realtime = true, autoLoad = true } = options;
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [reservationsData, statsData, todayData] = await Promise.all([
        getAllReservations(),
        getReservationStats(),
        getTodayReservations(),
      ]);
      
      setReservations(reservationsData);
      setStats(statsData);
      setTodayReservations(todayData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar reservas'));
      console.error('Erro ao carregar reservas:', err);
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
    
    const unsubscribe = subscribeReservations((data) => {
      setReservations(data);
      setLoading(false);
    });

    // Carregar stats e today separadamente
    Promise.all([
      getReservationStats(),
      getTodayReservations(),
    ]).then(([statsData, todayData]) => {
      setStats(statsData);
      setTodayReservations(todayData);
    }).catch(console.error);

    return () => unsubscribe();
  }, [realtime]);

  // Confirmar reserva
  const confirm = useCallback(async (id: string, confirmedBy: string) => {
    try {
      await confirmReservation(id, confirmedBy);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao confirmar:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Cancelar reserva
  const cancel = useCallback(async (id: string, cancelledBy: string, reason?: string) => {
    try {
      await cancelReservation(id, cancelledBy, reason);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao cancelar:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Marcar como concluída
  const complete = useCallback(async (id: string) => {
    try {
      await completeReservation(id);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao completar:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Atualizar pagamento
  const addPayment = useCallback(async (id: string, amount: number, method?: string) => {
    try {
      await updatePayment(id, amount, method);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar pagamento:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Deletar
  const remove = useCallback(async (id: string) => {
    try {
      await deleteReservation(id);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      throw err;
    }
  }, [realtime, loadData]);

  // Filtrar por status
  const filterByStatus = useCallback((status: ReservationStatus | 'all') => {
    if (status === 'all') return reservations;
    return reservations.filter(r => r.status === status);
  }, [reservations]);

  // Filtrar por status de pagamento
  const filterByPaymentStatus = useCallback((status: PaymentStatus | 'all') => {
    if (status === 'all') return reservations;
    return reservations.filter(r => r.paymentStatus === status);
  }, [reservations]);

  // Filtrar por data
  const filterByDate = useCallback((date: string) => {
    return reservations.filter(r => r.date === date);
  }, [reservations]);

  // Buscar
  const search = useCallback((term: string) => {
    const lowerTerm = term.toLowerCase();
    return reservations.filter(r => 
      r.clientName.toLowerCase().includes(lowerTerm) ||
      r.clientEmail.toLowerCase().includes(lowerTerm) ||
      r.routeName.toLowerCase().includes(lowerTerm)
    );
  }, [reservations]);

  return {
    reservations,
    todayReservations,
    stats,
    loading,
    error,
    refresh: loadData,
    confirm,
    cancel,
    complete,
    addPayment,
    remove,
    filterByStatus,
    filterByPaymentStatus,
    filterByDate,
    search,
  };
}
