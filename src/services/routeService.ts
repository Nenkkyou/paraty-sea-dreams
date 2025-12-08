/**
 * Route Service
 * =============
 * Serviço para gerenciar roteiros no Firestore
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
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Route } from '@/types';

const COLLECTION_NAME = 'routes';

/**
 * Criar novo roteiro
 */
export async function createRoute(data: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Buscar roteiro por ID
 */
export async function getRouteById(id: string): Promise<Route | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Route;
  }
  return null;
}

/**
 * Buscar roteiro por slug
 */
export async function getRouteBySlug(slug: string): Promise<Route | null> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Route;
  }
  return null;
}

/**
 * Buscar todos os roteiros
 */
export async function getAllRoutes(): Promise<Route[]> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(collectionRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Route));
}

/**
 * Buscar roteiros ativos
 */
export async function getActiveRoutes(): Promise<Route[]> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(
    collectionRef, 
    where('isActive', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Route));
}

/**
 * Buscar roteiros em destaque
 */
export async function getFeaturedRoutes(): Promise<Route[]> {
  const collectionRef = collection(db, COLLECTION_NAME);
  const q = query(
    collectionRef, 
    where('isActive', '==', true),
    where('featured', '==', true),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Route));
}

/**
 * Atualizar roteiro
 */
export async function updateRoute(id: string, data: Partial<Route>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Alternar status ativo
 */
export async function toggleRouteActive(id: string): Promise<void> {
  const route = await getRouteById(id);
  if (!route) throw new Error('Roteiro não encontrado');
  
  await updateRoute(id, { isActive: !route.isActive });
}

/**
 * Alternar destaque
 */
export async function toggleRouteFeatured(id: string): Promise<void> {
  const route = await getRouteById(id);
  if (!route) throw new Error('Roteiro não encontrado');
  
  await updateRoute(id, { featured: !route.featured });
}

/**
 * Deletar roteiro
 */
export async function deleteRoute(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Reordenar roteiros
 */
export async function reorderRoutes(routeOrders: { id: string; order: number }[]): Promise<void> {
  const promises = routeOrders.map(({ id, order }) => 
    updateRoute(id, { order })
  );
  await Promise.all(promises);
}

/**
 * Listener em tempo real
 */
export function subscribeRoutes(
  callback: (routes: Route[]) => void,
  onlyActive: boolean = false
): () => void {
  const collectionRef = collection(db, COLLECTION_NAME);
  
  let q;
  if (onlyActive) {
    q = query(
      collectionRef, 
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
  } else {
    q = query(collectionRef, orderBy('order', 'asc'));
  }
  
  return onSnapshot(q, (snapshot) => {
    const routes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Route));
    callback(routes);
  });
}

/**
 * Gerar slug único
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Verificar se slug já existe
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const route = await getRouteBySlug(slug);
  if (!route) return true;
  if (excludeId && route.id === excludeId) return true;
  return false;
}
