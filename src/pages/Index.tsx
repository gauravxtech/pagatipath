import { Navbar } from "@/components/layout/Navbar";
import { Marquee } from "@/components/landing/Marquee";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Features } from "@/components/landing/Features";
import { RoleFeatures } from "@/components/landing/RoleFeatures";
import { WhyJoin } from "@/components/landing/WhyJoin";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Marquee />
      <Hero />
      <About />
      <Features />
      <RoleFeatures />
      <WhyJoin />
      <HowItWorks />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
