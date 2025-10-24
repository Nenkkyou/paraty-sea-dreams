import { motion } from "framer-motion";
import RouteCard from "@/components/RouteCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import content from "@/data/content.json";

const Roteiros = () => {
  return (
    <main className="flex-1 pt-24 bg-background">
      <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-accent transition-colors">
              Início
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Roteiros</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Nossos Roteiros
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Escolha entre os destinos mais espetaculares de Paraty e embarque em uma jornada inesquecível pelas águas cristalinas do litoral fluminense
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.roteiros.map((roteiro, index) => (
              <RouteCard
                key={roteiro.id}
                nome={roteiro.nome}
                descricao={roteiro.descricao}
                imagem={roteiro.imagem}
                index={index}
              />
            ))}
          </div>
        </div>
    </main>
  );
};

export default Roteiros;
