import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Users, Calendar, TrendingUp, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
    const { t } = useTranslation();

    const leadership = [
        { name: "Dr. Rajesh Kumar", title: "National Training Officer (NTO)", image: "👨‍💼" },
        { name: "Ms. Priya Sharma", title: "State Training Officer (STO) - Delhi", image: "👩‍💼" },
        { name: "Mr. Amit Patel", title: "District Training Officer (DTO) - Mumbai", image: "👨‍💼" },
        { name: "Dr. Sunita Singh", title: "Academic Coordinator", image: "👩‍🏫" },
    ];

    const timeline = [
        { year: "2023", event: "Platform Launch", description: "PragatiPath officially launched by Ministry of Education" },
        { year: "2023", event: "100+ Colleges", description: "First 100 partner colleges onboarded" },
        { year: "2024", event: "1st Placement Drive", description: "Successful completion of first national placement drive" },
        { year: "2024", event: "10,000+ Students", description: "Reached milestone of 10,000 registered students" },
        { year: "2024", event: "500+ Recruiters", description: "Major corporate partnerships established" },
    ];

    const impactNumbers = [
        { number: "50,000+", label: "Students Registered", icon: "👥" },
        { number: "500+", label: "Partner Colleges", icon: "🏫" },
        { number: "1,000+", label: "Recruiters", icon: "🏢" },
        { number: "95%", label: "Placement Success", icon: "📈" },
        { number: "28", label: "States Covered", icon: "🗺️" },
        { number: "200+", label: "Districts", icon: "📍" },
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle dark:bg-background">
            <TopBar />
            <Marquee />
            <Navbar />

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        About PragatiPath
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Connecting talent to opportunity. The national placement bridge.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-card transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Bridging the gap between Education and Employment at scale. Creating a unified national platform
                                    that connects students, colleges, and recruiters seamlessly across India.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-card transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Eye className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Empower students across India with equal employment opportunities. Building a future where
                                    every student has access to quality placements regardless of their location or background.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Founding Body */}
            <section className="py-16 bg-white dark:bg-card">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Founding Body</h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
                            <Badge variant="outline" className="text-lg px-6 py-3 border-2 border-accent text-accent">
                                Ministry of Education, Government of India
                            </Badge>
                            <Badge variant="outline" className="text-lg px-6 py-3 border-2 border-accent text-accent">
                                Ministry of Skill Development
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            PragatiPath is a flagship initiative backed by the Government of India, designed to revolutionize
                            the placement ecosystem and create equal opportunities for all students across the nation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Leadership Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {leadership.map((leader, index) => (
                            <Card key={index} className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-card transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="text-6xl mb-4">{leader.image}</div>
                                    <h3 className="text-lg font-bold mb-2 text-foreground">{leader.name}</h3>
                                    <p className="text-sm text-muted-foreground">{leader.title}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-gradient-subtle dark:bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Our Journey</h2>
                    <div className="max-w-4xl mx-auto">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex items-start mb-8 last:mb-0">
                                <div className="flex-shrink-0 w-20 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-accent">{item.year}</span>
                                </div>
                                <div className="flex-1 ml-6">
                                    <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
                                        <CardContent className="p-6">
                                            <h3 className="text-lg font-bold mb-2 text-foreground">{item.event}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Numbers */}
            <section className="py-16 md:py-20 bg-white dark:bg-card">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Our Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                        {impactNumbers.map((item, index) => (
                            <Card key={index} className="bg-gradient-subtle dark:bg-background shadow-soft border border-gray-100 dark:border-border hover:shadow-card transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-3">{item.icon}</div>
                                    <div className="text-2xl md:text-3xl font-bold text-accent mb-2">{item.number}</div>
                                    <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Careers Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Be part of India's largest placement transformation. We're looking for passionate individuals
                        to help us build the future of education and employment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            View Open Positions
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold transition-colors">
                            Volunteer With Us
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;