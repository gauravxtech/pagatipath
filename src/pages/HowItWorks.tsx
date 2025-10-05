import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText, Search, Calendar, Award, ArrowRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
    const { t } = useTranslation();

    const steps = [
        {
            step: 1,
            title: "Sign Up",
            description: "Student registers using abcId, recruiter via invite",
            icon: UserPlus,
            details: [
                "Students use their unique ABC ID for registration",
                "Recruiters receive invitation from college TPO",
                "Email verification and profile setup",
                "Role-based access assignment"
            ]
        },
        {
            step: 2,
            title: "Complete Profile",
            description: "Education, resume, skills, preferences",
            icon: FileText,
            details: [
                "Upload academic transcripts and certificates",
                "Add resume and portfolio documents",
                "Select skills and areas of interest",
                "Set job preferences and location"
            ]
        },
        {
            step: 3,
            title: "Apply to Opportunities",
            description: "View/search jobs, apply with 1 click",
            icon: Search,
            details: [
                "Browse filtered job listings",
                "Use advanced search filters",
                "One-click application process",
                "Track application status in real-time"
            ]
        },
        {
            step: 4,
            title: "Attend Interviews",
            description: "Scheduled by recruiter, calendar invite",
            icon: Calendar,
            details: [
                "Receive interview invitations",
                "Calendar integration for scheduling",
                "Virtual or in-person interview options",
                "Automated reminders and notifications"
            ]
        },
        {
            step: 5,
            title: "Get Offer + Certificate",
            description: "Placement status + auto-generated offer letter/certificate",
            icon: Award,
            details: [
                "Receive offer letters digitally",
                "Auto-generated placement certificates",
                "Digital verification and storage",
                "Share achievements on social platforms"
            ]
        }
    ];

    const faqs = [
        {
            question: "How do I register as a student?",
            answer: "Students can register using their unique ABC ID provided by their college. Simply enter your ABC ID, email, and complete the verification process."
        },
        {
            question: "Can recruiters post jobs directly?",
            answer: "Recruiters must be invited by college TPOs and go through a verification process before they can post job opportunities on the platform."
        },
        {
            question: "Is the platform free for students?",
            answer: "Yes, PragatiPath is completely free for students. It's a government initiative to support student placements across India."
        },
        {
            question: "How are certificates verified?",
            answer: "All certificates are digitally signed and stored securely. They can be verified using unique certificate IDs and QR codes."
        },
        {
            question: "What types of opportunities are available?",
            answer: "The platform offers internships, full-time jobs, part-time positions, and training programs across various industries and skill levels."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <TopBar />
            <Navbar />

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        How It Works
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                        Your journey from campus to career in 5 simple steps
                    </p>
                    <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg">
                        <Play className="mr-2 h-5 w-5" />
                        Watch Demo Video
                    </Button>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={step.step} className="mb-16 last:mb-0">
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    {/* Content */}
                                    <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                                {step.step}
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{step.title}</h3>
                                        </div>
                                        <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                                        <ul className="space-y-3">
                                            {step.details.map((detail, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <ArrowRight className="h-5 w-5 text-accent mt-0.5 mr-3 flex-shrink-0" />
                                                    <span className="text-gray-600">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Visual */}
                                    <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                        <Card className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow">
                                            <CardContent className="p-8 text-center">
                                                <div className="w-24 h-24 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <step.icon className="h-12 w-12 text-accent" />
                                                </div>
                                                <div className="text-6xl font-bold text-accent mb-2">0{step.step}</div>
                                                <h4 className="text-xl font-semibold text-gray-800">{step.title}</h4>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center my-8">
                                        <div className="w-1 h-16 bg-gradient-to-b from-accent to-orange-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Flow Visualization */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Complete Process Flow
                    </h2>
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            {steps.map((step, index) => (
                                <div key={step.step} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                                            {step.step}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 text-center max-w-20">
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="h-6 w-6 text-accent mx-4 hidden md:block" />
                                    )}
                                </div>
                            ))}
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
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="bg-gradient-subtle shadow-soft border border-gray-100 hover:shadow-card transition-shadow">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">{faq.question}</h3>
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
                        Join thousands of students who have already found their dream careers through PragatiPath.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg">
                            Register as Student
                        </Button>
                        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;