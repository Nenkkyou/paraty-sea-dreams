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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Experiências Exclusivas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Navegue pelas águas mais cristalinas de Paraty com conforto e estilo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {content.experiencias.map((exp, index) => {
            const Icon = iconMap[exp.icone as keyof typeof iconMap];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                tabIndex={0}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">
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
          className="text-center"
        >
          <Button asChild size="lg" variant="default" className="text-lg px-8 py-6">
            <Link to="/roteiros">Conheça nossos Roteiros</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
