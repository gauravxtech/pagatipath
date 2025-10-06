import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ImageSlider } from "./ImageSlider";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";
import { useTranslation } from "react-i18next";

export const Hero = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />

      {/* Hero Slider Section */}
      <section className="relative h-[75vh] md:h-[80vh] lg:h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
        <ImageSlider 
          onRegisterClick={() => setRegisterOpen(true)}
          onLoginClick={() => setLoginOpen(true)}
        />
      </section>

      {/* Stats Section */}
      <section className="bg-background py-16 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { value: "50,000+", label: t('stats.studentsRegistered'), icon: "👥" },
              { value: "500+", label: t('stats.partnerCompanies'), icon: "🏢" },
              { value: "95%", label: t('stats.placementSuccess'), icon: "📈" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
