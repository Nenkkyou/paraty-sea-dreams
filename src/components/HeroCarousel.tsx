import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const heroImages = [
  "/assets/boats/hero-1.jpg",
  "/assets/boats/hero-2.jpg",
  "/assets/boats/hero-3.jpg",
  "/assets/boats/hero-4.jpg",
  "/assets/boats/hero-5.jpg",
];

const heroTexts = [
  { title: "Descubra Paraty pelo Mar", subtitle: "Navegue com Conforto e Liberdade" },
  { title: "Águas Cristalinas", subtitle: "Praias Paradisíacas à Sua Espera" },
  { title: "Experiências Exclusivas", subtitle: "Roteiros Personalizados para Você" },
  { title: "Natureza Intocada", subtitle: "Explore o Litoral Mais Belo do Brasil" },
  { title: "Momentos Inesquecíveis", subtitle: "Crie Memórias que Duram para Sempre" },
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

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground">
              {heroTexts[selectedIndex].title}
            </h1>
            <p className="font-body text-xl md:text-2xl text-primary-foreground/90 max-w-2xl">
              {heroTexts[selectedIndex].subtitle}
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 mt-8">
              <Link to="/roteiros">Conheça nossos Roteiros</Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-primary/50 hover:bg-primary/70 backdrop-blur-sm text-primary-foreground rounded-full p-3 transition-all"
        aria-label="Imagem anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary/50 hover:bg-primary/70 backdrop-blur-sm text-primary-foreground rounded-full p-3 transition-all"
        aria-label="Próxima imagem"
      >
        <ChevronRight className="w-6 h-6" />
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
