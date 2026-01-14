import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Ship,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  Waves,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/useDashboard";
import { useSolicitations } from "@/hooks/useSolicitations";
import { Timestamp } from "firebase/firestore";
import { Solicitation } from "@/types";

// Helper para formatar datas do Firestore
const formatTimeAgo = (date: Timestamp | Date | undefined) => {
  if (!date) return '-';
  const now = new Date();
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  const diff = Math.floor((now.getTime() - dateObj.getTime()) / 1000); // segundos
  
  if (diff < 60) return 'Há poucos segundos';
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)} horas`;
  if (diff < 604800) return `Há ${Math.floor(diff / 86400)} dias`;
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(dateObj);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Backend Status - verificar em tempo real
const backendServices = [
  { name: "Firebase Auth", status: "online", latency: "45ms" },
  { name: "Firestore", status: "online", latency: "32ms" },
  { name: "Storage", status: "online", latency: "28ms" },
  { name: "Resend Email", status: "online", latency: "89ms" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 border-0">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border-0">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelado
        </Badge>
      );
    default:
      return null;
  }
};

const getServiceStatusIcon = (status: string) => {
  switch (status) {
    case "online":
      return <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>;
    case "warning":
      return <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
      </span>;
    case "offline":
      return <span className="relative flex h-2.5 w-2.5">
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>;
    default:
      return null;
  }
};

const AdminDashboard = () => {
  // Carregar dados reais do Firestore
  const { stats: dashboardStats, loading: statsLoading, refresh: refreshStats } = useDashboard();
  const { solicitations, loading: solicitationsLoading, stats: solicitationStats, remove } = useSolicitations();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStats();
    setIsRefreshing(false);
  };

  // Pegar as 5 solicitações mais recentes
  const recentSolicitations = useMemo(() => {
    return solicitations.slice(0, 5);
  }, [solicitations]);

  // Formatar cards de estatísticas
  const statsCards = useMemo(() => {
    if (!dashboardStats) {
      return [
        { title: "Solicitações", value: "0", change: "", trend: "up" as const, icon: MessageSquare, gradient: "from-blue-500 to-blue-600", bgLight: "bg-blue-50", bgDark: "dark:bg-blue-950/50", description: "Este mês" },
        { title: "Reservas Confirmadas", value: "0", change: "", trend: "up" as const, icon: Calendar, gradient: "from-emerald-500 to-emerald-600", bgLight: "bg-emerald-50", bgDark: "dark:bg-emerald-950/50", description: "Este mês" },
        { title: "Clientes", value: "0", change: "", trend: "up" as const, icon: Users, gradient: "from-violet-500 to-violet-600", bgLight: "bg-violet-50", bgDark: "dark:bg-violet-950/50", description: "Total cadastrado" },
        { title: "Receita", value: "R$ 0", change: "", trend: "up" as const, icon: DollarSign, gradient: "from-amber-500 to-amber-600", bgLight: "bg-amber-50", bgDark: "dark:bg-amber-950/50", description: "Este mês" },
      ];
    }

    return [
      {
        title: "Solicitações",
        value: String(dashboardStats.solicitations.total),
        change: `${dashboardStats.solicitations.pending} pendentes`,
        trend: "up" as const,
        icon: MessageSquare,
        gradient: "from-blue-500 to-blue-600",
        bgLight: "bg-blue-50",
        bgDark: "dark:bg-blue-950/50",
        description: "Total recebidas",
      },
      {
        title: "Reservas Confirmadas",
        value: String(dashboardStats.reservations.confirmed),
        change: `${dashboardStats.reservations.monthCount} este mês`,
        trend: "up" as const,
        icon: Calendar,
        gradient: "from-emerald-500 to-emerald-600",
        bgLight: "bg-emerald-50",
        bgDark: "dark:bg-emerald-950/50",
        description: "Total confirmadas",
      },
      {
        title: "Clientes",
        value: String(dashboardStats.clients.total),
        change: `${dashboardStats.clients.vip} VIP`,
        trend: "up" as const,
        icon: Users,
        gradient: "from-violet-500 to-violet-600",
        bgLight: "bg-violet-50",
        bgDark: "dark:bg-violet-950/50",
        description: "Total cadastrado",
      },
      {
        title: "Receita",
        value: formatCurrency(dashboardStats.reservations.monthRevenue),
        change: formatCurrency(dashboardStats.reservations.totalRevenue) + " total",
        trend: dashboardStats.reservations.monthRevenue > 0 ? "up" as const : "down" as const,
        icon: DollarSign,
        gradient: "from-amber-500 to-amber-600",
        bgLight: "bg-amber-50",
        bgDark: "dark:bg-amber-950/50",
        description: "Este mês",
      },
    ];
  }, [dashboardStats]);

  // Popular routes (se disponível)
  const popularRoutes = useMemo(() => {
    if (!dashboardStats?.popularRoutes || dashboardStats.popularRoutes.length === 0) {
      return [
        { name: "Nenhum roteiro ainda", bookings: 0, percentage: 0, color: "from-gray-400 to-gray-500" },
      ];
    }
    const maxBookings = Math.max(...dashboardStats.popularRoutes.map(r => r.bookings));
    const colors = [
      "from-cyan-400 to-blue-500",
      "from-teal-400 to-cyan-500",
      "from-emerald-400 to-teal-500",
      "from-orange-400 to-amber-500",
    ];
    return dashboardStats.popularRoutes.map((route, index) => ({
      name: route.routeName,
      bookings: route.bookings,
      percentage: maxBookings > 0 ? (route.bookings / maxBookings) * 100 : 0,
      color: colors[index % colors.length],
    }));
  }, [dashboardStats]);

  const loading = statsLoading && solicitationsLoading;

  // Tratamento de erro - mostra conteúdo mesmo com erro
  const hasError = !dashboardStats && !statsLoading;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden"
    >
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-shrink">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-ocean-teal flex-shrink-0" />
            <span className="truncate">Dashboard</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
            Bem-vindo de volta! Aqui está o resumo do seu negócio.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-card dark:bg-slate-800 border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 text-foreground h-8 sm:h-9 px-2 sm:px-3"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline ml-2">Atualizar</span>
          </Button>
          <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-card dark:bg-slate-800/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Sistema operacional</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-ocean-teal" />
          <span className="ml-3 text-muted-foreground">Carregando dados...</span>
        </div>
      ) : (
      <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full">
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants} className="min-w-0">
            <Card className={`relative overflow-hidden border border-border/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 ${stat.bgLight} ${stat.bgDark} h-full`}>
              <CardContent className="p-3 sm:p-4 md:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground truncate">
                      {stat.value}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5">
                      <span className={`inline-flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${
                        stat.trend === "up" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      }`}>
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                        <span className="truncate">{stat.change}</span>
                      </span>
                      <span className="text-[9px] sm:text-xs text-muted-foreground hidden sm:inline truncate">{stat.description}</span>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md dark:shadow-none flex-shrink-0`}
                  >
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
        {/* Recent Requests */}
        <motion.div variants={itemVariants} className="xl:col-span-2 min-w-0">
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 overflow-hidden w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">Solicitações Recentes</CardTitle>
                <CardDescription>Últimas solicitações de contato e reservas</CardDescription>
              </div>
              <button className="text-sm text-ocean-teal hover:text-ocean-cyan font-medium flex items-center gap-1 transition-colors">
                Ver todas
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2">
                {recentSolicitations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma solicitação recebida ainda</p>
                    <p className="text-sm">As solicitações aparecerão aqui</p>
                  </div>
                ) : (
                  recentSolicitations.map((solicitation, index) => (
                    <motion.div
                      key={solicitation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-medium text-sm shadow-md">
                        {solicitation.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground truncate">
                            {solicitation.name}
                          </p>
                          {getStatusBadge(solicitation.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{solicitation.subject || solicitation.route || 'Contato geral'}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(solicitation.createdAt)}</p>
                        <div className="flex items-center gap-1">
                          <button 
                            className="p-2 text-muted-foreground group-hover:text-ocean-teal transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-muted-foreground group-hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                            title="Excluir"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm(`Excluir solicitação de ${solicitation.name}?`)) {
                                await remove(solicitation.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Cards */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 min-w-0">
          {/* Backend Status */}
          <motion.div variants={itemVariants}>
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 w-full">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 md:px-6">
                <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-ocean-teal flex-shrink-0" />
                  <span className="truncate">Status do Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 px-3 sm:px-4 md:px-6">
                {backendServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      {getServiceStatusIcon(service.status)}
                      <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground bg-muted dark:bg-slate-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md flex-shrink-0">
                      {service.latency}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Routes */}
          <motion.div variants={itemVariants}>
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 w-full">
              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 md:px-6">
                <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Ship className="w-4 h-4 sm:w-5 sm:h-5 text-ocean-teal flex-shrink-0" />
                  <span className="truncate">Roteiros Populares</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
                {popularRoutes.map((route, index) => (
                  <motion.div 
                    key={route.name} 
                    className="space-y-1.5 sm:space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="font-medium text-foreground truncate min-w-0">
                        {route.name}
                      </span>
                      <span className="text-muted-foreground flex-shrink-0 text-[10px] sm:text-xs">{route.bookings} reservas</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${route.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${route.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full">
        {/* Weekly Summary */}
        <motion.div variants={itemVariants} className="min-w-0">
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 w-full">
            <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Visão Semanal</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Resumo de atividades dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6">
              <div className="h-40 sm:h-48 md:h-56 lg:h-64 flex flex-col items-center justify-center text-center">
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-muted-foreground/50 mb-2 sm:mb-4" />
                <p className="text-sm sm:text-base md:text-lg font-medium text-foreground">Gráfico em Construção</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 max-w-xs px-2">
                  Os gráficos de tendência serão exibidos quando houver dados suficientes coletados ao longo do tempo.
                </p>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border dark:border-slate-700 w-full justify-center flex-wrap">
                  <div className="text-center px-1 sm:px-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{dashboardStats?.solicitations.total || 0}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Solicitações</p>
                  </div>
                  <div className="text-center px-1 sm:px-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">{dashboardStats?.reservations.total || 0}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Reservas</p>
                  </div>
                  <div className="text-center px-1 sm:px-2">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-violet-600">{dashboardStats?.clients.total || 0}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Clientes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Summary */}
        <motion.div variants={itemVariants} className="min-w-0">
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 w-full">
            <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Resumo Financeiro</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Receitas e performance do mês</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6">
              <div className="h-auto sm:h-56 md:h-64 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-muted-foreground/50 mb-2 sm:mb-4" />
                  <div className="space-y-3 sm:space-y-4 w-full">
                    <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg sm:rounded-xl">
                      <p className="text-xs sm:text-sm text-muted-foreground">Receita do Mês</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
                        {formatCurrency(dashboardStats?.reservations.monthRevenue || 0)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="p-2 sm:p-3 bg-muted dark:bg-slate-800 rounded-lg sm:rounded-xl">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Receita Total</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-foreground truncate">
                          {formatCurrency(dashboardStats?.reservations.totalRevenue || 0)}
                        </p>
                      </div>
                      <div className="p-2 sm:p-3 bg-muted dark:bg-slate-800 rounded-lg sm:rounded-xl">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Reservas Pagas</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-foreground">
                          {dashboardStats?.reservations.completed || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
