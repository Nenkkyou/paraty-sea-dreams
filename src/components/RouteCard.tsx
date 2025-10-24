import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RouteCardProps {
  nome: string;
  descricao: string;
  imagem: string;
  index: number;
}

const RouteCard = ({ nome, descricao, imagem, index }: RouteCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-border"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={`/assets/boats/${imagem}`}
          alt={nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="p-6 space-y-4">
        <h3 className="font-display text-2xl font-semibold text-card-foreground">
          {nome}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {descricao}
        </p>
        <Button asChild variant="secondary" className="w-full">
          <Link to="/contato">Entre em Contato</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default RouteCard;
