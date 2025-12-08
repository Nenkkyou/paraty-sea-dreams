/**
 * Client Service
 * ===============
 * Serviço para gerenciar clientes no Firestore
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
import { Client, ClientStats, ClientType } from '@/types';

const COLLECTION_NAME = 'clients';

/**
 * Criar novo cliente
 */
export async function createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Buscar cliente por ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Client;
  }
  return null;
}

/**
 * Buscar cliente por email
 */
export async function getClientByEmail(email: string): Promise<Client | null> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, where('email', '==', email), limit(1));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Client;
  }
  return null;
}

/**
 * Buscar todos os clientes
 */
export async function getAllClients(constraints: QueryConstraint[] = []): Promise<Client[]> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('name', 'asc'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Client));
}

/**
 * Buscar clientes com filtros
 */
export async function getClientsWithFilters(filters: {
  type?: ClientType;
  acceptsMarketing?: boolean;
  limit?: number;
}): Promise<Client[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.acceptsMarketing !== undefined) {
    constraints.push(where('acceptsMarketing', '==', filters.acceptsMarketing));
  }
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  
  return getAllClients(constraints);
}

/**
 * Buscar top clientes por gasto
 */
export async function getTopClientsBySpent(maxResults: number = 10): Promise<Client[]> {
  const clients = await getAllClients();
  return clients
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, maxResults);
}

/**
 * Buscar clientes VIP
 */
export async function getVIPClients(): Promise<Client[]> {
  return getClientsWithFilters({ type: 'vip' });
}

/**
 * Atualizar cliente
 */
export async function updateClient(id: string, data: Partial<Client>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Atualizar métricas do cliente após uma reserva
 */
export async function updateClientMetrics(
  id: string, 
  tripAmount: number, 
  routeName?: string
): Promise<void> {
  const client = await getClientById(id);
  if (!client) throw new Error('Cliente não encontrado');
  
  const newTotalTrips = (client.totalTrips || 0) + 1;
  const newTotalSpent = (client.totalSpent || 0) + tripAmount;
  
  // Determinar tipo baseado no total gasto
  let type: ClientType = client.type;
  if (newTotalSpent >= 10000 || newTotalTrips >= 10) {
    type = 'vip';
  }
  
  await updateClient(id, {
    totalTrips: newTotalTrips,
    totalSpent: newTotalSpent,
    lastTripDate: Timestamp.now(),
    favoriteRoute: routeName || client.favoriteRoute,
    type,
  });
}

/**
 * Deletar cliente
 */
export async function deleteClient(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Obter estatísticas
 */
export async function getClientStats(): Promise<ClientStats> {
  const clients = await getAllClients();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const newThisMonth = clients.filter(c => {
    if (!c.createdAt) return false;
    const createdDate = c.createdAt.toDate();
    return createdDate >= monthStart;
  }).length;
  
  const totalTrips = clients.reduce((sum, c) => sum + (c.totalTrips || 0), 0);
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const averageSpent = clients.length > 0 ? totalRevenue / clients.length : 0;
  
  return {
    total: clients.length,
    vip: clients.filter(c => c.type === 'vip').length,
    regular: clients.filter(c => c.type === 'regular').length,
    corporate: clients.filter(c => c.type === 'corporate').length,
    newThisMonth,
    totalTrips,
    totalRevenue,
    averageSpent,
  };
}

/**
 * Listener em tempo real
 */
export function subscribeClients(
  callback: (clients: Client[]) => void,
  constraints: QueryConstraint[] = []
): () => void {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('name', 'asc'), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const clients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Client));
    callback(clients);
  });
}

/**
 * Buscar ou criar cliente pelo email
 */
export async function findOrCreateClient(data: {
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'whatsapp' | 'phone' | 'referral' | 'other';
}): Promise<{ id: string; isNew: boolean }> {
  // Verificar se já existe
  const existing = await getClientByEmail(data.email);
  
  if (existing) {
    return { id: existing.id!, isNew: false };
  }
  
  // Criar novo cliente
  const id = await createClient({
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: 'regular',
    totalTrips: 0,
    totalSpent: 0,
    acceptsMarketing: true,
    source: data.source,
  });
  
  return { id, isNew: true };
}

/**
 * Gerar código de referência único
 */
export function generateReferralCode(name: string): string {
  const namePart = name.split(' ')[0].toUpperCase().slice(0, 4);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePart}${randomPart}`;
}
