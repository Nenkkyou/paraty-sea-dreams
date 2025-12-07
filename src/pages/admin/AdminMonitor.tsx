import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Server,
  Database,
  Cloud,
  Mail,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Service status types
type ServiceStatus = "online" | "warning" | "offline" | "checking";

interface Service {
  name: string;
  description: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  icon: React.ElementType;
  lastCheck: string;
}

// Mock services data
const initialServices: Service[] = [
  {
    name: "Firebase Authentication",
    description: "Autenticação de usuários",
    status: "online",
    latency: 45,
    uptime: 99.99,
    icon: Shield,
    lastCheck: "Há 1 minuto",
  },
  {
    name: "Cloud Firestore",
    description: "Banco de dados NoSQL",
    status: "online",
    latency: 32,
    uptime: 99.95,
    icon: Database,
    lastCheck: "Há 1 minuto",
  },
  {
    name: "Firebase Storage",
    description: "Armazenamento de arquivos",
    status: "online",
    latency: 28,
    uptime: 99.98,
    icon: Cloud,
    lastCheck: "Há 1 minuto",
  },
  {
    name: "Resend Email",
    description: "Serviço de envio de emails",
    status: "warning",
    latency: 156,
    uptime: 98.5,
    icon: Mail,
    lastCheck: "Há 1 minuto",
  },
  {
    name: "Firebase Hosting",
    description: "Hospedagem do site",
    status: "online",
    latency: 18,
    uptime: 99.99,
    icon: Server,
    lastCheck: "Há 1 minuto",
  },
  {
    name: "API Gateway",
    description: "Gateway de APIs",
    status: "online",
    latency: 52,
    uptime: 99.9,
    icon: Wifi,
    lastCheck: "Há 1 minuto",
  },
];

// System metrics
const systemMetrics = {
  cpu: 23,
  memory: 45,
  storage: 32,
  bandwidth: 68,
};

// Recent events
const recentEvents = [
  {
    type: "success",
    message: "Backup automático concluído com sucesso",
    time: "Há 5 minutos",
  },
  {
    type: "info",
    message: "Nova versão do Firebase SDK disponível",
    time: "Há 1 hora",
  },
  {
    type: "warning",
    message: "Latência alta detectada no Resend",
    time: "Há 2 horas",
  },
  {
    type: "success",
    message: "SSL renovado automaticamente",
    time: "Há 3 horas",
  },
  {
    type: "info",
    message: "Manutenção agendada para 15/12",
    time: "Há 5 horas",
  },
];

// Performance stats
const performanceStats = [
  { label: "Requisições/min", value: "1.2K", change: "+12%", up: true },
  { label: "Tempo de resposta", value: "45ms", change: "-8%", up: true },
  { label: "Taxa de erro", value: "0.02%", change: "-15%", up: true },
  { label: "Usuários online", value: "34", change: "+5", up: true },
];

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case "online":
      return "text-emerald-500 dark:text-emerald-400";
    case "warning":
      return "text-amber-500 dark:text-amber-400";
    case "offline":
      return "text-red-500 dark:text-red-400";
    case "checking":
      return "text-blue-500 dark:text-blue-400";
  }
};

const getStatusBgColor = (status: ServiceStatus) => {
  switch (status) {
    case "online":
      return "bg-emerald-100 dark:bg-emerald-900/40";
    case "warning":
      return "bg-amber-100 dark:bg-amber-900/40";
    case "offline":
      return "bg-red-100 dark:bg-red-900/40";
    case "checking":
      return "bg-blue-100 dark:bg-blue-900/40";
  }
};

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case "online":
      return CheckCircle2;
    case "warning":
      return AlertCircle;
    case "offline":
      return XCircle;
    case "checking":
      return RefreshCw;
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Activity className="w-4 h-4 text-blue-500" />;
  }
};

