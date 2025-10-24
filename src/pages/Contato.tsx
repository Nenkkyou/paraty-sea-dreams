import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Ship, Send } from "lucide-react";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(255),
  telefone: z.string().min(10, "Telefone inválido").max(20),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000),
});

type FormData = z.infer<typeof formSchema>;

const Contato = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-navy via-primary to-ocean-cyan">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-primary p-12 text-primary-foreground flex flex-col justify-center">
                  <Ship className="w-16 h-16 text-accent mb-6" />
                  <h1 className="font-display text-4xl font-bold mb-4">
                    Entre em Contato
                  </h1>
                  <p className="text-primary-foreground/80 leading-relaxed mb-6">
                    Reserve seu passeio e descubra Paraty do mar. Nossa equipe está pronta para criar a experiência perfeita para você.
                  </p>
                  <div className="space-y-4 text-sm text-primary-foreground/70">
                    <p>✓ Atendimento personalizado</p>
                    <p>✓ Roteiros flexíveis</p>
                    <p>✓ Lanchas modernas e confortáveis</p>
                    <p>✓ Equipe experiente</p>
                  </div>
                </div>

                <div className="p-12">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-card-foreground">
                        Nome completo
                      </Label>
                      <Input
                        id="nome"
                        {...register("nome")}
                        className="bg-background border-border focus:ring-accent"
                        aria-invalid={errors.nome ? "true" : "false"}
                        aria-describedby={errors.nome ? "nome-error" : undefined}
                      />
                      {errors.nome && (
                        <p id="nome-error" className="text-destructive text-sm">
                          {errors.nome.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-card-foreground">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-background border-border focus:ring-accent"
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-destructive text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-card-foreground">
                        Telefone
                      </Label>
                      <Input
                        id="telefone"
                        type="tel"
                        {...register("telefone")}
                        className="bg-background border-border focus:ring-accent"
                        aria-invalid={errors.telefone ? "true" : "false"}
                        aria-describedby={errors.telefone ? "telefone-error" : undefined}
                      />
                      {errors.telefone && (
                        <p id="telefone-error" className="text-destructive text-sm">
                          {errors.telefone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem" className="text-card-foreground">
                        Mensagem
                      </Label>
                      <Textarea
                        id="mensagem"
                        {...register("mensagem")}
                        rows={5}
                        className="bg-background border-border focus:ring-accent resize-none"
                        aria-invalid={errors.mensagem ? "true" : "false"}
                        aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
                      />
                      {errors.mensagem && (
                        <p id="mensagem-error" className="text-destructive text-sm">
                          {errors.mensagem.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      variant="default"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
