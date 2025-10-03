import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Building, 
  GraduationCap, 
  Briefcase, 
  Users, 
  BarChart,
  FileCheck,
  Bell,
  Calendar,
  Award
} from "lucide-react";

export const RoleFeatures = () => {
  const roles = [
    {
      id: "admin",
      name: "Admin",
      icon: Shield,
      color: "text-red-500",
      features: [
        { icon: BarChart, title: "System-wide Analytics", desc: "Complete visibility across all operations" },
        { icon: Users, title: "User Management", desc: "Control access and permissions" },
        { icon: FileCheck, title: "Audit Logs", desc: "Track all system activities" },
        { icon: Bell, title: "Notifications", desc: "Broadcast important updates" },
      ],
    },
    {
      id: "officers",
      name: "Training Officers",
      icon: Building,
      color: "text-blue-500",
      features: [
        { icon: BarChart, title: "Regional Analytics", desc: "Track placement trends in your jurisdiction" },
        { icon: Building, title: "College Management", desc: "Monitor and support colleges" },
        { icon: Users, title: "Coordinator Access", desc: "Manage district/state teams" },
        { icon: FileCheck, title: "Reports", desc: "Generate compliance reports" },
      ],
    },
    {
      id: "tpo",
      name: "College TPO",
      icon: GraduationCap,
      color: "text-green-500",
      features: [
        { icon: Users, title: "Student Management", desc: "Manage student profiles and progress" },
        { icon: Briefcase, title: "Drive Coordination", desc: "Organize campus placement drives" },
        { icon: Calendar, title: "Interview Scheduling", desc: "Coordinate with recruiters" },
        { icon: BarChart, title: "Placement Analytics", desc: "Track college placement statistics" },
      ],
    },
    {
      id: "recruiter",
      name: "Recruiters",
      icon: Briefcase,
      color: "text-purple-500",
      features: [
        { icon: FileCheck, title: "Job Posting", desc: "Create and manage job opportunities" },
        { icon: Users, title: "Candidate Pool", desc: "Access verified student profiles" },
        { icon: Calendar, title: "Interview Management", desc: "Schedule and track interviews" },
        { icon: Award, title: "Hiring Pipeline", desc: "Streamlined recruitment process" },
      ],
    },
    {
      id: "student",
      name: "Students",
      icon: GraduationCap,
      color: "text-orange-500",
      features: [
        { icon: FileCheck, title: "Profile Builder", desc: "Create comprehensive career profile" },
        { icon: Briefcase, title: "Job Discovery", desc: "Browse nationwide opportunities" },
        { icon: Calendar, title: "Application Tracking", desc: "Monitor application status" },
        { icon: Award, title: "Certificates", desc: "Digital placement certificates" },
      ],
    },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Features By Role
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tailored dashboards and tools for every stakeholder in the placement ecosystem
          </p>
        </div>

        <Tabs defaultValue="admin" className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-12 h-auto">
            {roles.map((role) => (
              <TabsTrigger 
                key={role.id} 
                value={role.id}
                className="flex flex-col items-center gap-2 py-3"
              >
                <role.icon className={`h-5 w-5 ${role.color}`} />
                <span className="text-xs md:text-sm">{role.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {roles.map((role) => (
            <TabsContent key={role.id} value={role.id}>
              <div className="grid md:grid-cols-2 gap-6">
                {role.features.map((feature, idx) => (
                  <Card 
                    key={idx}
                    className="border-0 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6 flex gap-4">
                      <div className="w-12 h-12 bg-gradient-icon rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};