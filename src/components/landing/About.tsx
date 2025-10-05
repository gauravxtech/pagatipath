import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Shield, TrendingUp } from "lucide-react";

export const About = () => {
  const highlights = [
    {
      icon: Target,
      title: "Our Mission",
      description: "One Nation. One Vision. To create a unified national platform for seamless training and placement.",
    },
    {
      icon: Users,
      title: "Government-Backed",
      description: "A centralized initiative ensuring transparency and reliability in the placement ecosystem.",
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "All stakeholders are thoroughly verified ensuring a safe and trustworthy environment.",
    },
    {
      icon: TrendingUp,
      title: "Nationwide Reach",
      description: "One Platform. One Network. Connecting opportunities across India from tier-1 to tier-3 cities and beyond.",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            About the System
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting talent to opportunity. The national placement bridge.
            A revolutionary government initiative unifying education and employment across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className="text-center border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 space-y-3">
                <div className="w-14 h-14 bg-gradient-icon rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-subtle rounded-3xl p-6 md:p-8 lg:p-12 max-w-5xl mx-auto shadow-glow">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">
            How We Make a Difference
          </h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">10,000+</div>
              <p className="text-sm md:text-base text-muted-foreground">Students Placed</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">500+</div>
              <p className="text-sm md:text-base text-muted-foreground">Partner Colleges</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">1,000+</div>
              <p className="text-sm md:text-base text-muted-foreground">Registered Recruiters</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};