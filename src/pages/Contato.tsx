import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Ship, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

const Contato = () => {
  const { t } = useTranslation();

  const formSchema = z.object({
    nome: z.string().min(2, t('contact.form.nameRequired')).max(100),
    email: z.string().email(t('contact.form.emailInvalid')).max(255),
    telefone: z.string().min(10, t('contact.form.phoneInvalid')).max(20),
    mensagem: z.string().min(10, t('contact.form.messageRequired')).max(1000),
  });

  type FormData = z.infer<typeof formSchema>;

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
    toast.success(t('contact.form.successMessage'));
    reset();
  };

  return (
    <main className="flex-1 pt-24 pb-16 bg-gradient-to-br from-ocean-navy via-primary to-ocean-cyan">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-primary p-8 sm:p-10 lg:p-12 text-primary-foreground flex flex-col justify-center">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <Ship className="w-12 h-12 sm:w-16 sm:h-16 text-accent mb-4 sm:mb-6" />
                  <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
                    {t('contact.title')}
                  </h1>
                  <p className="text-primary-foreground/80 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                    {t('contact.subtitle')}
                  </p>
                  <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-primary-foreground/70 w-full">
                    <p>✓ {t('contact.feature1')}</p>
                    <p>✓ {t('contact.feature2')}</p>
                    <p>✓ {t('contact.feature3')}</p>
                    <p>✓ {t('contact.feature4')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10 lg:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-card-foreground text-sm sm:text-base">
                      {t('contact.form.nameLabel')}
                    </Label>
                    <Input
                      id="nome"
                      {...register("nome")}
                      className="bg-background border-border focus:ring-accent h-10 sm:h-11"
                      aria-invalid={errors.nome ? "true" : "false"}
                      aria-describedby={errors.nome ? "nome-error" : undefined}
                    />
                    {errors.nome && (
                      <p id="nome-error" className="text-destructive text-xs sm:text-sm">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground text-sm sm:text-base">
                      {t('contact.form.emailLabel')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="bg-background border-border focus:ring-accent h-10 sm:h-11"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-destructive text-xs sm:text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-card-foreground text-sm sm:text-base">
                      {t('contact.form.phoneLabel')}
                    </Label>
                    <Input
                      id="telefone"
                      type="tel"
                      {...register("telefone")}
                      className="bg-background border-border focus:ring-accent h-10 sm:h-11"
                      aria-invalid={errors.telefone ? "true" : "false"}
                      aria-describedby={errors.telefone ? "telefone-error" : undefined}
                    />
                    {errors.telefone && (
                      <p id="telefone-error" className="text-destructive text-xs sm:text-sm">
                        {errors.telefone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagem" className="text-card-foreground text-sm sm:text-base">
                      {t('contact.form.messageLabel')}
                    </Label>
                    <Textarea
                      id="mensagem"
                      {...register("mensagem")}
                      rows={4}
                      className="bg-background border-border focus:ring-accent resize-none text-sm sm:text-base"
                      aria-invalid={errors.mensagem ? "true" : "false"}
                      aria-describedby={errors.mensagem ? "mensagem-error" : undefined}
                    />
                    {errors.mensagem && (
                      <p id="mensagem-error" className="text-destructive text-xs sm:text-sm">
                        {errors.mensagem.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-sm sm:text-base py-5 sm:py-6"
                    variant="default"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t('contact.form.submitButton')}
                  </Button>
                </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
    </main>
  );
};

export default Contato;
