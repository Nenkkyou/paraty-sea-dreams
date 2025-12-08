import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Ship,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Activity,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSolicitations } from "@/hooks/useSolicitations";
import { useReservations } from "@/hooks/useReservations";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Buscar contagens reais do Firestore
  const { stats: solicitationStats } = useSolicitations();
  const { stats: reservationStats } = useReservations();

  // Menu items com contagens dinâmicas
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      badge: null,
    },
    {
      title: "Solicitações",
      icon: MessageSquare,
      path: "/admin/solicitacoes",
      badge: solicitationStats?.pending || null,
    },
    {
      title: "Reservas",
      icon: Calendar,
      path: "/admin/reservas",
      badge: reservationStats?.pending || null,
    },
    {
      title: "Clientes",
      icon: Users,
      path: "/admin/clientes",
      badge: null,
    },
    {
      title: "Monitor",
      icon: Activity,
      path: "/admin/monitor",
      badge: null,
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/admin/configuracoes",
      badge: null,
    },
  ];

  const handleLogout = () => {
    // Limpar sessão de autenticação
    localStorage.removeItem('adminAuth');
    navigate("/admin");
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-slate-950" : "bg-slate-50"}`}>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 shadow-xl
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-16 lg:w-20"}
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-ocean-navy to-ocean-teal rounded-xl flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Anchor className="w-5 h-5 text-white" />
            </motion.div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-display text-lg font-bold text-ocean-navy dark:text-white"
              >
                Paraty Boat
              </motion.span>
            )}
          </Link>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r from-ocean-navy to-ocean-teal text-white shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-medium">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-ocean-teal/10 text-ocean-teal"
                          }
                        `}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle (Desktop) */}
        <div className="absolute bottom-4 left-0 right-0 px-4 hidden lg:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 -rotate-90" />
            </motion.div>
            {sidebarOpen && <span className="text-sm">Recolher menu</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
          transition-all duration-300
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-16 xl:lg:ml-20"}
        `}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="h-full px-4 flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Search */}
              <div className="hidden lg:flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2 w-64 xl:w-80">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className="border-0 bg-transparent focus-visible:ring-0 px-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <span className="font-medium">Nova solicitação de reserva</span>
                    <span className="text-sm text-gray-500">Cliente: João Silva - Há 5 minutos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <span className="font-medium">Pagamento confirmado</span>
                    <span className="text-sm text-gray-500">Reserva #1234 - Há 1 hora</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                    <span className="font-medium">Nova mensagem de contato</span>
                    <span className="text-sm text-gray-500">Maria Santos - Há 2 horas</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors min-h-[44px]">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                      <AvatarFallback className="bg-ocean-teal text-white">AD</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</p>
                      <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
