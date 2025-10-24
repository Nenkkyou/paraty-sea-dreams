import { motion } from "framer-motion";
import { Anchor, Compass, Waves, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import content from "@/data/content.json";

const iconMap = {
  Anchor,
  Compass,
  Waves,
  Sun,
};

const ExperiencesSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Experiências Exclusivas
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Navegue pelas águas mais cristalinas de Paraty com conforto e estilo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {content.experiencias.map((exp, index) => {
            const Icon = iconMap[exp.icone as keyof typeof iconMap];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                className="bg-card rounded-2xl p-6 sm:p-8 text-center shadow-lg sm:hover:shadow-xl sm:hover:scale-105 transition-all border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent will-change-transform"
                tabIndex={0}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full mb-4 sm:mb-6 mx-auto">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3">
                  {exp.titulo}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {exp.descricao}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button asChild size="lg" variant="default" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
            <Link to="/roteiros" onClick={() => window.scrollTo(0, 0)}>Conheça nossos Roteiros</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
