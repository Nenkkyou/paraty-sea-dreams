import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Eye,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  Ship,
  Clock,
  Crown,
  Award,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for clients with confirmed trips
const mockClients = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(24) 99999-1234",
    totalTrips: 5,
    totalSpent: 8500,
    lastTrip: "2025-12-07",
    firstTrip: "2024-06-15",
    favoriteRoute: "Ilha Grande",
    status: "vip",
    rating: 5,
    trips: [
      { date: "2025-12-07", route: "Ilha Grande", guests: 8, value: 2400 },
      { date: "2025-11-20", route: "Pôr do Sol", guests: 4, value: 1200 },
      { date: "2025-10-05", route: "Praias de Paraty", guests: 6, value: 1800 },
      { date: "2025-08-12", route: "Ilha Grande", guests: 4, value: 1600 },
      { date: "2024-06-15", route: "Saco do Mamanguá", guests: 5, value: 1500 },
    ],
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(24) 98888-5678",
    totalTrips: 3,
    totalSpent: 4200,
    lastTrip: "2025-11-15",
    firstTrip: "2025-03-22",
    favoriteRoute: "Pôr do Sol",
    status: "regular",
    rating: 5,
    trips: [
      { date: "2025-11-15", route: "Pôr do Sol", guests: 6, value: 1800 },
      { date: "2025-07-20", route: "Pôr do Sol", guests: 4, value: 1200 },
      { date: "2025-03-22", route: "Praias de Paraty", guests: 4, value: 1200 },
    ],
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro@empresa.com.br",
    phone: "(24) 97777-9012",
    totalTrips: 2,
    totalSpent: 2700,
    lastTrip: "2025-12-06",
    firstTrip: "2025-09-10",
    favoriteRoute: "Praias de Paraty",
    status: "regular",
    rating: 4,
    trips: [
      { date: "2025-12-06", route: "Praias de Paraty", guests: 4, value: 1200 },
      { date: "2025-09-10", route: "Saco do Mamanguá", guests: 5, value: 1500 },
    ],
  },
  {
    id: 4,
    name: "Fernanda Lima",
    email: "fernanda@email.com",
    phone: "(24) 94444-1234",
    totalTrips: 4,
    totalSpent: 6800,
    lastTrip: "2025-12-04",
    firstTrip: "2024-12-20",
    favoriteRoute: "Ilha Grande",
    status: "vip",
    rating: 5,
    trips: [
      { date: "2025-12-04", route: "Pôr do Sol", guests: 6, value: 1800 },
      { date: "2025-08-15", route: "Ilha Grande", guests: 8, value: 2400 },
      { date: "2025-04-10", route: "Ilha Grande", guests: 6, value: 1800 },
      { date: "2024-12-20", route: "Praias de Paraty", guests: 3, value: 800 },
    ],
  },
  {
    id: 5,
    name: "Roberto Alves",
    email: "roberto@gmail.com",
    phone: "(21) 98765-4321",
    totalTrips: 1,
    totalSpent: 3500,
    lastTrip: "2025-12-05",
    firstTrip: "2025-12-05",
    favoriteRoute: "Saco do Mamanguá",
    status: "new",
    rating: 5,
    trips: [
      { date: "2025-12-05", route: "Saco do Mamanguá", guests: 10, value: 3500 },
    ],
  },
  {
    id: 6,
    name: "Mariana Costa",
    email: "mariana@hotmail.com",
    phone: "(24) 91234-5678",
    totalTrips: 2,
    totalSpent: 2700,
    lastTrip: "2025-12-01",
    firstTrip: "2025-06-18",
    favoriteRoute: "Ilha Grande",
    status: "regular",
    rating: 4,
    trips: [
      { date: "2025-12-01", route: "Ilha Grande", guests: 5, value: 1500 },
      { date: "2025-06-18", route: "Praias de Paraty", guests: 4, value: 1200 },
    ],
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "vip":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0">
          <Crown className="w-3 h-3 mr-1" />
          VIP
        </Badge>
      );
    case "regular":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-0">
          <UserCheck className="w-3 h-3 mr-1" />
          Regular
        </Badge>
      );
    case "new":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0">
          <Star className="w-3 h-3 mr-1" />
          Novo
        </Badge>
      );
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const AdminClientes = () => {
  const [clients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredClients = clients.filter(client => {
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: clients.length,
    vip: clients.filter(c => c.status === "vip").length,
    regular: clients.filter(c => c.status === "regular").length,
    newClients: clients.filter(c => c.status === "new").length,
    totalRevenue: clients.reduce((acc, c) => acc + c.totalSpent, 0),
    totalTrips: clients.reduce((acc, c) => acc + c.totalTrips, 0),
  };

  // Top clients by spending
  const topClients = [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Clientes com passeios confirmados e histórico de viagens
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-card dark:bg-slate-800 border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 text-foreground"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" className="bg-card dark:bg-slate-800 border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 text-foreground">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-violet-50 dark:bg-violet-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total de Clientes</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-amber-50 dark:bg-amber-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shrink-0">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.vip}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Clientes VIP</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-cyan-50 dark:bg-cyan-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shrink-0">
                <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalTrips}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Passeios</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-emerald-50 dark:bg-emerald-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Receita Total</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="new">Novo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Clients Cards */}
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border dark:divide-slate-800">
                <AnimatePresence>
                  {filteredClients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsDetailOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                            {client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          {client.status === "vip" && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{client.name}</span>
                            {getStatusBadge(client.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1 bg-muted dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              <Ship className="w-3 h-3" />
                              {client.totalTrips} {client.totalTrips === 1 ? "passeio" : "passeios"}
                            </span>
                            <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                              <DollarSign className="w-3 h-3" />
                              {formatCurrency(client.totalSpent)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Favorito: {client.favoriteRoute}
                            </span>
                          </div>
                        </div>

                        {/* Last trip & Actions */}
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-muted-foreground">Último passeio</p>
                            <p className="text-sm font-medium text-foreground">{formatDate(client.lastTrip)}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 hover:bg-muted dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver perfil completo
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="w-4 h-4 mr-2" />
                                Ligar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Crown className="w-4 h-4 mr-2" />
                                Promover a VIP
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border dark:border-slate-800 bg-muted/30 dark:bg-slate-800/30">
                <p className="text-sm text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{filteredClients.length}</span> de <span className="font-semibold text-foreground">{clients.length}</span> clientes
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" disabled className="dark:hover:bg-slate-700">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 border-0 shadow-md">
                    1
                  </Button>
                  <Button variant="ghost" size="sm" className="dark:hover:bg-slate-700">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Award className="w-5 h-5 text-amber-500" />
                  Top Clientes
                </CardTitle>
                <CardDescription>Por valor total gasto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedClient(client);
                      setIsDetailOpen(true);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" :
                      index === 1 ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300" :
                      index === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.totalTrips} passeios</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(client.totalSpent)}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Client Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-ocean-teal" />
                  Distribuição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Crown className="w-4 h-4 text-amber-500" />
                      VIP
                    </span>
                    <span className="text-muted-foreground">{stats.vip} clientes</span>
                  </div>
                  <div className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.vip / stats.total) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <UserCheck className="w-4 h-4 text-blue-500" />
                      Regular
                    </span>
                    <span className="text-muted-foreground">{stats.regular} clientes</span>
                  </div>
                  <div className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.regular / stats.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <Star className="w-4 h-4 text-emerald-500" />
                      Novo
                    </span>
                    <span className="text-muted-foreground">{stats.newClients} clientes</span>
                  </div>
                  <div className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stats.newClients / stats.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Client Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-card dark:bg-slate-900 border-border dark:border-slate-700">
          {selectedClient && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {selectedClient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    {selectedClient.status === "vip" && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-xl text-foreground">{selectedClient.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedClient.status)}
                      <span className="flex items-center gap-1">
                        {[...Array(selectedClient.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Contact & Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-foreground truncate">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm text-foreground">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center">
                      <Ship className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total de passeios</p>
                      <p className="text-sm font-medium text-foreground">{selectedClient.totalTrips}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Valor total</p>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(selectedClient.totalSpent)}</p>
                    </div>
                  </div>
                </div>

                {/* Trip History */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ocean-teal" />
                    Histórico de Passeios
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedClient.trips.map((trip, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-navy to-ocean-teal flex flex-col items-center justify-center text-white text-xs shadow-md">
                          <span className="font-bold leading-none">{new Date(trip.date).getDate()}</span>
                          <span className="uppercase text-[8px]">{new Date(trip.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{trip.route}</p>
                          <p className="text-xs text-muted-foreground">{trip.guests} pessoas</p>
                        </div>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(trip.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cliente desde</p>
                      <p className="text-sm font-medium text-foreground">{formatDate(selectedClient.firstTrip)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Roteiro favorito</p>
                      <p className="text-sm font-medium text-foreground">{selectedClient.favoriteRoute}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </Button>
                  <Button variant="outline" className="flex-1 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminClientes;
