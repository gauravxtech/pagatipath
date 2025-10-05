import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Linkedin,
  Twitter,
  Youtube,
  Github
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation schema using Zod
  const contactSchema = z.object({
    name: z.string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(100, { message: "Name must be less than 100 characters" }),
    email: z.string()
      .trim()
      .email({ message: "Please enter a valid email address" })
      .max(255, { message: "Email must be less than 255 characters" }),
    role: z.string()
      .min(1, { message: "Please select your role" }),
    message: z.string()
      .trim()
      .min(10, { message: "Message must be at least 10 characters" })
      .max(1000, { message: "Message must be less than 1000 characters" })
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);

      // Here you would typically send to your backend
      // For now, we'll just show a success message
      console.log("Form submitted:", validatedData);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "",
        message: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      content: "support@pragatipath.gov.in",
      link: "mailto:support@pragatipath.gov.in",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Helpline Number",
      content: "1800-XXX-XXXX",
      link: "tel:1800XXXXXX",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Head Office",
      content: "Ministry of Education, Shastri Bhawan, New Delhi - 110001",
      link: "https://maps.google.com",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM (IST)",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const socialLinks = [
    { 
      icon: Linkedin, 
      name: "LinkedIn", 
      link: "https://linkedin.com/company/pragatipath",
      color: "hover:text-blue-600"
    },
    { 
      icon: Twitter, 
      name: "Twitter", 
      link: "https://twitter.com/pragatipath",
      color: "hover:text-sky-500"
    },
    { 
      icon: Youtube, 
      name: "YouTube", 
      link: "https://youtube.com/@pragatipath",
      color: "hover:text-red-600"
    },
    { 
      icon: Github, 
      name: "GitHub", 
      link: "https://github.com/pragatipath",
      color: "hover:text-gray-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <TopBar />
      <Marquee />
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            We're here to help. Reach out to us for any queries, support, or partnership opportunities.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-white shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${info.color} p-6 flex items-center justify-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">{info.title}</h3>
                    {info.link ? (
                      <a 
                        href={info.link}
                        target={info.link.startsWith('http') ? '_blank' : undefined}
                        rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-sm text-gray-600 hover:text-accent transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600">{info.content}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Contact Form */}
            <Card className="bg-white shadow-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="role">Your Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="tpo">Training & Placement Officer</SelectItem>
                        <SelectItem value="recruiter">Recruiter</SelectItem>
                        <SelectItem value="dto">District Training Officer</SelectItem>
                        <SelectItem value="sto">State Training Officer</SelectItem>
                        <SelectItem value="nto">National Training Officer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Social Links */}
            <div className="space-y-6">
              {/* Map Placeholder */}
              <Card className="bg-white shadow-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2061789876936!2d77.19499631508047!3d28.613939282422514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b5f6f0a9%3A0x3b5c3e6e5e0b5c0a!2sShastri%20Bhawan%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-white shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-800 text-center">Connect With Us</h3>
                  <div className="flex justify-center gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transition-all ${social.color} hover:scale-110`}
                        aria-label={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-card">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
                  <p className="text-white/90 mb-6">
                    Our support team is available 24/7 to assist you with any urgent queries.
                  </p>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                    Chat with Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Looking for Something Specific?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out our frequently asked questions or browse our help center for quick answers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg">
              Visit Help Center
            </Button>
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg">
              View FAQs
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
