import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Roteiros from "./pages/Roteiros";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import { FirebaseExample } from "./components/FirebaseExample";

// Admin Pages
import {
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AdminSolicitacoes,
  AdminReservas,
  AdminEmbarcacoes,
  AdminClientes,
  AdminMonitor,
  AdminConfiguracoes,
} from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/roteiros" element={<Roteiros />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/firebase-teste" element={<FirebaseExample />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="solicitacoes" element={<AdminSolicitacoes />} />
            <Route path="reservas" element={<AdminReservas />} />
            <Route path="embarcacoes" element={<AdminEmbarcacoes />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="monitor" element={<AdminMonitor />} />
            <Route path="configuracoes" element={<AdminConfiguracoes />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
