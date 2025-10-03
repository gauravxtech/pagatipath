import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, Briefcase, CheckCircle2 } from "lucide-react";

export const WhyJoin = () => {
  const sections = [
    {
      id: "students",
      icon: GraduationCap,
      title: "For Students",
      subtitle: "Your Gateway to Dream Careers",
      benefits: [
        "Access to nationwide job opportunities",
        "Digital profile visible to 1000+ recruiters",
        "Real-time application tracking",
        "Verified placement certificates",
        "Career guidance and support",
      ],
      cta: "Register as Student",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "colleges",
      icon: Building2,
      title: "For Colleges",
      subtitle: "Streamline Your Placement Process",
      benefits: [
        "Centralized student management",
        "Connect with verified recruiters",
        "Track placement analytics",
        "Organize campus drives efficiently",
        "Government-backed platform",
      ],
      cta: "Register College",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "recruiters",
      icon: Briefcase,
      title: "For Recruiters",
      subtitle: "Find the Right Talent",
      benefits: [
        "Access verified student database",
        "Post jobs across institutions",
        "Streamlined hiring pipeline",
        "Campus placement coordination",
        "Nationwide talent pool",
      ],
      cta: "Register as Recruiter",
      gradient: "from-purple-500 to-blue-500",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Join PragatiPath?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a student, college, or recruiter - we have the right tools for you
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sections.map((section) => (
            <Card
              key={section.id}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${section.gradient}`} />
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${section.gradient} shadow-lg`}>
                    <section.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {section.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:shadow-lg transition-all"
                >
                  <Link to="/register">{section.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};