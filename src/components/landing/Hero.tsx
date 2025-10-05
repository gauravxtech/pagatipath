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
          <ImageSlider />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75"></div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-start pt-8 md:pt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl space-y-6 md:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
                ⭐ {t('hero.governmentVerified')}
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                {t('hero.title')}
                <span className="block text-accent">{t('hero.subtitle')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                {t('hero.description')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white text-base md:text-lg px-8 h-14 shadow-lg font-semibold"
                  onClick={() => setRegisterOpen(true)}
                >
                  {t('hero.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base md:text-lg px-8 h-14 text-white border-2 border-white/50 hover:bg-white hover:text-primary font-semibold bg-transparent"
                  onClick={() => setLoginOpen(true)}
                >
                  {t('navigation.login')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          <div className="w-3 h-3 bg-white rounded-full opacity-100"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
          <div className="w-3 h-3 bg-white/50 rounded-full"></div>
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
