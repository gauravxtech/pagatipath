import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-hero opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-accent opacity-10 blur-3xl rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span>National Student Placement Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your Path to
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Progress</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Connecting students, colleges, and recruiters across India. From campus to career, we pave your PragatiPath.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="bg-gradient-hero text-lg px-8 h-12 shadow-glow" asChild>
              <Link to="/register">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-12" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Colleges" },
              { value: "50K+", label: "Students" },
              { value: "1000+", label: "Recruiters" },
              { value: "10K+", label: "Placements" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
