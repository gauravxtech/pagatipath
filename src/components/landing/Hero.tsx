import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Background decorative blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-hero opacity-20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-accent opacity-15 blur-[100px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            <span className="text-white drop-shadow-lg">Your Path to</span>
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent drop-shadow-lg">Career Success</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Connect students, recruiters, and institutions on India's most comprehensive career placement platform. Build your future with PragatiPath.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" className="bg-white text-foreground hover:bg-white/90 text-lg px-10 h-14 shadow-lg font-semibold" asChild>
              <Link to="/register">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-lg px-10 h-14 text-white border-2 border-white/30 hover:bg-white/10 hover:text-white font-semibold backdrop-blur" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-20 max-w-4xl mx-auto">
            {[
              { value: "10,000+", label: "Active Students", icon: "👥" },
              { value: "500+", label: "Partner Companies", icon: "🏢" },
              { value: "85%", label: "Placement Rate", icon: "📈" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
