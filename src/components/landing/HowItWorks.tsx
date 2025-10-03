import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, FileEdit, Search, CheckCircle } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Register",
      description: "Create your account with your unique ABC ID and choose your role.",
      step: "01",
    },
    {
      icon: FileEdit,
      title: "Build Profile",
      description: "Complete your profile with education, skills, and aspirations.",
      step: "02",
    },
    {
      icon: Search,
      title: "Explore Opportunities",
      description: "Browse jobs, internships, and campus drives matching your profile.",
      step: "03",
    },
    {
      icon: CheckCircle,
      title: "Get Placed",
      description: "Apply, interview, and secure your dream opportunity with verified certificates.",
      step: "04",
    },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple Steps to
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Success</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From registration to placement, we've streamlined the entire journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <Card className="h-full hover:shadow-soft transition-all duration-300">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 text-6xl font-bold text-primary/10">
                      {step.step}
                    </div>
                    <div className="p-4 bg-gradient-hero rounded-full w-fit mx-auto relative z-10">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-hero" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
