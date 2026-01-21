import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md border-b border-accent/20"
    >
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
          <img src={logo} alt="ParatyBoat" className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:rotate-12" />
          <span className="font-display text-lg sm:text-2xl font-bold text-primary-foreground">
            ParatyBoat
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10 ${
              location.pathname === "/"
                ? "text-accent bg-white/5"
                : "text-primary-foreground/80 hover:text-accent"
            }`}
          >
            {t('header.inicio')}
          </Link>
          <Link
            to="/roteiros"
            className={`text-sm font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10 ${
              location.pathname === "/roteiros"
                ? "text-accent bg-white/5"
                : "text-primary-foreground/80 hover:text-accent"
            }`}
          >
            {t('header.roteiros')}
          </Link>
          <a
            href="https://drive.google.com/file/d/18tNFxODjSnIYNtJXgVf1nt8PNMrRQVcF/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-primary-foreground/80 hover:text-accent"
          >
            Lancha Infinito
          </a>
        </nav>
        
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSelector />
          {/* Desktop: Entre em Contato button */}
          <Button asChild variant="secondary" size="sm" className="hidden md:inline-flex font-medium text-xs sm:text-sm px-2 sm:px-4">
            <Link to="/contato" onClick={() => window.scrollTo(0, 0)}>
              {t('header.contato')}
            </Link>
          </Button>
          {/* Mobile: Nossas Opções button */}
          <Button 
            variant="secondary" 
            size="sm" 
            className="md:hidden font-medium text-xs px-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 mr-1" /> : <Menu className="w-4 h-4 mr-1" />}
            Nossas Opções
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-primary/95 backdrop-blur-md border-t border-accent/20 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                className={`text-sm font-medium transition-colors py-3 px-4 rounded-lg ${
                  location.pathname === "/"
                    ? "text-accent bg-white/10"
                    : "text-primary-foreground/80 hover:text-accent hover:bg-white/5"
                }`}
              >
                {t('header.inicio')}
              </Link>
              <Link
                to="/roteiros"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                className={`text-sm font-medium transition-colors py-3 px-4 rounded-lg ${
                  location.pathname === "/roteiros"
                    ? "text-accent bg-white/10"
                    : "text-primary-foreground/80 hover:text-accent hover:bg-white/5"
                }`}
              >
                {t('header.roteiros')}
              </Link>
              <a
                href="https://drive.google.com/file/d/18tNFxODjSnIYNtJXgVf1nt8PNMrRQVcF/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium transition-colors py-3 px-4 rounded-lg text-primary-foreground/80 hover:text-accent hover:bg-white/5"
              >
                Lancha Infinito
              </a>
              <Link
                to="/contato"
                onClick={() => { setMobileMenuOpen(false); window.scrollTo(0, 0); }}
                className={`text-sm font-medium transition-colors py-3 px-4 rounded-lg ${
                  location.pathname === "/contato"
                    ? "text-accent bg-white/10"
                    : "text-primary-foreground/80 hover:text-accent hover:bg-white/5"
                }`}
              >
                {t('header.contato')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
