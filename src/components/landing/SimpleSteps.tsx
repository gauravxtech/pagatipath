import { UserPlus, FileEdit, Search, Award } from "lucide-react";

export const SimpleSteps = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Register",
      description: "Sign up via ABC ID or receive invite",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FileEdit,
      title: "Build Profile",
      description: "Add education, resume, skills & preferences",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Search,
      title: "Explore Opportunities",
      description: "View and apply to jobs with 1-click",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Get Placed",
      description: "Receive digital certificate & offer letter",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple Steps to Success</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey from registration to placement in four easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="text-center p-6 bg-card rounded-2xl border border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-xl h-full">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                <div className={`w-20 h-20 mx-auto mb-4 mt-2 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