const AdminMonitor = () => {
  const [services, setServices] = useState(initialServices);
  const [isChecking, setIsChecking] = useState(false);
  const [lastFullCheck, setLastFullCheck] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastFullCheck(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const runHealthCheck = async () => {
    setIsChecking(true);
    
    // Set all services to checking
    setServices(prev =>
      prev.map(service => ({ ...service, status: "checking" as ServiceStatus }))
    );

    // Simulate checking each service
    for (let i = 0; i < services.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setServices(prev =>
        prev.map((service, index) => {
          if (index === i) {
            // Randomly assign status for demo (mostly online)
            const random = Math.random();
            let newStatus: ServiceStatus = "online";
            if (random > 0.95) newStatus = "offline";
            else if (random > 0.85) newStatus = "warning";
            
            return {
              ...service,
              status: newStatus,
              latency: Math.floor(Math.random() * 100) + 20,
              lastCheck: "Agora",
            };
          }
          return service;
        })
      );
    }

    setIsChecking(false);
    setLastFullCheck(new Date());
  };

  const onlineCount = services.filter(s => s.status === "online").length;
  const warningCount = services.filter(s => s.status === "warning").length;
  const offlineCount = services.filter(s => s.status === "offline").length;

  const overallStatus = offlineCount > 0 ? "degraded" : warningCount > 0 ? "warning" : "healthy";

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
              <Activity className="w-5 h-5 text-white" />
            </div>
            Monitor do Sistema
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o status e a saúde de todos os serviços
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-border dark:border-slate-700">
            <Clock className="w-4 h-4" />
            <span>Atualizado: {lastFullCheck.toLocaleTimeString("pt-BR")}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`${autoRefresh ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-card dark:bg-slate-800 border-border dark:border-slate-600"}`}
          >
            <RefreshCw className={`w-4 h-4 md:mr-2 ${autoRefresh ? "animate-spin-slow" : ""}`} />
            <span className="hidden md:inline">Auto</span>
          </Button>
          <Button
            onClick={runHealthCheck}
            disabled={isChecking}
            size="sm"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 md:mr-2 ${isChecking ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">{isChecking ? "Verificando..." : "Verificar Agora"}</span>
            <span className="md:hidden">{isChecking ? "..." : "Verificar"}</span>
          </Button>
        </div>
      </div>

      {/* Overall Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`border-0 shadow-xl overflow-hidden ${
          overallStatus === "healthy" 
            ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" 
            : overallStatus === "warning"
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"
            : "bg-gradient-to-r from-red-500 via-rose-500 to-pink-500"
        }`}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  {overallStatus === "healthy" ? (
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  ) : overallStatus === "warning" ? (
                    <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  ) : (
                    <XCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  )}
                </div>
                <div className="text-white">
                  <h2 className="text-lg md:text-2xl font-bold">
                    {overallStatus === "healthy"
                      ? "Todos os sistemas operacionais"
                      : overallStatus === "warning"
                      ? "Alguns serviços com alerta"
                      : "Serviços com problemas"}
                  </h2>
                  <p className="opacity-90 mt-1 flex flex-wrap items-center gap-2 md:gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                      {onlineCount} online
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
                      {warningCount} alertas
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-300"></span>
                      {offlineCount} offline
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-around md:justify-end gap-4 md:gap-10 text-white pt-2 md:pt-0 border-t md:border-0 border-white/20">
                <div className="text-center">
                  <p className="text-2xl md:text-4xl font-bold">99.9%</p>
                  <p className="text-xs md:text-sm opacity-75 mt-1">Uptime Médio</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-4xl font-bold">45ms</p>
                  <p className="text-xs md:text-sm opacity-75 mt-1">Latência Média</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.05 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Badge className={`${stat.up ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"} border-0`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status);
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 hover:shadow-lg transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${getStatusBgColor(service.status)} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <service.icon className={`w-6 h-6 ${getStatusColor(service.status)}`} />
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getStatusBgColor(service.status)}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${getStatusColor(service.status)} ${service.status === "checking" ? "animate-spin" : ""}`} />
                      <span className={`text-xs font-medium capitalize ${getStatusColor(service.status)}`}>
                        {service.status === "checking" ? "Verificando..." : service.status === "online" ? "Online" : service.status === "warning" ? "Alerta" : "Offline"}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  <div className="mt-4 pt-4 border-t border-border dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-muted-foreground">{service.latency}ms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-muted-foreground">{service.uptime}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{service.lastCheck}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* System Metrics & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Resources */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                Recursos do Sistema
              </CardTitle>
              <CardDescription>Uso atual dos recursos do servidor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <Cpu className="w-4 h-4 text-blue-500" />
                    CPU
                  </span>
                  <span className="font-semibold text-foreground">{systemMetrics.cpu}%</span>
                </div>
                <div className="relative">
                  <Progress value={systemMetrics.cpu} className="h-2.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <Server className="w-4 h-4 text-purple-500" />
                    Memória
                  </span>
                  <span className="font-semibold text-foreground">{systemMetrics.memory}%</span>
                </div>
                <div className="relative">
                  <Progress value={systemMetrics.memory} className="h-2.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <HardDrive className="w-4 h-4 text-emerald-500" />
                    Armazenamento
                  </span>
                  <span className="font-semibold text-foreground">{systemMetrics.storage}%</span>
                </div>
                <div className="relative">
                  <Progress value={systemMetrics.storage} className="h-2.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <Wifi className="w-4 h-4 text-orange-500" />
                    Bandwidth
                  </span>
                  <span className="font-semibold text-foreground">{systemMetrics.bandwidth}%</span>
                </div>
                <div className="relative">
                  <Progress value={systemMetrics.bandwidth} className="h-2.5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                Eventos Recentes
              </CardTitle>
              <CardDescription>Últimas atividades do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {recentEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 dark:bg-slate-800/50 hover:bg-muted dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-border dark:hover:border-slate-700"
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-background dark:bg-slate-900">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {event.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Ações Rápidas
            </CardTitle>
            <CardDescription>Operações comuns de manutenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-5 flex flex-col gap-2 bg-card dark:bg-slate-800 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-5 h-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Reiniciar Cache</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-5 flex flex-col gap-2 bg-card dark:bg-slate-800 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Backup Manual</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-5 flex flex-col gap-2 bg-card dark:bg-slate-800 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-700 hover:border-violet-500 dark:hover:border-violet-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Verificar Segurança</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-5 flex flex-col gap-2 bg-card dark:bg-slate-800 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-foreground font-medium">Testar Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminMonitor;
