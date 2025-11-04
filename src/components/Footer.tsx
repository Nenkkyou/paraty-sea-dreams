import { Anchor } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-primary text-primary-foreground py-10 sm:py-12 border-t border-accent/20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 text-center">
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            <span className="font-display text-lg sm:text-xl font-bold">ParatyBoat</span>
          </div>
          <p className="text-primary-foreground/70 text-xs sm:text-sm max-w-md px-4">
            {t('footer.description')}
          </p>
          <p className="text-primary-foreground/50 text-xs">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
