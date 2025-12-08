/**
 * Hooks Index
 * ===========
 * Exporta todos os hooks personalizados do sistema
 */

// Hooks de UI
export { useMobile, useIsMobile } from './use-mobile';
export { useToast, toast } from './use-toast';

// Hooks Firebase - Genéricos
export { useAuth } from './useAuth';
export { useFirestore, useDocument, useCollection } from './useFirestore';
export { useStorage } from './useStorage';

// Hooks de Entidades
export { useSolicitations } from './useSolicitations';
export { useReservations } from './useReservations';
export { useClients } from './useClients';
export { useDashboard } from './useDashboard';
export { useSettings } from './useSettings';
