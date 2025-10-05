import { UserPlus, FileEdit, Search, Award } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Register",
    description: "Sign up via ABC ID or institutional invite",
  },
  {
    icon: FileEdit,
    number: "02",
    title: "Build Your Profile",
    description: "Complete your profile with skills and documents",
  },
  {
    icon: Search,
    number: "03",
    title: "Explore Opportunities",
    description: "Browse jobs and internships matching your profile",
  },
  {
    icon: Award,
    number: "04",
    title: "Get Placed",
    description: "Receive digital certificate upon placement",
  },
];

export const SimpleSteps = () => {
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
            Simple Steps to Success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Your journey from registration to placement in four easy steps
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center group"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-primary/20" />
                )}

                {/* Step Number Badge */}
                <div className="relative inline-flex items-center justify-center mb-4">
                  <div className="absolute w-20 h-20 bg-primary/10 rounded-full animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-icon rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center mx-auto shadow-md border group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
