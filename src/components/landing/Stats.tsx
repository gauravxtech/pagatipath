import { useEffect, useState } from "react";
import { Users, Building2, TrendingUp, Award } from "lucide-react";

export const Stats = () => {
  const [counts, setCounts] = useState({
    students: 0,
    companies: 0,
    placement: 0,
    placed: 0,
  });

  const targets = {
    students: 50000,
    companies: 500,
    placement: 95,
    placed: 10000,
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts((prev) => ({
        students: Math.min(prev.students + targets.students / steps, targets.students),
        companies: Math.min(prev.companies + targets.companies / steps, targets.companies),
        placement: Math.min(prev.placement + targets.placement / steps, targets.placement),
        placed: Math.min(prev.placed + targets.placed / steps, targets.placed),
      }));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      value: Math.floor(counts.students).toLocaleString(),
      suffix: "+",
      label: "Students Registered",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Building2,
      value: Math.floor(counts.companies).toLocaleString(),
      suffix: "+",
      label: "Partner Companies",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      value: Math.floor(counts.placement),
      suffix: "%",
      label: "Placement Success",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      value: Math.floor(counts.placed).toLocaleString(),
      suffix: "+",
      label: "Students Placed",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 border border-border/50"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
