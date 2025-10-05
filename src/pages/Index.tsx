import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { About } from "@/components/landing/About";
import { Differentiators } from "@/components/landing/Differentiators";
import { RoleFeatures } from "@/components/landing/RoleFeatures";
import { SimpleSteps } from "@/components/landing/SimpleSteps";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Marquee />
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Differentiators />
      <RoleFeatures />
      <SimpleSteps />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
