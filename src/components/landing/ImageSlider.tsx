import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import trainingImage from "@/assets/training-1.jpg";
import placementImage from "@/assets/placement-2.jpg";
import successImage from "@/assets/success-3.jpg";

interface ImageSliderProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export const ImageSlider = ({ onRegisterClick, onLoginClick }: ImageSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  const slides = [
    {
      image: trainingImage,
      alt: "Professional Training Program",
      badge: "Government Verified",
      title: "Innovate. Create. Lead.",
      subtitle: "Empowering the next generation of tech leaders with industry-ready skills and real-world experience",
      cta: "Register Now",
      gradient: "from-purple-600/90 via-blue-600/80 to-cyan-500/70"
    },
    {
      image: placementImage,
      alt: "Campus Placement Drive",
      badge: "95% Success Rate",
      title: "Connect with Industry Leaders",
      subtitle: "Access exclusive opportunities from 500+ top companies and kickstart your dream career",
      cta: "Explore More",
      gradient: "from-blue-600/90 via-indigo-600/80 to-purple-500/70"
    },
    {
      image: successImage,
      alt: "Student Success Stories",
      badge: "10,000+ Placements",
      title: "Your Future Starts Today",
      subtitle: "Join thousands of students who transformed their careers through our comprehensive training programs",
      cta: "Get Started",
      gradient: "from-cyan-600/90 via-blue-600/80 to-indigo-500/70"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Image Slides with Animated Transitions */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />
          {/* Dynamic Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
          {/* Additional Radial Gradient for Depth */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40" />
        </div>
      ))}

      {/* Animated Particles Background Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content Overlay with Smooth Animations */}
      <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div 
            key={currentSlide}
            className="space-y-6 md:space-y-8 animate-fade-in"
          >
            {/* Badge with Icon */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-2xl border border-white/20 hover:bg-white/20 transition-colors">
              <Sparkles className="w-4 h-4" />
              {slides[currentSlide].badge}
            </div>

            {/* Main Headline - Extra Bold & Large */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
              <span className="block bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl">
                {slides[currentSlide].title}
              </span>
            </h1>

            {/* Subtitle - Clean & Readable */}
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 max-w-3xl leading-relaxed font-medium">
              {slides[currentSlide].subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={onRegisterClick}
                className="bg-white text-primary hover:bg-white/90 font-bold shadow-2xl text-lg px-10 h-16 rounded-xl group transition-all hover:scale-105"
              >
                {slides[currentSlide].cta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={onLoginClick}
                className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 font-bold text-lg px-10 h-16 rounded-xl transition-all hover:scale-105"
              >
                {t('navigation.login')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Modern Style */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20 hover:scale-110 shadow-xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20 hover:scale-110 shadow-xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Dot Indicators - Enhanced */}
      <div className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 flex gap-3 bg-black/20 backdrop-blur-sm px-4 py-3 rounded-full border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-12 h-3 bg-white shadow-lg"
                : "w-3 h-3 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 md:bottom-14 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs font-semibold uppercase tracking-wider">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
