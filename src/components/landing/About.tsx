import { Card, CardContent } from "@/components/ui/card";
import { Target, Shield, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: Target,
    title: "Our Mission",
    description: "One Nation. One Vision. Creating a unified platform for seamless training and placement nationwide.",
  },
  {
    icon: Shield,
    title: "Government-Backed",
    description: "Ministry of Education approved initiative ensuring transparency and reliability.",
  },
  {
    icon: Shield,
    title: "Verified & Secure",
    description: "Comprehensive KYC verification for all students, colleges, and recruiters.",
  },
  {
    icon: MapPin,
    title: "Nationwide Reach",
    description: "Connecting tier-1 to tier-3 cities across India with equal opportunities.",
  },
];

const timeline = [
  { year: "2023", event: "Platform Launch", desc: "Initial pilot with 50 colleges" },
  { year: "2024", event: "National Expansion", desc: "500+ institutions onboarded" },
  { year: "2025", event: "Full Integration", desc: "Pan-India coverage achieved" },
];

export const About = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <Badge className="mb-4 px-4 py-2 text-sm">About PragatiPath</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            About the Platform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            National-level digital training and placement platform bridging education and employment
          </motion.p>
        </div>

        {/* Mission Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full text-center border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-3">
                  <div className="w-14 h-14 bg-gradient-icon rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Growth Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-subtle rounded-3xl p-8 md:p-12 max-w-5xl mx-auto shadow-glow"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="h-6 w-6 text-primary" />
            <h3 className="text-2xl md:text-3xl font-bold text-center">
              Our Growth Journey
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50" />
            
            {timeline.map((item, index) => (
              <div key={item.year} className="relative text-center">
                <div className="relative inline-flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-icon rounded-full flex items-center justify-center shadow-lg z-10">
                    <span className="text-xl font-bold text-white">{item.year}</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-2">{item.event}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};