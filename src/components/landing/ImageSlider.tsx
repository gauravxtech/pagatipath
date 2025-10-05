import { useEffect, useState } from "react";
import trainingImage from "@/assets/training-1.jpg";
import placementImage from "@/assets/placement-2.jpg";
import successImage from "@/assets/success-3.jpg";

export const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: trainingImage,
      alt: "Professional Training Program"
    },
    {
      image: placementImage,
      alt: "Campus Placement Drive"
    },
    {
      image: successImage,
      alt: "Student Success Stories"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}


    </div>
  );
};
