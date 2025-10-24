import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Anchor } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-accent/20"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Anchor className="w-8 h-8 text-accent transition-transform group-hover:rotate-12" />
          <span className="font-display text-2xl font-bold text-primary-foreground">
            ParatyBoat
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "text-accent"
                : "text-primary-foreground/80 hover:text-accent"
            }`}
          >
            Início
          </Link>
          <Link
            to="/roteiros"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/roteiros"
                ? "text-accent"
                : "text-primary-foreground/80 hover:text-accent"
            }`}
          >
            Roteiros
          </Link>
        </nav>
        
        <Button asChild variant="secondary" className="font-medium">
          <Link to="/contato">Entre em Contato</Link>
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;
