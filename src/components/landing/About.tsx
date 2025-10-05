import { Badge } from "@/components/ui/badge";
import { Shield, Target, Globe, TrendingUp } from "lucide-react";

export const About = () => {
  const missions = [
    {
      icon: Target,
      title: "One Nation. One Vision.",
      description: "Unified platform connecting students, institutions, and employers nationwide",
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Government-backed with KYC verification for all recruiters and institutions",
    },
    {
      icon: Globe,
      title: "Nationwide Reach",
      description: "Bridging tier 2-3 cities with opportunities across India",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Success",
      description: "Real-time analytics and tracking for transparent placement processes",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">About PragatiPath</Badge>
          <h2 className="text-4xl font-bold mb-4">About the Platform</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            National-level digital training and placement platform bridging education and employment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-xl border border-border/50 hover:border-accent/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-md">
                <mission.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{mission.title}</h3>
              <p className="text-sm text-muted-foreground">{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};