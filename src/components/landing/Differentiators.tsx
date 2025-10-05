import { Card, CardContent } from "@/components/ui/card";
import { Shield, Activity, Award, BarChart3, CheckCircle, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Verified Stakeholders",
    description: "All students, colleges, and recruiters undergo thorough KYC verification",
  },
  {
    icon: Activity,
    title: "Real-time Tracking",
    description: "Track applications, interviews, and placement status in real-time",
  },
  {
    icon: Award,
    title: "Digital Certificates",
    description: "Automated digital certificate generation for all placements",
  },
  {
    icon: BarChart3,
    title: "Centralized Analytics",
    description: "Comprehensive dashboards and reports for all stakeholders",
  },
  {
    icon: CheckCircle,
    title: "Government Approval",
    description: "Officially recognized and backed by Ministry of Education",
  },
  {
    icon: Globe,
    title: "Inclusive Reach",
    description: "Connecting tier-1 to tier-3 cities across India",
  },
];

export const Differentiators = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            Why PragatiPath Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            What sets us apart as India's premier training and placement platform
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 bg-gradient-icon rounded-2xl flex items-center justify-center shadow-md">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
