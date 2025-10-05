import { CheckCircle, Shield, BarChart, FileCheck, Award, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Differentiators = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Stakeholders",
      description: "Every recruiter goes through KYC and government approval",
    },
    {
      icon: CheckCircle,
      title: "Real-time Tracking",
      description: "Track applications and placement status instantly",
    },
    {
      icon: FileCheck,
      title: "Digital Certificates",
      description: "Auto-generated verified placement certificates",
    },
    {
      icon: BarChart,
      title: "Centralized Analytics",
      description: "Comprehensive dashboards for all stakeholders",
    },
    {
      icon: Award,
      title: "Government Backed",
      description: "Ministry of Education verified platform",
    },
    {
      icon: MapPin,
      title: "Nationwide Reach",
      description: "Connecting tier 2-3 cities to opportunities",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Sets Us Apart</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trusted, verified, and built for India's future workforce
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
