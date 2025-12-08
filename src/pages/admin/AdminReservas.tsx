import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  Eye,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Users,
  MapPin,
  Ship,
  CalendarDays,
  DollarSign,
  Filter,
  Anchor,
  Sun,
  Sunset,
  Loader2,
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
import { useReservations } from "@/hooks/useReservations";
import { Reservation } from "@/types";
import { Timestamp } from "firebase/firestore";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/40">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-0 hover:bg-blue-100 dark:hover:bg-blue-900/40">
          <Ship className="w-3 h-3 mr-1" />
          Em Andamento
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300 border-0 hover:bg-slate-100 dark:hover:bg-slate-700/40">
          <Anchor className="w-3 h-3 mr-1" />
          Concluído
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-0 hover:bg-red-100 dark:hover:bg-red-900/40">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelado
        </Badge>
      );
    default:
      return null;
  }
};

const getPaymentBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0">Pago</Badge>;
    case "partial":
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0">Parcial</Badge>;
    case "pending":
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-0">Pendente</Badge>;
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

const getRouteIcon = (route: string) => {
  if (route.toLowerCase().includes("pôr do sol") || route.toLowerCase().includes("sunset")) {
    return <Sunset className="w-4 h-4" />;
  }
  return <Sun className="w-4 h-4" />;
};

// Helper para formatar datas do Firestore
const formatDateFromTimestamp = (date: Timestamp | string | undefined) => {
  if (!date) return '-';
  const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateObj);
};

