import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { About } from "@/components/landing/About";
import { Differentiators } from "@/components/landing/Differentiators";
import { RoleFeatures } from "@/components/landing/RoleFeatures";
import { PlatformCapabilities } from "@/components/landing/PlatformCapabilities";
import { Testimonials } from "@/components/landing/Testimonials";
import { SimpleSteps } from "@/components/landing/SimpleSteps";
import { FAQ } from "@/components/landing/FAQ";
import { ContactSupport } from "@/components/landing/ContactSupport";
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
      <PlatformCapabilities />
      <Testimonials />
      <SimpleSteps />
      <FAQ />
      <ContactSupport />
      <Footer />
    </div>
  );
};

export default Index;
