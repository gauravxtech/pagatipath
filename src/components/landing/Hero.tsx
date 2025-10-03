import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/95"></div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-6 py-2 text-accent font-semibold">
            <Sparkles className="h-4 w-4" />
            NAAC B++ Accredited
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight text-white">
            Excellence in Engineering Education
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Shaping Future Engineers with Innovation and Technology
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-10 h-14 shadow-lg font-semibold" asChild>
              <Link to="/register">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 h-14 text-white border-2 border-white/30 hover:bg-white/10 hover:text-white font-semibold backdrop-blur" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-20 max-w-4xl mx-auto">
            {[
              { value: "10,000+", label: "Active Students", icon: "👥" },
              { value: "500+", label: "Partner Companies", icon: "🏢" },
              { value: "85%", label: "Placement Rate", icon: "📈" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
