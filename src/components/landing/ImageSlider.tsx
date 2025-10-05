import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import trainingImage from "@/assets/training-1.jpg";
import placementImage from "@/assets/placement-2.jpg";
import successImage from "@/assets/success-3.jpg";

interface Slide {
  image: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface ImageSliderProps {
  onCTAClick?: () => void;
}

export const ImageSlider = ({ onCTAClick }: ImageSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      image: trainingImage,
      alt: "Professional Training Program",
      badge: "🎓 Government Verified",
      title: "One Nation. One Training & Placement System",
      subtitle: "Connecting talent to opportunity across India",
      ctaText: "Get Started",
      ctaLink: "#register",
    },
    {
      image: placementImage,
      alt: "Campus Placement Drive",
      badge: "🏆 95% Success Rate",
      title: "Streamlined Placement Process",
      subtitle: "Digital platform connecting students with 500+ companies",
      ctaText: "Explore Opportunities",
      ctaLink: "#opportunities",
    },
    {
      image: successImage,
      alt: "Student Success Stories",
      badge: "🌟 50,000+ Students Placed",
      title: "Your Success is Our Mission",
      subtitle: "Join thousands of students who found their dream careers",
      ctaText: "View Success Stories",
      ctaLink: "#success",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
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
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/75" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-6">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8 absolute"
                }`}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg mb-4">
                  {slide.badge}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
                  {slide.subtitle}
                </p>

                {/* CTA Button */}
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-xl text-base px-8 h-12"
                  onClick={onCTAClick}
                >
                  {slide.ctaText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-7 md:w-7 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-7 md:w-7 group-hover:scale-110 transition-transform" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
