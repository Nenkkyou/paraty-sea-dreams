import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Ship,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Stats Cards Data
const statsCards = [
  {
    title: "Solicitações",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: MessageSquare,
    color: "from-blue-500 to-blue-600",
    description: "Este mês",
  },
  {
    title: "Reservas Confirmadas",
    value: "18",
    change: "+8%",
    trend: "up",
    icon: Calendar,
    color: "from-green-500 to-green-600",
    description: "Este mês",
  },
  {
    title: "Clientes Novos",
    value: "156",
    change: "+23%",
    trend: "up",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    description: "Este mês",
  },
  {
    title: "Receita",
    value: "R$ 45.890",
    change: "-5%",
    trend: "down",
    icon: DollarSign,
    color: "from-orange-500 to-orange-600",
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
  { name: "Resend Email", status: "warning", latency: "156ms" },
];

// Popular Routes
const popularRoutes = [
  { name: "Ilha Grande", bookings: 45, percentage: 85 },
  { name: "Praias de Paraty", bookings: 38, percentage: 72 },
  { name: "Saco do Mamanguá", bookings: 28, percentage: 53 },
  { name: "Pôr do Sol", bookings: 22, percentage: 42 },
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
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
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "offline":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const AdminDashboard = () => {
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
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Bem-vindo de volta! Aqui está o resumo do seu negócio.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Última atualização: agora</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-400">{stat.description}</span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
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
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Solicitações Recentes</CardTitle>
                <CardDescription>Últimas solicitações de contato e reservas</CardDescription>
              </div>
              <button className="text-sm text-ocean-teal hover:text-ocean-navy font-medium flex items-center gap-1">
                Ver todas
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-medium text-sm">
                      {request.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {request.client}
                        </p>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{request.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{request.date}</p>
                      <button className="mt-1 text-ocean-teal hover:text-ocean-navy">
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
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-ocean-teal" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {backendServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getServiceStatusIcon(service.status)}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{service.latency}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular Routes */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Ship className="w-5 h-5 text-ocean-teal" />
                  Roteiros Populares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularRoutes.map((route) => (
                  <div key={route.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {route.name}
                      </span>
                      <span className="text-gray-400">{route.bookings} reservas</span>
                    </div>
                    <Progress value={route.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Weekly Chart */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Visão Semanal</CardTitle>
            <CardDescription>Solicitações e reservas dos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center gap-1 h-48 justify-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.requests / 20) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="w-full max-w-[30px] bg-gradient-to-t from-ocean-navy to-ocean-teal rounded-t-md"
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.bookings / 20) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className="w-full max-w-[30px] bg-gradient-to-t from-green-500 to-green-400 rounded-t-md"
                    />
                  </div>
                  <span className="text-xs text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-ocean-navy to-ocean-teal" />
                <span className="text-sm text-gray-500">Solicitações</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400" />
                <span className="text-sm text-gray-500">Reservas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
