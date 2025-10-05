import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Building2, Users, TrendingUp, Award, FileCheck } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "For Students",
      description: "Build your profile, discover opportunities, and track your applications all in one place.",
    },
    {
      icon: Building2,
      title: "For Colleges",
      description: "Manage placement drives, track student progress, and connect with top recruiters.",
    },
    {
      icon: Users,
      title: "For Recruiters",
      description: "Access a vast pool of verified candidates and streamline your hiring process.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Get insights into placement trends, success rates, and performance metrics.",
    },
    {
      icon: Award,
      title: "Verified Opportunities",
      description: "All job postings and companies are thoroughly verified for your safety.",
    },
    {
      icon: FileCheck,
      title: "Complete Tracking",
      description: "Monitor every step from application to placement with comprehensive tools.",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed for students, colleges, and recruiters
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group cursor-pointer border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
            >
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-icon rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
