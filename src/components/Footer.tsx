import { Anchor } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 border-t border-accent/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-accent" />
            <span className="font-display text-xl font-bold">ParatyBoat</span>
          </div>
          <p className="text-primary-foreground/70 text-sm text-center max-w-md">
            Passeios de lancha exclusivos em Paraty-RJ. Descubra o paraíso navegando pelas águas cristalinas do litoral fluminense.
          </p>
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} ParatyBoat. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
