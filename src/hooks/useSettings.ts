/**
 * useSettings Hook
 * ================
 * Hook React para gerenciar configurações do sistema
 */

import { useState, useEffect, useCallback } from 'react';
import { SystemSettings } from '@/types';
import {
  getSettings,
  saveSettings,
  subscribeSettings,
  toggleMaintenanceMode,
  updateNotificationEmails,
  updateOperatingHours,
  updatePixKey,
  updateBankDetails,
} from '@/services/settingsService';

interface UseSettingsOptions {
  realtime?: boolean;
  autoLoad?: boolean;
}

export function useSettings(options: UseSettingsOptions = {}) {
  const { realtime = true, autoLoad = true } = options;
  
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settingsData = await getSettings();
      setSettings(settingsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar configurações'));
      console.error('Erro ao carregar configurações:', err);
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
    
    const unsubscribe = subscribeSettings((data) => {
      setSettings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [realtime]);

  // Salvar configurações
  const save = useCallback(async (data: Partial<SystemSettings>) => {
    try {
      setSaving(true);
      setError(null);
      
      await saveSettings(data);
      
      if (!realtime) await loadData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao salvar configurações'));
      console.error('Erro ao salvar configurações:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [realtime, loadData]);

  // Toggle manutenção
  const toggleMaintenance = useCallback(async (active: boolean, message?: string) => {
    try {
      setSaving(true);
      await toggleMaintenanceMode(active, message);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao alternar manutenção:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [realtime, loadData]);

  // Atualizar emails
  const updateEmails = useCallback(async (emails: string[]) => {
    try {
      setSaving(true);
      await updateNotificationEmails(emails);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar emails:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [realtime, loadData]);

  // Atualizar horários
  const updateHours = useCallback(async (start: string, end: string) => {
    try {
      setSaving(true);
      await updateOperatingHours(start, end);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar horários:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [realtime, loadData]);

  // Atualizar PIX
  const updatePix = useCallback(async (pixKey: string) => {
    try {
      setSaving(true);
      await updatePixKey(pixKey);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar PIX:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [realtime, loadData]);

  // Atualizar banco
  const updateBank = useCallback(async (bankDetails: SystemSettings['bankDetails']) => {
    try {
      setSaving(true);
      await updateBankDetails(bankDetails);
      if (!realtime) await loadData();
    } catch (err) {
      console.error('Erro ao atualizar banco:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [realtime, loadData]);

  return {
    settings,
    loading,
    saving,
    error,
    refresh: loadData,
    save,
    toggleMaintenance,
    updateEmails,
    updateHours,
    updatePix,
    updateBank,
  };
}
