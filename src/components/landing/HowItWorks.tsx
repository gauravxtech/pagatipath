import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Briefcase, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      label: "Students",
      title: "Step 1: Create Your Profile",
      description: "Students register with their ABC ID and build comprehensive profiles showcasing skills, education, and experience.",
      action: "Complete your profile to unlock opportunities",
    },
    {
      icon: Briefcase,
      label: "Students & Recruiters",
      title: "Step 2: Discover Opportunities",
      description: "Browse through verified job and internship opportunities tailored to your skills and preferences.",
      action: "Find the perfect match for your needs",
    },
    {
      icon: Handshake,
      label: "Everyone",
      title: "Step 3: Connect & Succeed",
      description: "Apply to positions, track applications, and secure your dream career with our comprehensive support system.",
      action: "Build lasting professional relationships",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            A simple three-step process to transform your career journey
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <Card className="border-0 shadow-card hover:shadow-lg transition-all duration-300 h-full bg-white">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-icon rounded-2xl flex items-center justify-center shadow-md">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-accent uppercase tracking-wide">
                      {step.label}
                    </p>
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  <p className="text-sm font-medium text-primary pt-2">
                    {step.action}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow between cards */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-hero text-white text-lg px-10 h-14 shadow-glow font-semibold" asChild>
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
