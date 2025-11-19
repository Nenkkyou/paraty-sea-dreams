import { motion } from "framer-motion";
import RouteCard from "@/components/RouteCard";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import content from "@/data/content.json";

const Roteiros = () => {
  const { t } = useTranslation();

  const routesData = [
    { key: 'sacoMamangua', images: ['mamangua-1.jpg', 'mamangua-2.jpg', 'mamangua-3.jpg', 'mamangua-4.jpg', 'mamangua-5.jpg'] },
    { key: 'ilhaPelado', images: ['pelado-1.jpg', 'pelado-2.jpg', 'pelado-3.jpg', 'pelado-4.jpg'] },
    { key: 'ilhaCedro', images: ['cedro-1.jpg', 'cedro-2.jpg'] },
    { key: 'ilhaMantimentos', images: ['mantimentos-1.jpg', 'mantimentos-2.jpg', 'mantimentos-3.jpg'] },
    { key: 'lagoaVerde', images: ['lagoa-verde-1.jpg', 'lagoa-verde-2.jpg', 'lagoa-verde-3.jpg', 'lagoa-verde-4.jpg'] },
    { key: 'apreciacaoFundoMar', images: ['mergulho-1.jpg', 'mergulho-2.jpg'] },
    { key: 'praiaCrepusculo', images: ['roteiro-por-do-sol.jpg', 'crepusculo-3.jpg'] },
    { key: 'passeioPersonalizado', images: ['passeio-personalizado-paraty.jpg'] },
  ];

  return (
    <main className="flex-1 pt-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent transition-colors">
            {t('routes.breadcrumbHome')}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{t('routes.breadcrumbCurrent')}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4">
            {t('routes.pageTitle')}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto px-4">
            {t('routes.pageSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {routesData.map((route, index) => (
              <RouteCard
                key={route.key}
                nome={t(`routes.items.${route.key}.nome`)}
                descricao={t(`routes.items.${route.key}.descricao`)}
                imagens={route.images}
                index={index}
              />
            ))}
          </div>
        </div>
    </main>
  );
};

export default Roteiros;
