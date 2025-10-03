import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, HelpCircle, MessageSquare } from "lucide-react";

export const Contact = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Helpdesk",
      detail: "1800-XXX-XXXX",
      description: "Toll-free support line (9 AM - 6 PM)",
    },
    {
      icon: Mail,
      title: "Email Support",
      detail: "support@pragatipath.in",
      description: "24-hour response time",
    },
    {
      icon: MapPin,
      title: "Head Office",
      detail: "Ministry of Education, New Delhi",
      description: "Government of India",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Contact & Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Need help? Our dedicated support team is here to assist you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {contactMethods.map((method) => (
            <Card
              key={method.title}
              className="text-center border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-icon rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{method.title}</h3>
                  <p className="text-accent font-semibold mb-2">{method.detail}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-icon rounded-lg flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">FAQs</h3>
                      <p className="text-sm text-muted-foreground">Find quick answers</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View FAQs
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-icon rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Support Ticket</h3>
                      <p className="text-sm text-muted-foreground">Report an issue</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Create Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};