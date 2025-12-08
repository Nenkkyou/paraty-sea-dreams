/**
 * AdminGuard Component
 * ====================
 * Protege rotas administrativas verificando autenticação
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

// Tempo de expiração da sessão (8 horas)
const SESSION_EXPIRY = 8 * 60 * 60 * 1000;

export function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('adminAuth');
        
        if (!authData) {
          setIsAuthenticated(false);
          setIsChecking(false);
          navigate('/admin', { replace: true });
          return;
        }

        const { authenticated, timestamp } = JSON.parse(authData);
        const now = Date.now();

        // Verificar se a sessão expirou
        if (!authenticated || (now - timestamp) > SESSION_EXPIRY) {
          localStorage.removeItem('adminAuth');
          setIsAuthenticated(false);
          setIsChecking(false);
          navigate('/admin', { replace: true });
          return;
        }

        // Atualizar timestamp para manter sessão ativa
        localStorage.setItem('adminAuth', JSON.stringify({
          ...JSON.parse(authData),
          timestamp: now
        }));

        setIsAuthenticated(true);
        setIsChecking(false);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
        setIsChecking(false);
        navigate('/admin', { replace: true });
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-navy via-ocean-teal to-ocean-cyan">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Hook para logout do admin
 */
export function useAdminLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin', { replace: true });
  };

  return logout;
}

/**
 * Hook para verificar se está autenticado
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        const { authenticated, email, timestamp } = JSON.parse(authData);
        const now = Date.now();
        
        if (authenticated && (now - timestamp) <= SESSION_EXPIRY) {
          setIsAuthenticated(true);
          setAdminEmail(email);
        }
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, adminEmail };
}
