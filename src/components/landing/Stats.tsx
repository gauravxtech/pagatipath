import { useEffect, useRef, useState } from "react";
import { Users, Building2, TrendingUp, GraduationCap } from "lucide-react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    icon: Users,
    value: 50000,
    label: "Students Registered",
    suffix: "+",
  },
  {
    icon: Building2,
    value: 500,
    label: "Partner Companies",
    suffix: "+",
  },
  {
    icon: TrendingUp,
    value: 95,
    label: "Placement Success",
    suffix: "%",
  },
  {
    icon: GraduationCap,
    value: 10000,
    label: "Students Placed",
    suffix: "+",
  },
];

const CountUp = ({ end, suffix }: { end: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const Stats = () => {
  return (
    <section className="py-12 bg-gradient-subtle border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-card rounded-xl shadow-card hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-icon rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
