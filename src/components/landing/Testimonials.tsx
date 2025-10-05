import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "B.Tech Graduate",
      college: "Delhi Technical University",
      quote: "Got placed at Infosys within 2 weeks of registration. The platform made everything so simple!",
      initials: "PS",
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Training & Placement Officer",
      college: "Government Engineering College",
      quote: "Managing 500+ students' placements has never been easier. The analytics dashboard is outstanding.",
      initials: "RK",
    },
    {
      name: "Anjali Verma",
      role: "HR Manager",
      college: "TCS Limited",
      quote: "Access to verified student profiles saves us weeks in the recruitment process. Highly recommend!",
      initials: "AV",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from students, colleges, and recruiters who trust PragatiPath
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full" />
              <Quote className="absolute top-4 right-4 h-8 w-8 text-accent/30" />
              <CardContent className="p-8 space-y-4">
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <Avatar className="h-12 w-12 border-2 border-accent/20">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-accent">{testimonial.college}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
