import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  FileEdit, 
  Send, 
  Calendar, 
  Award,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Play
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const HowItWorks = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Sign Up",
      description: "Students register using ABC ID, recruiters register via company verification",
      details: [
        "Students: Use your Academic Bank of Credits (ABC) ID",
        "Upload basic information and academic details",
        "Recruiters: Submit company registration and KYC documents",
        "Quick verification process by our team"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      icon: FileEdit,
      title: "Complete Profile",
      description: "Fill in education details, upload resume, add skills, and set preferences",
      details: [
        "Add educational qualifications and certificates",
        "Upload your professional resume (PDF format)",
        "List your technical and soft skills",
        "Set job preferences and salary expectations",
        "Add projects, internships, and achievements"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      icon: Send,
      title: "Apply to Opportunities",
      description: "Search and filter jobs/internships, apply with one click",
      details: [
        "Browse thousands of verified opportunities",
        "Use advanced filters (location, salary, skills)",
        "One-click application process",
        "Track application status in real-time",
        "Get personalized job recommendations"
      ],
      color: "from-orange-500 to-orange-600"
    },
    {
      number: "04",
      icon: Calendar,
      title: "Attend Interviews",
      description: "Recruiters schedule interviews, receive calendar invites and reminders",
      details: [
        "Automatic calendar invites sent via email",
        "SMS and app notifications for reminders",
        "Virtual interview support with meeting links",
        "Interview preparation resources provided",
        "Feedback system for continuous improvement"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      number: "05",
      icon: Award,
      title: "Get Offer + Certificate",
      description: "Receive placement confirmation and auto-generated digital certificates",
      details: [
        "Instant offer letter generation",
        "Digital placement certificate with QR verification",
        "Automated notification to college TPO",
        "Download and share certificates easily",
        "Permanent record in blockchain-verified database"
      ],
      color: "from-pink-500 to-pink-600"
    }
  ];

  const faqs = [
    {
      question: "How do I create an account on PragatiPath?",
      answer: "Students can sign up using their Academic Bank of Credits (ABC) ID. Recruiters need to submit their company registration documents and complete KYC verification. The process is quick and typically takes 24-48 hours for verification."
    },
    {
      question: "Is the platform free for students?",
      answer: "Yes! PragatiPath is completely free for students. There are no registration fees, application fees, or hidden charges. Our platform is funded by the Government of India to support student placements."
    },
    {
      question: "How are recruiters verified?",
      answer: "All recruiters undergo a comprehensive KYC verification process including company registration documents, PAN verification, GST validation, and background checks. Only verified companies can post opportunities on our platform."
    },
    {
      question: "Can I apply to multiple jobs at once?",
      answer: "Yes! You can apply to multiple opportunities simultaneously with our one-click application feature. Your profile and resume are automatically shared with selected recruiters, saving you time."
    },
    {
      question: "What happens after I get placed?",
      answer: "Once you receive an offer, you'll get a digital placement certificate that is verified and stored permanently. Your college TPO is automatically notified, and you can download/share your certificate anytime."
    },
    {
      question: "How do I track my application status?",
      answer: "Your dashboard shows real-time status of all applications. You'll receive notifications via email, SMS, and in-app alerts for every stage - applied, shortlisted, interview scheduled, selected, or rejected."
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
            How PragatiPath Works
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Your journey from student to professional - simplified in 5 easy steps
          </p>
        </div>
      </section>

      {/* Journey Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="bg-white shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-12 gap-0">
                      {/* Step Number & Icon */}
                      <div className={`md:col-span-3 bg-gradient-to-br ${step.color} p-8 flex flex-col items-center justify-center text-white`}>
                        <div className="text-6xl font-bold opacity-30 mb-4">{step.number}</div>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                          <step.icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-center">{step.title}</h3>
                      </div>
                      
                      {/* Step Content */}
                      <div className="md:col-span-9 p-8">
                        <p className="text-lg text-gray-700 mb-6 font-medium">
                          {step.description}
                        </p>
                        <ul className="space-y-3">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-md">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Journey */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Your Journey at a Glance
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className="flex-1 md:pr-8 md:text-right">
                      <Card className="bg-gradient-subtle shadow-soft hover:shadow-card transition-shadow inline-block">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center z-10 shadow-lg flex-shrink-0 mx-4`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 md:pl-8"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Walkthrough Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            Watch Our Platform in Action
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-soft border border-gray-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-r from-primary to-primary/90 flex items-center justify-center">
                  <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg">
                    <Play className="mr-3 h-6 w-6" />
                    Play Demo Video
                  </Button>
                </div>
              </CardContent>
            </Card>
            <p className="text-gray-600 mt-6 text-lg">
              Get a complete walkthrough of the PragatiPath platform and see how easy it is to
              connect talent with opportunity.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Got questions? We've got answers. If you don't find what you're looking for, contact our support team.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="bg-gradient-subtle shadow-soft hover:shadow-card transition-all cursor-pointer"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <HelpCircle className="h-6 w-6 text-accent mr-3 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                        {openFaq === index && (
                          <p className="text-gray-600 leading-relaxed animate-fade-in">{faq.answer}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have already landed their dream jobs through PragatiPath.
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg">
              Sign Up Now
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              Watch Video Tutorial
            </Button>
          </div>
        </div>
      </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;