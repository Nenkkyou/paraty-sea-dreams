import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";
import logo from "@/assets/logo.png";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
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
        </nav>
        
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSelector />
          <Button asChild variant="secondary" size="sm" className="font-medium text-xs sm:text-sm px-2 sm:px-4">
            <Link to="/contato" onClick={() => window.scrollTo(0, 0)}>
              <span className="hidden xs:inline">{t('header.contato')}</span>
              <span className="xs:hidden">Contato</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="font-medium text-xs sm:text-sm px-2 sm:px-4 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
            <Link to="/admin">
              <Settings className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
