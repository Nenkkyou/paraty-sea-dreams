/**
 * Reservation Service
 * ===================
 * Serviço para gerenciar reservas no Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reservation, ReservationStats, ReservationStatus, PaymentStatus } from '@/types';

const COLLECTION_NAME = 'reservations';

/**
 * Criar nova reserva
 */
export async function createReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Buscar reserva por ID
 */
export async function getReservationById(id: string): Promise<Reservation | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Reservation;
  }
  return null;
}

/**
 * Buscar todas as reservas
 */
export async function getAllReservations(constraints: QueryConstraint[] = []): Promise<Reservation[]> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('date', 'desc'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Reservation));
}

/**
 * Buscar reservas com filtros
 */
export async function getReservationsWithFilters(filters: {
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  clientId?: string;
  date?: string;
  limit?: number;
}): Promise<Reservation[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters.paymentStatus) {
    constraints.push(where('paymentStatus', '==', filters.paymentStatus));
  }
  if (filters.clientId) {
    constraints.push(where('clientId', '==', filters.clientId));
  }
  if (filters.date) {
    constraints.push(where('date', '==', filters.date));
  }
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  
  return getAllReservations(constraints);
}

/**
 * Buscar reservas de hoje
 */
export async function getTodayReservations(): Promise<Reservation[]> {
  const today = new Date().toISOString().split('T')[0];
  return getReservationsWithFilters({ date: today });
}

/**
 * Buscar reservas da semana
 */
export async function getWeekReservations(): Promise<Reservation[]> {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const reservations = await getAllReservations();
  
  return reservations.filter(r => {
    const date = new Date(r.date);
    return date >= weekStart && date <= weekEnd;
  });
}

/**
 * Atualizar reserva
 */
export async function updateReservation(id: string, data: Partial<Reservation>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Confirmar reserva
 */
export async function confirmReservation(id: string, confirmedBy: string): Promise<void> {
  await updateReservation(id, {
    status: 'confirmed',
    confirmedAt: Timestamp.now(),
    confirmedBy,
  });
}

/**
 * Cancelar reserva
 */
export async function cancelReservation(id: string, cancelledBy: string, reason?: string): Promise<void> {
  await updateReservation(id, {
    status: 'cancelled',
    cancelledAt: Timestamp.now(),
    cancelledBy,
    cancellationReason: reason || null,
  });
}

/**
 * Marcar como concluída
 */
export async function completeReservation(id: string): Promise<void> {
  await updateReservation(id, {
    status: 'completed',
  });
}

/**
 * Atualizar pagamento
 */
export async function updatePayment(id: string, paidAmount: number, paymentMethod?: string): Promise<void> {
  const reservation = await getReservationById(id);
  if (!reservation) throw new Error('Reserva não encontrada');
  
  const newPaidAmount = reservation.paidAmount + paidAmount;
  const paymentStatus: PaymentStatus = 
    newPaidAmount >= reservation.totalAmount ? 'paid' :
    newPaidAmount > 0 ? 'partial' : 'pending';
  
  await updateReservation(id, {
    paidAmount: newPaidAmount,
    paymentStatus,
    paymentMethod: paymentMethod as any || reservation.paymentMethod,
  });
}

/**
 * Deletar reserva
 */
export async function deleteReservation(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Obter estatísticas
 */
export async function getReservationStats(): Promise<ReservationStats> {
  const reservations = await getAllReservations();
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  
  // Início da semana e mês
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const todayReservations = reservations.filter(r => r.date === today);
  const weekReservations = reservations.filter(r => new Date(r.date) >= weekStart);
  const monthReservations = reservations.filter(r => new Date(r.date) >= monthStart);
  
  const totalRevenue = reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const monthRevenue = monthReservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  
  return {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    completed: reservations.filter(r => r.status === 'completed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
    todayCount: todayReservations.length,
    weekCount: weekReservations.length,
    monthCount: monthReservations.length,
    totalRevenue,
    monthRevenue,
  };
}

/**
 * Listener em tempo real
 */
export function subscribeReservations(
  callback: (reservations: Reservation[]) => void,
  constraints: QueryConstraint[] = []
): () => void {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('date', 'desc'), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reservation));
    callback(reservations);
  });
}

/**
 * Criar reserva a partir de solicitação
 */
export async function createFromSolicitation(
  solicitationId: string,
  clientId: string,
  routeId: string,
  routeName: string,
  date: string,
  time: string,
  guests: number,
  price: number,
  clientData: { name: string; email: string; phone: string }
): Promise<string> {
  return createReservation({
    clientId,
    clientName: clientData.name,
    clientEmail: clientData.email,
    clientPhone: clientData.phone,
    routeId,
    routeName,
    date,
    time,
    duration: 4, // padrão
    guests,
    price,
    discount: 0,
    totalAmount: price * guests,
    paymentStatus: 'pending',
    paidAmount: 0,
    status: 'pending',
    solicitationId,
    source: 'website',
  });
}
