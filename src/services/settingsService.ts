/**
 * Settings Service
 * ================
 * Serviço para gerenciar configurações do sistema no Firestore
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SystemSettings } from '@/types';

const DOC_PATH = 'settings/system';

/**
 * Configurações padrão do sistema
 */
export const defaultSettings: Omit<SystemSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  companyName: 'Paraty Boat',
  companyEmail: 'contato@paratyboat.com.br',
  companyPhone: '(24) 99999-9999',
  companyWhatsapp: '5524999999999',
  companyAddress: 'Marina de Paraty, Paraty - RJ',
  
  operatingHours: {
    start: '08:00',
    end: '18:00',
  },
  operatingDays: [0, 1, 2, 3, 4, 5, 6], // Todos os dias
  
  notifyOnNewSolicitation: true,
  notifyOnNewReservation: true,
  notifyOnCancellation: true,
  notificationEmails: ['contato@paratyboat.com.br'],
  
  acceptedPaymentMethods: ['pix', 'credit_card', 'debit_card', 'cash', 'transfer'],
  
  cancellationPolicy: `
## Política de Cancelamento

### Cancelamento pelo Cliente
- **Até 48h antes:** Reembolso integral
- **Entre 24h e 48h:** Reembolso de 50%
- **Menos de 24h:** Sem reembolso

### Cancelamento por Condições Climáticas
Em caso de mau tempo que impossibilite a navegação segura, oferecemos:
- Reagendamento sem custo adicional
- Reembolso integral

### Como Solicitar Cancelamento
Entre em contato pelo WhatsApp ou email informando o número da reserva.
  `.trim(),
  
  maintenanceMode: false,
};

/**
 * Obter configurações do sistema
 */
export async function getSettings(): Promise<SystemSettings> {
  const docRef = doc(db, DOC_PATH);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as SystemSettings;
  }
  
  // Retornar configurações padrão se não existirem
  return defaultSettings as SystemSettings;
}

/**
 * Salvar configurações do sistema
 */
export async function saveSettings(data: Partial<SystemSettings>): Promise<void> {
  const docRef = doc(db, DOC_PATH);
  
  // Verificar se documento existe
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    await setDoc(docRef, {
      ...docSnap.data(),
      ...data,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } else {
    await setDoc(docRef, {
      ...defaultSettings,
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

/**
 * Inicializar configurações se não existirem
 */
export async function initializeSettings(): Promise<void> {
  const docRef = doc(db, DOC_PATH);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      ...defaultSettings,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

/**
 * Listener em tempo real
 */
export function subscribeSettings(
  callback: (settings: SystemSettings) => void
): () => void {
  const docRef = doc(db, DOC_PATH);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as SystemSettings);
    } else {
      callback(defaultSettings as SystemSettings);
    }
  });
}

/**
 * Verificar se está em modo manutenção
 */
export async function isMaintenanceMode(): Promise<boolean> {
  const settings = await getSettings();
  return settings.maintenanceMode;
}

/**
 * Ativar/desativar modo manutenção
 */
export async function toggleMaintenanceMode(active: boolean, message?: string): Promise<void> {
  await saveSettings({
    maintenanceMode: active,
    maintenanceMessage: message || undefined,
  });
}

/**
 * Atualizar emails de notificação
 */
export async function updateNotificationEmails(emails: string[]): Promise<void> {
  await saveSettings({
    notificationEmails: emails,
  });
}

/**
 * Atualizar horário de funcionamento
 */
export async function updateOperatingHours(start: string, end: string): Promise<void> {
  await saveSettings({
    operatingHours: { start, end },
  });
}

/**
 * Atualizar dados do PIX
 */
export async function updatePixKey(pixKey: string): Promise<void> {
  await saveSettings({ pixKey });
}

/**
 * Atualizar dados bancários
 */
export async function updateBankDetails(bankDetails: SystemSettings['bankDetails']): Promise<void> {
  await saveSettings({ bankDetails });
}
