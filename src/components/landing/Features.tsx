import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Briefcase, Award, TrendingUp, Shield } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Users,
      title: "For Students",
      description: "Build your profile, discover opportunities, and track your career journey with a unique ABC ID.",
      color: "text-primary",
    },
    {
      icon: Building2,
      title: "For Colleges",
      description: "Manage departments, track placements, and connect with top recruiters nationwide.",
      color: "text-secondary",
    },
    {
      icon: Briefcase,
      title: "For Recruiters",
      description: "Access verified student profiles, post opportunities, and streamline your hiring process.",
      color: "text-accent",
    },
    {
      icon: Award,
      title: "Digital Certificates",
      description: "Automated certificate generation and verification for all achievements and placements.",
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Reports",
      description: "Comprehensive insights from college to national level with real-time dashboards.",
      color: "text-secondary",
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Role-based access, KYC verification, and audit trails ensure data integrity.",
      color: "text-accent",
    },
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need,
            <span className="bg-gradient-hero bg-clip-text text-transparent"> All In One Place</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            A comprehensive platform designed for every stakeholder in the placement ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group hover:shadow-soft transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className={`p-3 bg-gradient-hero/10 rounded-lg w-fit group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
