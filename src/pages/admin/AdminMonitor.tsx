import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case "online":
      return "text-green-500";
    case "warning":
      return "text-yellow-500";
    case "offline":
      return "text-red-500";
    case "checking":
      return "text-blue-500";
  }
};

const getStatusBgColor = (status: ServiceStatus) => {
  switch (status) {
    case "online":
      return "bg-green-100";
    case "warning":
      return "bg-yellow-100";
    case "offline":
      return "bg-red-100";
    case "checking":
      return "bg-blue-100";
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
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
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
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-ocean-teal" />
            Monitor do Sistema
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Acompanhe o status e a saúde de todos os serviços
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            <Clock className="w-4 h-4 inline mr-1" />
            Última verificação: {lastFullCheck.toLocaleTimeString("pt-BR")}
          </div>
          <Button
            onClick={runHealthCheck}
            disabled={isChecking}
            className="bg-ocean-teal hover:bg-ocean-navy"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Verificando..." : "Verificar Agora"}
          </Button>
        </div>
      </div>

      {/* Overall Status Card */}
      <Card className={`border-0 shadow-md ${
        overallStatus === "healthy" 
          ? "bg-gradient-to-r from-green-500 to-green-600" 
          : overallStatus === "warning"
          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
          : "bg-gradient-to-r from-red-500 to-red-600"
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                {overallStatus === "healthy" ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : overallStatus === "warning" ? (
                  <AlertCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">
                  {overallStatus === "healthy"
                    ? "Todos os sistemas operacionais"
                    : overallStatus === "warning"
                    ? "Alguns serviços com alerta"
                    : "Serviços com problemas"}
                </h2>
                <p className="opacity-90">
                  {onlineCount} online • {warningCount} com alerta • {offlineCount} offline
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-white">
              <div className="text-center">
                <p className="text-3xl font-bold">99.9%</p>
                <p className="text-sm opacity-75">Uptime Médio</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">45ms</p>
                <p className="text-sm opacity-75">Latência Média</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status);
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${getStatusBgColor(service.status)} flex items-center justify-center`}>
                      <service.icon className={`w-6 h-6 ${getStatusColor(service.status)}`} />
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(service.status)}`}>
                      <StatusIcon className={`w-4 h-4 ${service.status === "checking" ? "animate-spin" : ""}`} />
                      <span className="text-sm font-medium capitalize">
                        {service.status === "checking" ? "Verificando..." : service.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{service.latency}ms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{service.uptime}%</span>
                      </div>
                      <span className="text-gray-400 text-xs">{service.lastCheck}</span>
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
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-ocean-teal" />
              Recursos do Sistema
            </CardTitle>
            <CardDescription>Uso atual dos recursos do servidor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  CPU
                </span>
                <span className="font-medium">{systemMetrics.cpu}%</span>
              </div>
              <Progress value={systemMetrics.cpu} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-purple-500" />
                  Memória
                </span>
                <span className="font-medium">{systemMetrics.memory}%</span>
              </div>
              <Progress value={systemMetrics.memory} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-green-500" />
                  Armazenamento
                </span>
                <span className="font-medium">{systemMetrics.storage}%</span>
              </div>
              <Progress value={systemMetrics.storage} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-orange-500" />
                  Bandwidth
                </span>
                <span className="font-medium">{systemMetrics.bandwidth}%</span>
              </div>
              <Progress value={systemMetrics.bandwidth} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-ocean-teal" />
              Eventos Recentes
            </CardTitle>
            <CardDescription>Últimas atividades do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="mt-0.5">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {event.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <RefreshCw className="w-5 h-5" />
              <span>Reiniciar Cache</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Database className="w-5 h-5" />
              <span>Backup Manual</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Shield className="w-5 h-5" />
              <span>Verificar Segurança</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Mail className="w-5 h-5" />
              <span>Testar Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminMonitor;
