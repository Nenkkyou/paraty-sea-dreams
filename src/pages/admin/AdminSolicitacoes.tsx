import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Trash2,
  Reply,
  Star,
  StarOff,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSolicitations } from "@/hooks/useSolicitations";
import { Solicitation } from "@/types";
import { Timestamp } from "firebase/firestore";
import { sendReplyEmail } from "@/services/emailService";
import { toast } from "sonner";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0 hover:bg-amber-100 dark:hover:bg-amber-900/40">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    case "responded":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-0 hover:bg-blue-100 dark:hover:bg-blue-900/40">
          <Reply className="w-3 h-3 mr-1" />
          Respondido
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/40">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
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

const getTypeBadge = (type: string) => {
  switch (type) {
    case "reservation":
      return <Badge variant="outline" className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 border-violet-200 dark:border-violet-800">Reserva</Badge>;
    case "inquiry":
      return <Badge variant="outline" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800">Dúvida</Badge>;
    case "cancellation":
      return <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800">Cancelamento</Badge>;
    default:
      return null;
  }
};

// Helper para formatar datas do Firestore
const formatDate = (date: Timestamp | string | undefined) => {
  if (!date) return '-';
  const dateObj = date instanceof Timestamp ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

const AdminSolicitacoes = () => {
  // Usar dados reais do Firestore
  const { 
    solicitations, 
    stats: firestoreStats, 
    loading, 
    refresh, 
    toggleStar, 
    remove,
    updateStatus,
  } = useSolicitations();
  
  const [selectedRequest, setSelectedRequest] = useState<Solicitation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Estados para resposta de email
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Atualizar assunto quando selecionar uma solicitação
  const handleOpenDetail = (request: Solicitation) => {
    setSelectedRequest(request);
    setReplySubject(`Re: ${request.subject}`);
    setReplyMessage("");
    setIsDetailOpen(true);
  };

  // Enviar resposta por email
  const handleSendReply = async () => {
    if (!selectedRequest || !replyMessage.trim()) {
      toast.error("Digite uma mensagem para enviar");
      return;
    }
    
    setIsSendingReply(true);
    
    try {
      const result = await sendReplyEmail({
        to: selectedRequest.email,
        subject: replySubject,
        message: replyMessage,
      });
      
      if (result.success) {
        toast.success(`Resposta enviada para ${selectedRequest.email}!`);
        // Atualizar status para "respondido"
        await updateStatus(selectedRequest.id, 'responded');
        setReplyMessage("");
        setIsDetailOpen(false);
      } else {
        toast.error(result.error || "Erro ao enviar email");
      }
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleToggleStar = async (id: string, starred: boolean) => {
    try {
      await toggleStar(id, starred);
    } catch (error) {
      console.error('Erro ao alternar estrela:', error);
    }
  };

  const filteredRequests = useMemo(() => {
    return solicitations
      .filter(req => {
        const matchesStatus = filterStatus === "all" || req.status === filterStatus;
        const matchesType = filterType === "all" || req.type === filterType;
        const matchesFavorites = !filterFavorites || req.starred;
        const matchesSearch = 
          req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesType && matchesFavorites && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
  }, [solicitations, filterStatus, filterType, filterFavorites, searchQuery]);

  const stats = firestoreStats || {
    total: solicitations.length,
    pending: solicitations.filter(r => r.status === "pending").length,
    responded: solicitations.filter(r => r.status === "responded").length,
    confirmed: solicitations.filter(r => r.status === "confirmed").length,
  };

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md dark:shadow-none">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Solicitações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as solicitações de contato e reservas
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
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-blue-50 dark:bg-blue-950/30 hover:shadow-md transition-all">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md dark:shadow-none shrink-0">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
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
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md dark:shadow-none">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
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
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md dark:shadow-none">
                <Reply className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.responded}</p>
                <p className="text-sm text-muted-foreground">Respondidos</p>
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
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md dark:shadow-none">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou assunto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700 text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 sm:w-40 shrink-0 text-xs sm:text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="responded">Respondido</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-28 sm:w-40 shrink-0 text-xs sm:text-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="reservation">Reserva</SelectItem>
                  <SelectItem value="inquiry">Dúvida</SelectItem>
                  <SelectItem value="cancellation">Cancelamento</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={filterFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterFavorites(!filterFavorites)}
                className={`shrink-0 ${filterFavorites 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md" 
                  : "bg-card dark:bg-slate-800 border-border dark:border-slate-600 hover:bg-muted dark:hover:bg-slate-700 text-foreground"
                }`}
              >
                <Star className={`w-4 h-4 ${filterFavorites ? "fill-white" : ""}`} />
                <span className="hidden sm:inline ml-2">Favoritos</span>
                {solicitations.filter(r => r.starred).length > 0 && (
                  <span className={`hidden xs:inline ml-1 sm:ml-2 px-1.5 py-0.5 text-xs rounded-full ${filterFavorites ? "bg-white/20" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"}`}>
                    {solicitations.filter(r => r.starred).length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border dark:divide-slate-800">
            <AnimatePresence>
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group ${
                    request.status === "pending" ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                  }`}
                  onClick={() => handleOpenDetail(request)}
                >
                  <div className="flex items-start gap-4">
                    {/* Star & Avatar */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(request.id!, request.starred);
                        }}
                        className="text-muted-foreground hover:text-amber-500 transition-colors"
                      >
                        {request.starred ? (
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-medium text-sm shadow-md">
                        {request.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{request.name}</span>
                        {getTypeBadge(request.type)}
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm font-medium text-foreground/80 mt-1">{request.subject}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{request.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {request.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.phone}
                        </span>
                      </div>
                    </div>

                    {/* Date & Actions */}
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap bg-muted dark:bg-slate-800 px-2 py-1 rounded-md">
                        {formatDate(request.createdAt)}
                      </span>
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
                            <Reply className="w-4 h-4 mr-2" />
                            Responder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Marcar como confirmado
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 cursor-pointer"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm(`Tem certeza que deseja excluir a solicitação de ${request.name}?`)) {
                                await remove(request.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
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
              Mostrando <span className="font-semibold text-foreground">{filteredRequests.length}</span> de <span className="font-semibold text-foreground">{solicitations.length}</span> solicitações
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled className="dark:hover:bg-slate-700">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-ocean-teal to-cyan-500 text-white hover:from-ocean-navy hover:to-ocean-teal border-0 shadow-md">
                1
              </Button>
              <Button variant="ghost" size="sm" className="dark:hover:bg-slate-700">
                2
              </Button>
              <Button variant="ghost" size="sm" className="dark:hover:bg-slate-700">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card dark:bg-slate-900 border-border dark:border-slate-700">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-semibold text-base md:text-lg shadow-md dark:shadow-none shrink-0">
                    {selectedRequest.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-lg md:text-xl text-foreground truncate">{selectedRequest.name}</DialogTitle>
                    <DialogDescription className="flex flex-wrap items-center gap-2 mt-1">
                      {getTypeBadge(selectedRequest.type)}
                      {getStatusBadge(selectedRequest.status)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="w-full bg-muted dark:bg-slate-800 p-1">
                  <TabsTrigger value="details" className="flex-1 text-xs md:text-sm data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700">Detalhes</TabsTrigger>
                  <TabsTrigger value="reply" className="flex-1 text-xs md:text-sm data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700">Responder</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 text-xs md:text-sm data-[state=active]:bg-background dark:data-[state=active]:bg-slate-700">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-foreground truncate">{selectedRequest.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-foreground">{selectedRequest.phone}</span>
                    </div>
                    {selectedRequest.route && (
                      <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="text-sm text-foreground">{selectedRequest.route}</span>
                      </div>
                    )}
                    {selectedRequest.guests && (
                      <div className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <span className="text-sm text-foreground">{selectedRequest.guests} pessoas</span>
                      </div>
                    )}
                  </div>

                  {/* Subject & Message */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground text-lg">{selectedRequest.subject}</h4>
                    <p className="text-muted-foreground bg-muted dark:bg-slate-800 p-4 rounded-xl border border-border/50 dark:border-slate-700 leading-relaxed">
                      {selectedRequest.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirmar Reserva
                    </Button>
                    <Button variant="outline" className="flex-1 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800">
                      <Reply className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="pt-4 border-t border-border dark:border-slate-700">
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                      onClick={async () => {
                        if (window.confirm(`Tem certeza que deseja excluir a solicitação de ${selectedRequest.name}?`)) {
                          await remove(selectedRequest.id);
                          setIsDetailOpen(false);
                          setSelectedRequest(null);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir Solicitação
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reply" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Para: <span className="text-muted-foreground">{selectedRequest.email}</span></label>
                    <Input 
                      placeholder="Assunto da resposta" 
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="bg-background dark:bg-slate-800 border-border dark:border-slate-700" 
                    />
                  </div>
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[200px] bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                  />
                  <div className="flex gap-3">
                    <Button 
                      className="bg-gradient-to-r from-ocean-teal to-cyan-500 hover:from-ocean-navy hover:to-ocean-teal text-white shadow-lg"
                      onClick={handleSendReply}
                      disabled={isSendingReply || !replyMessage.trim()}
                    >
                      {isSendingReply ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Enviar Resposta
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-800">
                      Salvar Rascunho
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-muted dark:bg-slate-800 rounded-xl border border-border/50 dark:border-slate-700">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Solicitação recebida</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(selectedRequest.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-center py-6">
                      <div className="w-12 h-12 rounded-full bg-muted dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Nenhuma outra atividade registrada
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminSolicitacoes;
