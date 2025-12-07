import { useState } from "react";
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

// Mock data for requests
const mockRequests = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(24) 99999-1234",
    subject: "Passeio para Ilha Grande",
    message: "Olá! Gostaria de saber mais informações sobre o passeio para Ilha Grande. Somos um grupo de 8 pessoas e gostaríamos de fazer no próximo fim de semana. Qual o valor e o que está incluso?",
    type: "reservation",
    status: "pending",
    starred: true,
    date: "2025-12-07T14:30:00",
    route: "Ilha Grande - Full Day",
    guests: 8,
    preferredDate: "2025-12-14",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(24) 98888-5678",
    subject: "Dúvida sobre Charter Particular",
    message: "Boa tarde! Estou interessada em alugar um barco para um evento privado de aniversário. Seria para aproximadamente 20 pessoas. Vocês fazem esse tipo de serviço?",
    type: "inquiry",
    status: "responded",
    starred: false,
    date: "2025-12-07T10:15:00",
    route: null,
    guests: 20,
    preferredDate: null,
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro@empresa.com.br",
    phone: "(24) 97777-9012",
    subject: "Passeio Praias de Paraty",
    message: "Olá, gostaria de fazer uma reserva para o passeio das praias de Paraty para 4 pessoas no dia 20/12. Ainda tem disponibilidade?",
    type: "reservation",
    status: "confirmed",
    starred: true,
    date: "2025-12-06T16:45:00",
    route: "Praias de Paraty",
    guests: 4,
    preferredDate: "2025-12-20",
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@gmail.com",
    phone: "(21) 96666-3456",
    subject: "Cancelamento de reserva",
    message: "Preciso cancelar minha reserva do dia 15/12 devido a um imprevisto. Como proceder?",
    type: "cancellation",
    status: "cancelled",
    starred: false,
    date: "2025-12-05T09:20:00",
    route: "Pôr do Sol",
    guests: 2,
    preferredDate: "2025-12-15",
  },
  {
    id: 5,
    name: "Carlos Mendes",
    email: "carlos.mendes@hotmail.com",
    phone: "(24) 95555-7890",
    subject: "Informações sobre Saco do Mamanguá",
    message: "Bom dia! Vi no site o passeio para o Saco do Mamanguá e fiquei interessado. Quanto tempo dura o passeio e qual a melhor época para ir?",
    type: "inquiry",
    status: "pending",
    starred: false,
    date: "2025-12-05T08:00:00",
    route: null,
    guests: null,
    preferredDate: null,
  },
  {
    id: 6,
    name: "Fernanda Lima",
    email: "fernanda@email.com",
    phone: "(24) 94444-1234",
    subject: "Passeio de Lua Cheia",
    message: "Olá! Vocês fazem passeio na lua cheia? Gostaria de saber as datas disponíveis e valores.",
    type: "inquiry",
    status: "pending",
    starred: true,
    date: "2025-12-04T18:30:00",
    route: null,
    guests: 6,
    preferredDate: null,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      );
    case "responded":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Reply className="w-3 h-3 mr-1" />
          Respondido
        </Badge>
      );
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
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
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Reserva</Badge>;
    case "inquiry":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Dúvida</Badge>;
    case "cancellation":
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Cancelamento</Badge>;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const AdminSolicitacoes = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const toggleStar = (id: number) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, starred: !req.starred } : req
      )
    );
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    const matchesType = filterType === "all" || req.type === filterType;
    const matchesSearch = 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    responded: requests.filter(r => r.status === "responded").length,
    confirmed: requests.filter(r => r.status === "confirmed").length,
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
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-ocean-teal" />
            Solicitações
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gerencie todas as solicitações de contato e reservas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Reply className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.responded}</p>
              <p className="text-sm text-gray-500">Respondidos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-sm text-gray-500">Confirmados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou assunto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="reservation">Reserva</SelectItem>
                  <SelectItem value="inquiry">Dúvida</SelectItem>
                  <SelectItem value="cancellation">Cancelamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    request.status === "pending" ? "bg-yellow-50/50" : ""
                  }`}
                  onClick={() => {
                    setSelectedRequest(request);
                    setIsDetailOpen(true);
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Star & Avatar */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(request.id);
                        }}
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        {request.starred ? (
                          <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="w-5 h-5" />
                        )}
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-medium text-sm">
                        {request.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{request.name}</span>
                        {getTypeBadge(request.type)}
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-1">{request.subject}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{request.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
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
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(request.date)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
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
                          <DropdownMenuItem className="text-red-600">
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
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Mostrando {filteredRequests.length} de {requests.length} solicitações
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-ocean-teal text-white hover:bg-ocean-navy">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-navy to-ocean-teal flex items-center justify-center text-white font-medium">
                    {selectedRequest.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedRequest.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      {getTypeBadge(selectedRequest.type)}
                      {getStatusBadge(selectedRequest.status)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Detalhes</TabsTrigger>
                  <TabsTrigger value="reply" className="flex-1">Responder</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedRequest.email}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedRequest.phone}</span>
                    </div>
                    {selectedRequest.route && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedRequest.route}</span>
                      </div>
                    )}
                    {selectedRequest.guests && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedRequest.guests} pessoas</span>
                      </div>
                    )}
                  </div>

                  {/* Subject & Message */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{selectedRequest.subject}</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedRequest.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-ocean-teal hover:bg-ocean-navy">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirmar Reserva
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Reply className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reply" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Para: {selectedRequest.email}</label>
                    <Input placeholder="Assunto da resposta" defaultValue={`Re: ${selectedRequest.subject}`} />
                  </div>
                  <Textarea
                    placeholder="Digite sua resposta..."
                    className="min-h-[200px]"
                  />
                  <div className="flex gap-2">
                    <Button className="bg-ocean-teal hover:bg-ocean-navy">
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </Button>
                    <Button variant="outline">
                      Salvar Rascunho
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Solicitação recebida</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedRequest.date)}</p>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-400 py-4">
                      Nenhuma outra atividade registrada
                    </p>
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
