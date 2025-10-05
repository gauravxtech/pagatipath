import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { ImageSlider } from "./ImageSlider";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";

export const Hero = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <ImageSlider />
      
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75 z-10" />
      
      <div className="relative z-20 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-white text-sm font-medium">Government of India Verified</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            One Nation. One Training & Placement System
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Connecting talent to opportunity. The national placement bridge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-xl"
              onClick={() => setRegisterOpen(true)}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary font-semibold"
              onClick={() => setLoginOpen(true)}
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
    </section>
  );
};
