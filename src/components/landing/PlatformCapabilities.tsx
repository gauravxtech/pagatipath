import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileText, LayoutDashboard, RefreshCw, Mail, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  {
    icon: Lock,
    title: "Secure Login",
    description: "Enterprise-grade authentication with Supabase",
  },
  {
    icon: FileText,
    title: "Resume & Certificate Uploader",
    description: "Easy document management and verification",
  },
  {
    icon: LayoutDashboard,
    title: "Real-Time Dashboards",
    description: "Live analytics and insights for all users",
  },
  {
    icon: RefreshCw,
    title: "Auto Employability Score",
    description: "AI-powered profile assessment system",
  },
  {
    icon: Mail,
    title: "Bulk Notifications",
    description: "Automated email and in-app notifications",
  },
  {
    icon: BadgeCheck,
    title: "Verified Recruiter Profiles",
    description: "Thorough company and recruiter verification",
  },
];

export const PlatformCapabilities = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            Platform Capabilities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Powerful features built for seamless training and placement management
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-gradient-icon rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <capability.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {capability.description}
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
