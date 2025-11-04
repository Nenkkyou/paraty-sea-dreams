import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero/hero-1.jpg";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero3 from "@/assets/hero/hero-3.jpg";
import hero4 from "@/assets/hero/hero-4.jpg";
import hero5 from "@/assets/hero/hero-5.jpg";
import hero6 from "@/assets/hero/hero-6.jpg";

const heroImages = [hero1, hero2, hero3, hero4, hero5, hero6];

const heroTexts = [
  { title: "Descubra Paraty pelo Mar", subtitle: "Navegue com Conforto e Liberdade" },
  { title: "Águas Cristalinas", subtitle: "Praias Paradisíacas à Sua Espera" },
  { title: "Experiências Exclusivas", subtitle: "Roteiros Personalizados para Você" },
  { title: "Natureza Intocada", subtitle: "Explore o Litoral Mais Belo do Brasil" },
  { title: "Momentos Inesquecíveis", subtitle: "Crie Memórias que Duram para Sempre" },
  { title: "Conforto e Estilo", subtitle: "A Lancha dos Seus Sonhos em Paraty" },
];

const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-screen w-full overflow-hidden" role="region" aria-label="Galeria de Lanchas">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {heroImages.map((image, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <img
                src={image}
                alt={`Passeio de lancha em Paraty ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-4 sm:space-y-6"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              {heroTexts[selectedIndex].title}
            </h1>
            <p className="font-body text-lg sm:text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              {heroTexts[selectedIndex].subtitle}
            </p>
            <div className="pt-4 sm:pt-6">
              <Button asChild size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6">
                <Link to="/roteiros">Conheça nossos Roteiros</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-primary-foreground/70 hover:text-primary-foreground transition-all"
        aria-label="Imagem anterior"
      >
        <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-primary-foreground/70 hover:text-primary-foreground transition-all"
        aria-label="Próxima imagem"
      >
        <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex ? "bg-accent w-8" : "bg-primary-foreground/50"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
