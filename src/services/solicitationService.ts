/**
 * Solicitation Service
 * ====================
 * Serviço para gerenciar solicitações de contato no Firestore
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
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Solicitation, SolicitationStats, SolicitationType, SolicitationStatus } from '@/types';

const COLLECTION_NAME = 'solicitations';

/**
 * Criar nova solicitação
 */
export async function createSolicitation(data: Omit<Solicitation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Buscar solicitação por ID
 */
export async function getSolicitationById(id: string): Promise<Solicitation | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Solicitation;
  }
  return null;
}

/**
 * Buscar todas as solicitações
 */
export async function getAllSolicitations(constraints: QueryConstraint[] = []): Promise<Solicitation[]> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('createdAt', 'desc'), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Solicitation));
}

/**
 * Buscar solicitações com filtros
 */
export async function getSolicitationsWithFilters(filters: {
  status?: SolicitationStatus;
  type?: SolicitationType;
  starred?: boolean;
  limit?: number;
}): Promise<Solicitation[]> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.status) {
    constraints.push(where('status', '==', filters.status));
  }
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.starred !== undefined) {
    constraints.push(where('starred', '==', filters.starred));
  }
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  
  return getAllSolicitations(constraints);
}

/**
 * Atualizar solicitação
 */
export async function updateSolicitation(id: string, data: Partial<Solicitation>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Marcar como respondida
 */
export async function markAsResponded(id: string, response: string, respondedBy: string): Promise<void> {
  await updateSolicitation(id, {
    status: 'responded',
    response,
    respondedBy,
    respondedAt: Timestamp.now(),
  });
}

/**
 * Marcar como confirmada
 */
export async function markAsConfirmed(id: string): Promise<void> {
  await updateSolicitation(id, {
    status: 'confirmed',
  });
}

/**
 * Alternar favorito
 */
export async function toggleStarred(id: string, starred: boolean): Promise<void> {
  await updateSolicitation(id, { starred });
}

/**
 * Deletar solicitação
 */
export async function deleteSolicitation(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Obter estatísticas
 */
export async function getSolicitationStats(): Promise<SolicitationStats> {
  const solicitations = await getAllSolicitations();
  
  return {
    total: solicitations.length,
    pending: solicitations.filter(s => s.status === 'pending').length,
    responded: solicitations.filter(s => s.status === 'responded').length,
    confirmed: solicitations.filter(s => s.status === 'confirmed').length,
    cancelled: solicitations.filter(s => s.status === 'cancelled').length,
    starred: solicitations.filter(s => s.starred).length,
  };
}

/**
 * Listener em tempo real
 */
export function subscribeSolicitations(
  callback: (solicitations: Solicitation[]) => void,
  constraints: QueryConstraint[] = []
): () => void {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('createdAt', 'desc'), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const solicitations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Solicitation));
    callback(solicitations);
  });
}

/**
 * Criar solicitação a partir do formulário de contato
 */
export async function createFromContactForm(formData: {
  nome: string;
  email: string;
  telefone: string;
  roteiro: string;
  mensagem: string;
}): Promise<string> {
  return createSolicitation({
    name: formData.nome,
    email: formData.email,
    phone: formData.telefone,
    subject: `Interesse em ${formData.roteiro}`,
    message: formData.mensagem,
    type: 'reservation',
    status: 'pending',
    route: formData.roteiro,
    guests: null,
    preferredDate: null,
    starred: false,
    readAt: null,
    respondedAt: null,
    respondedBy: null,
    response: null,
    source: 'website',
    ipAddress: null,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });
}
