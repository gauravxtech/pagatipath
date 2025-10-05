import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Placed Student - TCS",
    college: "Delhi University",
    content: "PragatiPath made my placement journey seamless. The platform connected me with top recruiters, and I landed my dream job within weeks!",
    rating: 5,
  },
  {
    name: "Dr. Rajesh Kumar",
    role: "Training & Placement Officer",
    college: "IIT Bombay",
    content: "As a TPO, this platform has revolutionized how we manage placements. Real-time tracking and analytics save us countless hours.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "HR Manager",
    college: "Infosys",
    content: "Finding verified, quality candidates has never been easier. PragatiPath's screening process ensures we connect with the right talent.",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Placed Student - Wipro",
    college: "Anna University",
    content: "The certificate feature and profile builder helped me showcase my skills effectively. Grateful for this government-backed initiative!",
    rating: 5,
  },
  {
    name: "Prof. Sunita Patel",
    role: "College TPO",
    college: "Pune University",
    content: "The bulk notification system and centralized dashboard have streamlined our entire placement process. Highly recommend!",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Recruitment Lead",
    college: "Tech Mahindra",
    content: "PragatiPath's verified student database and interview scheduling tools have made our hiring process incredibly efficient.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Hear from students, TPOs, and recruiters who've experienced PragatiPath
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-card hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                  
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>

                  <div className="pt-4 border-t">
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.college}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
