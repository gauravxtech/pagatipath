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
      <section className="relative h-[60vh] md:h-[65vh] lg:h-[70vh] min-h-[400px] md:min-h-[450px] lg:min-h-[500px] max-h-[800px] overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          <ImageSlider 
            onRegisterClick={() => setRegisterOpen(true)}
            onLoginClick={() => setLoginOpen(true)}
          />
        </div>

      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: "50,000+", label: t('stats.studentsRegistered'), icon: "👥" },
              { value: "500+", label: t('stats.partnerCompanies'), icon: "🏢" },
              { value: "95%", label: t('stats.placementSuccess'), icon: "📈" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
