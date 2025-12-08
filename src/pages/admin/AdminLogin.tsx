import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Anchor, Lock, User, Eye, EyeOff, Waves, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Senha mestra do ambiente
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_MASTER_PASSWORD || '';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verificar senha mestra
    if (password === ADMIN_PASSWORD && email.trim() !== "") {
      // Salvar sessão no localStorage
      localStorage.setItem('adminAuth', JSON.stringify({
        email,
        authenticated: true,
        timestamp: Date.now()
      }));
      
      // Ir para o dashboard
      navigate("/admin/dashboard");
    } else {
      setError("Email ou senha incorretos");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-ocean-navy via-ocean-teal to-ocean-cyan">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Waves Animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-64 opacity-20"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 1440 320" className="w-full h-full fill-white">
            <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </motion.div>

        {/* Floating Ships */}
        {/* Anchor Decorations */}
        <motion.div
          className="absolute bottom-40 right-10 text-white/10"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Anchor className="w-20 h-20" />
        </motion.div>

        {/* Bubbles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              bottom: "10%",
            }}
            animate={{
              y: [0, -400, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-xl bg-white/95 border-0 shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-2">
              {/* Logo */}
              <motion.div
                className="mx-auto w-20 h-20 bg-gradient-to-br from-ocean-navy to-ocean-teal rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Anchor className="w-10 h-10 text-white" />
              </motion.div>
              
              <div>
                <CardTitle className="text-2xl font-display text-ocean-navy">
                  Paraty Boat
                </CardTitle>
                <CardDescription className="text-ocean-teal font-medium">
                  Painel Administrativo
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@paratyboat.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-ocean-teal focus:ring-ocean-teal/20"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:border-ocean-teal focus:ring-ocean-teal/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-ocean-teal focus:ring-ocean-teal/20"
                    />
                    <span className="text-gray-600">Lembrar-me</span>
                  </label>
                  <a href="#" className="text-ocean-teal hover:text-ocean-navy transition-colors font-medium">
                    Esqueci a senha
                  </a>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-ocean-navy to-ocean-teal hover:from-ocean-navy/90 hover:to-ocean-teal/90 text-white font-medium text-base shadow-lg shadow-ocean-teal/25 transition-all duration-300"
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Waves className="w-5 h-5" />
                        </motion.div>
                        <span>Entrando...</span>
                      </motion.div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Entrar no Painel
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  © 2025 Paraty Boat. Todos os direitos reservados.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Acesso restrito a administradores autorizados.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
