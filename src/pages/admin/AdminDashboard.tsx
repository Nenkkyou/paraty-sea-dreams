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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Stats Cards Data
const statsCards = [
  {
    title: "Solicitações",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/50",
    description: "Este mês",
  },
  {
    title: "Reservas Confirmadas",
    value: "18",
    change: "+8%",
    trend: "up",
    icon: Calendar,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/50",
    description: "Este mês",
  },
  {
    title: "Clientes Novos",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: Users,
    gradient: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/50",
    description: "Este mês",
  },
  {
    title: "Receita",
    value: "R$ 45.890",
    change: "-5%",
    trend: "down",
    icon: DollarSign,
    gradient: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/50",
    description: "Este mês",
  },
];

// Recent Requests Data
const recentRequests = [
  {
    id: 1,
    client: "João Silva",
    email: "joao@email.com",
    type: "Passeio para Ilha Grande",
    status: "pending",
    date: "Há 5 minutos",
    avatar: "JS",
  },
  {
    id: 2,
    client: "Maria Santos",
    email: "maria@email.com",
    type: "Charter Particular",
    status: "confirmed",
    date: "Há 1 hora",
    avatar: "MS",
  },
  {
    id: 3,
    client: "Pedro Oliveira",
    email: "pedro@email.com",
    type: "Passeio Praias",
    status: "pending",
    date: "Há 2 horas",
    avatar: "PO",
  },
  {
    id: 4,
    client: "Ana Costa",
    email: "ana@email.com",
    type: "Festa a Bordo",
    status: "cancelled",
    date: "Há 3 horas",
    avatar: "AC",
  },
  {
    id: 5,
    client: "Carlos Mendes",
    email: "carlos@email.com",
    type: "Passeio Pôr do Sol",
    status: "confirmed",
    date: "Há 4 horas",
    avatar: "CM",
  },
];

// Backend Status
const backendServices = [
  { name: "Firebase Auth", status: "online", latency: "45ms" },
  { name: "Firestore", status: "online", latency: "32ms" },
  { name: "Storage", status: "online", latency: "28ms" },
  { name: "Resend Email", status: "online", latency: "89ms" },
];

// Popular Routes
const popularRoutes = [
  { name: "Ilha Grande", bookings: 45, percentage: 85, color: "from-cyan-400 to-blue-500" },
  { name: "Praias de Paraty", bookings: 38, percentage: 72, color: "from-teal-400 to-cyan-500" },
  { name: "Saco do Mamanguá", bookings: 28, percentage: 53, color: "from-emerald-400 to-teal-500" },
  { name: "Pôr do Sol", bookings: 22, percentage: 42, color: "from-orange-400 to-amber-500" },
];

// Chart data for weekly overview
const weeklyData = [
  { day: "Seg", requests: 4, bookings: 2 },
  { day: "Ter", requests: 6, bookings: 4 },
  { day: "Qua", requests: 8, bookings: 5 },
  { day: "Qui", requests: 5, bookings: 3 },
  { day: "Sex", requests: 12, bookings: 8 },
  { day: "Sáb", requests: 18, bookings: 12 },
  { day: "Dom", requests: 15, bookings: 10 },
];

// Monthly trend data
const monthlyTrend = [
  { month: "Jan", value: 65 },
  { month: "Fev", value: 72 },
  { month: "Mar", value: 85 },
  { month: "Abr", value: 78 },
  { month: "Mai", value: 92 },
  { month: "Jun", value: 100 },
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
  const maxRequests = Math.max(...weeklyData.map(d => d.requests));
  const maxMonthly = Math.max(...monthlyTrend.map(d => d.value));

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
      className="space-y-4 sm:space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Waves className="w-8 h-8 text-ocean-teal" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo de volta! Aqui está o resumo do seu negócio.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card dark:bg-slate-800/50 px-4 py-2 rounded-full border border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Sistema operacional</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className={`relative overflow-hidden border border-border/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 ${stat.bgLight} ${stat.bgDark}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-0.5 text-sm font-semibold px-2 py-0.5 rounded-full ${
                        stat.trend === "up" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" 
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      }`}>
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.description}</span>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shrink-0`}
                  >
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
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
            <CardContent>
              <div className="space-y-2">
                {recentRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-medium text-sm shadow-md">
                      {request.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground truncate">
                          {request.client}
                        </p>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{request.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{request.date}</p>
                      <button className="mt-1 text-muted-foreground group-hover:text-ocean-teal transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Backend Status */}
          <motion.div variants={itemVariants}>
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5 text-ocean-teal" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {backendServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getServiceStatusIcon(service.status)}
                      <span className="text-sm font-medium text-foreground">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-muted dark:bg-slate-800 px-2 py-1 rounded-md">
                      {service.latency}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Routes */}
          <motion.div variants={itemVariants}>
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Ship className="w-5 h-5 text-ocean-teal" />
                  Roteiros Populares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <motion.div 
                    key={route.name} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {route.name}
                      </span>
                      <span className="text-muted-foreground">{route.bookings} reservas</span>
                    </div>
                    <div className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Visão Semanal</CardTitle>
              <CardDescription>Solicitações vs reservas dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-3 px-1 sm:px-2">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-32 sm:h-44">
                      {/* Requests Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.requests / maxRequests) * 100}%` }}
                        transition={{ delay: index * 0.05, duration: 0.6, ease: "easeOut" }}
                        className="w-3 sm:w-5 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md shadow-sm relative group cursor-pointer"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {day.requests} solicitações
                        </div>
                      </motion.div>
                      {/* Bookings Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.bookings / maxRequests) * 100}%` }}
                        transition={{ delay: index * 0.05 + 0.1, duration: 0.6, ease: "easeOut" }}
                        className="w-3 sm:w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md shadow-sm relative group cursor-pointer"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {day.bookings} reservas
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border dark:border-slate-700">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-gradient-to-r from-blue-600 to-cyan-400" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Solicitações</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-gradient-to-r from-emerald-600 to-emerald-400" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Reservas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trend Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Tendência Mensal</CardTitle>
              <CardDescription>Crescimento de reservas nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex flex-col">
                {/* Chart Area */}
                <div className="flex-1 flex items-end justify-between gap-2 px-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full border-t border-dashed border-border/50 dark:border-slate-700/50" />
                    ))}
                  </div>
                  
                  {monthlyTrend.map((month, index) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2 z-10">
                      <div className="w-full flex items-end justify-center h-44">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(month.value / maxMonthly) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.7, ease: "easeOut" }}
                          className="w-full max-w-12 relative group cursor-pointer"
                        >
                          {/* Bar with gradient */}
                          <div className="w-full h-full bg-gradient-to-t from-ocean-navy via-ocean-teal to-cyan-400 dark:from-blue-700 dark:via-cyan-500 dark:to-cyan-300 rounded-t-lg shadow-lg" />
                          
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-ocean-teal/20 to-transparent rounded-t-lg blur-sm" />
                          
                          {/* Value tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-20">
                            {month.value}%
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{month.month}</span>
                    </div>
                  ))}
                </div>
                
                {/* Stats Summary */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-emerald-500">+35%</span> crescimento
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Jun</span> melhor mês
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
