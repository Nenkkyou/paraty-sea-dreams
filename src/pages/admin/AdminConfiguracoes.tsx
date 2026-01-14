import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Building2,
  Bell,
  Mail,
  Globe,
  Palette,
  Lock,
  Save,
  User,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  MessageSquare,
  Instagram,
  Facebook,
  Shield,
  Key,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock company data
const companyData = {
  name: "Paraty Boat",
  email: "contato@paratyboat.com.br",
  phone: "(24) 99999-0000",
  whatsapp: "(24) 99999-0000",
  address: "Marina de Paraty, RJ",
  city: "Paraty",
  state: "RJ",
  cep: "23970-000",
  cnpj: "00.000.000/0001-00",
  instagram: "@paratyboat",
  facebook: "paratyboat",
  website: "www.paratyboat.com.br",
  workingHours: "08:00 - 18:00",
  workingDays: "Segunda a Domingo",
};

// Notification settings
const notificationSettings = {
  emailNewRequest: true,
  emailConfirmedBooking: true,
  emailCancellation: true,
  pushNewRequest: true,
  pushReminders: true,
  whatsappAutoReply: false,
  dailyReport: true,
  weeklyReport: true,
};

const AdminConfiguracoes = () => {
  const [company, setCompany] = useState(companyData);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const settingsSections = [
    { id: "empresa", label: "Empresa", icon: Building2 },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "integrações", label: "Integrações", icon: Globe },
    { id: "seguranca", label: "Segurança", icon: Lock },
    { id: "aparencia", label: "Aparência", icon: Palette },
  ];

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-md dark:shadow-none">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as preferências e configurações do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Salvo com sucesso!</span>
            </motion.div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-ocean-teal to-cyan-500 hover:from-ocean-navy hover:to-ocean-teal text-white shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="bg-card dark:bg-slate-900 border border-border dark:border-slate-700 p-1 h-auto flex flex-wrap justify-start gap-1 overflow-x-auto">
          {settingsSections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-ocean-teal data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md px-3 md:px-4 py-2 text-xs md:text-sm"
            >
              <section.icon className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden xs:inline md:inline">{section.label}</span>
              <span className="xs:hidden md:hidden">{section.label.slice(0, 3)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Empresa Tab */}
        <TabsContent value="empresa" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Company Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-ocean-teal" />
                    Dados da Empresa
                  </CardTitle>
                  <CardDescription>Informações básicas do seu negócio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Nome da Empresa</Label>
                      <Input
                        id="name"
                        value={company.name}
                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-foreground">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={company.cnpj}
                        onChange={(e) => setCompany({ ...company, cnpj: e.target.value })}
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={company.email}
                          onChange={(e) => setCompany({ ...company, email: e.target.value })}
                          className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={company.phone}
                          onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                          className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="text-foreground">WhatsApp</Label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="whatsapp"
                          value={company.whatsapp}
                          onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
                          className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-foreground">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={company.website}
                          onChange={(e) => setCompany({ ...company, website: e.target.value })}
                          className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Address & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-ocean-teal" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">Endereço</Label>
                    <Input
                      id="address"
                      value={company.address}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                      className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-foreground">Cidade</Label>
                      <Input
                        id="city"
                        value={company.city}
                        onChange={(e) => setCompany({ ...company, city: e.target.value })}
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-foreground">Estado</Label>
                      <Input
                        id="state"
                        value={company.state}
                        onChange={(e) => setCompany({ ...company, state: e.target.value })}
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-foreground">CEP</Label>
                      <Input
                        id="cep"
                        value={company.cep}
                        onChange={(e) => setCompany({ ...company, cep: e.target.value })}
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-ocean-teal" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingDays" className="text-foreground">Dias de Funcionamento</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Segunda a Domingo</SelectItem>
                        <SelectItem value="weekdays">Segunda a Sexta</SelectItem>
                        <SelectItem value="weekend">Fins de Semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Abertura</Label>
                      <Input
                        type="time"
                        defaultValue="08:00"
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Fechamento</Label>
                      <Input
                        type="time"
                        defaultValue="18:00"
                        className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-ocean-teal" />
                  Redes Sociais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-foreground">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                      <Input
                        id="instagram"
                        value={company.instagram}
                        onChange={(e) => setCompany({ ...company, instagram: e.target.value })}
                        className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-foreground">Facebook</Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                      <Input
                        id="facebook"
                        value={company.facebook}
                        onChange={(e) => setCompany({ ...company, facebook: e.target.value })}
                        className="pl-10 bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notificações Tab */}
        <TabsContent value="notificacoes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="w-5 h-5 text-ocean-teal" />
                    Notificações por Email
                  </CardTitle>
                  <CardDescription>Configure quais emails você deseja receber</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Novas Solicitações</p>
                      <p className="text-sm text-muted-foreground">Receber email a cada nova solicitação</p>
                    </div>
                    <Switch
                      checked={notifications.emailNewRequest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailNewRequest: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Reservas Confirmadas</p>
                      <p className="text-sm text-muted-foreground">Email quando uma reserva é confirmada</p>
                    </div>
                    <Switch
                      checked={notifications.emailConfirmedBooking}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailConfirmedBooking: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Cancelamentos</p>
                      <p className="text-sm text-muted-foreground">Email quando uma reserva é cancelada</p>
                    </div>
                    <Switch
                      checked={notifications.emailCancellation}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailCancellation: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Push Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-ocean-teal" />
                    Notificações Push
                  </CardTitle>
                  <CardDescription>Notificações no navegador e celular</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Novas Solicitações</p>
                      <p className="text-sm text-muted-foreground">Notificação instantânea no navegador</p>
                    </div>
                    <Switch
                      checked={notifications.pushNewRequest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushNewRequest: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Lembretes de Passeio</p>
                      <p className="text-sm text-muted-foreground">Lembrete 1 dia antes do passeio</p>
                    </div>
                    <Switch
                      checked={notifications.pushReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushReminders: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-ocean-teal" />
                  Relatórios Automáticos
                </CardTitle>
                <CardDescription>Receba relatórios periódicos por email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Relatório Diário</p>
                      <p className="text-sm text-muted-foreground">Resumo das atividades do dia</p>
                    </div>
                    <Switch
                      checked={notifications.dailyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, dailyReport: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700">
                    <div>
                      <p className="font-medium text-foreground">Relatório Semanal</p>
                      <p className="text-sm text-muted-foreground">Resumo completo da semana</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyReport: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Integrações Tab */}
        <TabsContent value="integrações" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Firebase",
                description: "Autenticação e banco de dados",
                status: "connected",
                icon: Shield,
                color: "from-amber-500 to-orange-600",
              },
              {
                name: "Resend",
                description: "Envio de emails",
                status: "connected",
                icon: Mail,
                color: "from-blue-500 to-indigo-600",
              },
              {
                name: "WhatsApp Business",
                description: "Mensagens automáticas",
                status: "pending",
                icon: MessageSquare,
                color: "from-emerald-500 to-green-600",
              },
              {
                name: "Google Analytics",
                description: "Análise de tráfego",
                status: "connected",
                icon: Globe,
                color: "from-yellow-500 to-orange-500",
              },
              {
                name: "Stripe",
                description: "Pagamentos online",
                status: "disconnected",
                icon: CreditCard,
                color: "from-violet-500 to-purple-600",
              },
              {
                name: "Instagram",
                description: "Feed e posts automáticos",
                status: "disconnected",
                icon: Instagram,
                color: "from-pink-500 to-rose-600",
              },
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border border-border/50 dark:border-slate-700/50 shadow-sm bg-card dark:bg-slate-900/50 hover:shadow-md transition-all group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center shadow-md dark:shadow-none transition-transform group-hover:scale-110`}>
                        <integration.icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`
                        ${integration.status === "connected" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" 
                          : integration.status === "pending"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                        } border-0
                      `}>
                        {integration.status === "connected" 
                          ? "Conectado" 
                          : integration.status === "pending"
                          ? "Pendente"
                          : "Desconectado"
                        }
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 bg-card dark:bg-slate-800 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-700"
                    >
                      {integration.status === "connected" ? "Configurar" : "Conectar"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Segurança Tab */}
        <TabsContent value="seguranca" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="w-5 h-5 text-ocean-teal" />
                    Alterar Senha
                  </CardTitle>
                  <CardDescription>Atualize sua senha de acesso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-foreground">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-foreground">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-background dark:bg-slate-800 border-border dark:border-slate-700"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-ocean-teal to-cyan-500 hover:from-ocean-navy hover:to-ocean-teal text-white">
                    Atualizar Senha
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Two-Factor Auth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-ocean-teal" />
                    Autenticação em 2 Fatores
                  </CardTitle>
                  <CardDescription>Adicione uma camada extra de segurança</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-300">2FA não está ativado</p>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                          Recomendamos ativar a autenticação em 2 fatores para maior segurança da sua conta.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-card dark:bg-slate-800 border-border dark:border-slate-700 hover:bg-muted dark:hover:bg-slate-700"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Configurar 2FA
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-ocean-teal" />
                  Sessões Ativas
                </CardTitle>
                <CardDescription>Dispositivos conectados à sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "Chrome em Windows", location: "São Paulo, BR", current: true, time: "Agora" },
                  { device: "Safari em iPhone", location: "Paraty, BR", current: false, time: "Há 2 horas" },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 dark:bg-slate-800/50 border border-border/50 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${session.current ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-slate-100 dark:bg-slate-800"} flex items-center justify-center`}>
                        <Globe className={`w-5 h-5 ${session.current ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0 text-xs">
                              Atual
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{session.location} • {session.time}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Encerrar
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Aparência Tab */}
        <TabsContent value="aparencia" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-ocean-teal" />
                  Tema do Sistema
                </CardTitle>
                <CardDescription>Personalize a aparência do painel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Claro", value: "light", bg: "bg-white", border: "border-slate-200" },
                    { name: "Escuro", value: "dark", bg: "bg-slate-900", border: "border-slate-700" },
                    { name: "Sistema", value: "system", bg: "bg-gradient-to-r from-white to-slate-900", border: "border-slate-400" },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      className={`p-4 rounded-xl border-2 ${theme.border} hover:border-ocean-teal transition-all group`}
                    >
                      <div className={`h-20 rounded-lg ${theme.bg} mb-3 shadow-inner`}></div>
                      <p className="font-medium text-foreground">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border border-border/50 dark:border-slate-700/50 shadow-md bg-card dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-ocean-teal" />
                  Idioma e Região
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Idioma</Label>
                    <Select defaultValue="pt-br">
                      <SelectTrigger className="bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Fuso Horário</Label>
                    <Select defaultValue="america-saopaulo">
                      <SelectTrigger className="bg-background dark:bg-slate-800 border-border dark:border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-saopaulo">América/São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="america-manaus">América/Manaus (GMT-4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminConfiguracoes;
