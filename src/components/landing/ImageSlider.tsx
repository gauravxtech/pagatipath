import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import trainingImage from "@/assets/training-1.jpg";
import placementImage from "@/assets/placement-2.jpg";
import successImage from "@/assets/success-3.jpg";

interface ImageSliderProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

export const ImageSlider = ({ onRegisterClick, onLoginClick }: ImageSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: trainingImage,
      alt: "National Placement Bridge",
      title: "Connecting Talent to Opportunity",
      subtitle: "The National Placement Bridge",
      gradient: "from-blue-950/95 via-blue-900/85 to-blue-950/90"
    },
    {
      image: placementImage,
      alt: "One Nation One Career",
      title: "One Nation, One Career Path",
      subtitle: "From Every College to Every Company",
      gradient: "from-blue-950/90 via-blue-900/80 to-orange-900/85"
    },
    {
      image: successImage,
      alt: "Shaping Careers",
      title: "Shaping Careers. Strengthening the Nation",
      subtitle: "Building a skilled workforce for tomorrow",
      gradient: "from-orange-950/90 via-blue-900/85 to-blue-950/90"
    },
    {
      image: trainingImage,
      alt: "Empowering Futures",
      title: "Empowering Futures. Uniting Talent Across India",
      subtitle: "Your gateway to career success",
      gradient: "from-blue-950/95 via-orange-900/80 to-blue-950/90"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 absolute"
                }`}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg mb-6 animate-fade-in">
                  ⭐ Government Verified Platform
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 animate-fade-in">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-8 animate-fade-in">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-base md:text-lg px-8 h-14 shadow-lg font-semibold transition-all duration-300 hover:scale-105"
                    onClick={onRegisterClick}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base md:text-lg px-8 h-14 text-white border-2 border-white/50 hover:bg-white hover:text-blue-950 font-semibold bg-transparent transition-all duration-300 hover:scale-105"
                    onClick={onLoginClick}
                  >
                    Login
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-10 h-3 bg-orange-600"
                : "w-3 h-3 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
