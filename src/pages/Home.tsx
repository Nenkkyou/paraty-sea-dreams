import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ExperiencesSection from "@/components/ExperiencesSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroCarousel />
        <ExperiencesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
