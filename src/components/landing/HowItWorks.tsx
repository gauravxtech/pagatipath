import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Briefcase, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Register",
      description: "Create your account with your unique ABC ID and choose your role.",
    },
    {
      number: "02",
      title: "Build Profile",
      description: "Complete your profile with education, skills, and aspirations.",
    },
    {
      number: "03",
      title: "Explore Opportunities",
      description: "Browse jobs, internships, and campus drives matching your profile.",
    },
    {
      number: "04",
      title: "Get Placed",
      description: "Apply, interview, and secure your dream opportunity with verified certificates.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            Simple Steps to Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From registration to placement, we've streamlined the entire journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <Card className="border-0 shadow-card hover:shadow-xl transition-all duration-300 h-full bg-white group hover:-translate-y-2">
                <CardContent className="p-8 space-y-4">
                  <div className="text-6xl font-bold text-accent/20 group-hover:text-accent/30 transition-colors">
                    {step.number}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-4">
                    <div className="w-12 h-1 bg-gradient-accent rounded-full"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-accent/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-10 h-14 shadow-glow font-semibold" asChild>
            <Link to="/register">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