const AdminReservas = () => {
  // Usar dados reais do Firestore
  const { 
    reservations, 
    stats: firestoreStats, 
    loading, 
    refresh,
    confirm,
    cancel,
    complete,
  } = useReservations();
  
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchesStatus = filterStatus === "all" || res.status === filterStatus;
      const matchesPayment = filterPayment === "all" || res.paymentStatus === filterPayment;
      const matchesSearch = 
        res.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.routeName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [reservations, filterStatus, filterPayment, searchQuery]);

  const stats = firestoreStats || {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    pending: reservations.filter(r => r.status === "pending").length,
    completed: reservations.filter(r => r.status === "completed").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length,
    todayCount: 0,
    weekCount: 0,
    monthCount: reservations.length,
    totalRevenue: reservations.filter(r => r.paymentStatus === "paid").reduce((acc, r) => acc + r.totalAmount, 0),
    monthRevenue: 0,
  };

  // Group reservations by date for calendar view
  const upcomingReservations = useMemo(() => {
    return reservations
      .filter(r => r.status === "confirmed" || r.status === "pending")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [reservations]);

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md dark:shadow-none">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Reservas
          </h1>
          <p className="text-muted-foreground mt-1">
            Passeios confirmados vindos das solicitações aprovadas
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-blue-50 dark:bg-blue-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md dark:shadow-none shrink-0">
                <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-emerald-50 dark:bg-emerald-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md dark:shadow-none shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.confirmed}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Confirmados</p>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md dark:shadow-none shrink-0">
                <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.inProgress}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Em Andamento</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-slate-50 dark:bg-slate-800/30 hover:shadow-md transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-md dark:shadow-none">
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Concluídos</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-violet-50 dark:bg-violet-950/30 hover:shadow-md transition-all col-span-2 md:col-span-1">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md dark:shadow-none">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Receita Paga</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservations List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, roteiro ou embarcação..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPayment} onValueChange={setFilterPayment}>
                    <SelectTrigger className="w-36 bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                      <SelectItem value="partial">Parcial</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservations Cards */}
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-border dark:divide-slate-800">
                <AnimatePresence>
                  {filteredReservations.map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setIsDetailOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Date Badge */}
                        <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-navy to-ocean-teal text-white shadow-md dark:shadow-none">
                          <span className="text-lg font-bold leading-none">{new Date(reservation.date).getDate()}</span>
                          <span className="text-xs uppercase">{new Date(reservation.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{reservation.clientName}</span>
                            {getStatusBadge(reservation.status)}
                            {getPaymentBadge(reservation.paymentStatus)}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {getRouteIcon(reservation.routeName)}
                            <span className="text-sm font-medium text-foreground/80">{reservation.routeName}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {reservation.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {reservation.guests} pessoas
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                              <DollarSign className="w-3 h-3" />
                              {formatCurrency(reservation.totalAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 hover:bg-muted dark:hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="w-4 h-4 mr-2" />
                                Ligar para cliente
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Ship className="w-4 h-4 mr-2" />
                                Iniciar passeio
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancelar reserva
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
                  Mostrando <span className="font-semibold text-foreground">{filteredReservations.length}</span> de <span className="font-semibold text-foreground">{reservations.length}</span> reservas
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" disabled className="dark:hover:bg-slate-700">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 border-0 shadow-md">
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

        {/* Sidebar - Upcoming */}
        <div className="space-y-6">
          {/* Upcoming Reservations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <CalendarDays className="w-5 h-5 text-ocean-teal" />
                  Próximos Passeios
                </CardTitle>
                <CardDescription>Reservas agendadas para os próximos dias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingReservations.map((res, index) => (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedReservation(res);
                      setIsDetailOpen(true);
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-navy to-ocean-teal flex flex-col items-center justify-center text-white text-xs shadow-md">
                      <span className="font-bold leading-none">{new Date(res.date).getDate()}</span>
                      <span className="uppercase text-[8px]">{new Date(res.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{res.clientName}</p>
                      <p className="text-xs text-muted-foreground truncate">{res.routeName} • {res.time}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      {res.guests}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <MapPin className="w-5 h-5 text-ocean-teal" />
                  Roteiros Mais Reservados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Ilha Grande", count: 3, color: "from-cyan-400 to-blue-500" },
                  { name: "Praias de Paraty", count: 2, color: "from-teal-400 to-cyan-500" },
                  { name: "Pôr do Sol", count: 1, color: "from-orange-400 to-amber-500" },
                ].map((route, index) => (
                  <div key={route.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{route.name}</span>
                      <span className="text-muted-foreground">{route.count} reservas</span>
                    </div>
                    <div className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${route.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(route.count / 3) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Reservation Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card dark:bg-slate-900 border-border dark:border-slate-700">
          {selectedReservation && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex flex-col items-center justify-center text-white shadow-md dark:shadow-none shrink-0">
                    <span className="text-lg md:text-xl font-bold leading-none">{new Date(selectedReservation.date).getDate()}</span>
                    <span className="text-[10px] md:text-xs uppercase">{new Date(selectedReservation.date).toLocaleString('pt-BR', { month: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-lg md:text-xl text-foreground truncate">{selectedReservation.clientName}</DialogTitle>
                    <DialogDescription className="flex flex-wrap items-center gap-2 mt-1">
                      {getStatusBadge(selectedReservation.status)}
                      {getPaymentBadge(selectedReservation.paymentStatus)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Reservation Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Roteiro</p>
                      <p className="text-sm font-medium text-foreground">{selectedReservation.routeName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Horário</p>
                      <p className="text-sm font-medium text-foreground">{selectedReservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Passageiros</p>
                      <p className="text-sm font-medium text-foreground">{selectedReservation.guests} pessoas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Valor Total</p>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(selectedReservation.totalAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                      <p className="text-sm font-medium text-foreground">{selectedReservation.clientPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedReservation.notes && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Observações</h4>
                    <p className="text-muted-foreground bg-muted dark:bg-slate-800 p-4 rounded-xl border border-border/50 dark:border-slate-700">
                      {selectedReservation.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {selectedReservation.status === "confirmed" && (
                    <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg">
                      <Ship className="w-4 h-4 mr-2" />
                      Iniciar Passeio
                    </Button>
                  )}
                  {selectedReservation.status === "in_progress" && (
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                      <Anchor className="w-4 h-4 mr-2" />
                      Concluir Passeio
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800">
                    <Phone className="w-4 h-4 mr-2" />
                    Contatar Cliente
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

export default AdminReservas;
