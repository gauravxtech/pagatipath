import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Shield,
    FileText,
    Users,
    Search,
    Award,
    BarChart3,
    Headphones,
    Smartphone,
    CheckCircle,
    Globe,
    Lock,
    Zap,
    X,
    ArrowRight
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
    const { t } = useTranslation();

    const keyFeatures = [
        {
            icon: Shield,
            title: "Verified Recruiters",
            description: "Every recruiter goes through KYC and approval process ensuring authentic job opportunities.",
            benefits: ["Government verification", "Background checks", "Company validation", "Fraud prevention"],
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: FileText,
            title: "Digital Resume + Certificates",
            description: "Students can upload and download verified documents with digital signatures.",
            benefits: ["Secure document storage", "Digital verification", "Easy sharing", "Tamper-proof certificates"],
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Users,
            title: "Role-based Access",
            description: "Comprehensive access control for Student, Coordinator, DTO/STO/NTO, Recruiter, Admin roles.",
            benefits: ["Secure permissions", "Role-specific dashboards", "Data privacy", "Controlled access"],
            color: "from-green-500 to-green-600"
        },
        {
            icon: Search,
            title: "Opportunities Portal",
            description: "Filterable list of internships, jobs, and placement drives with advanced search capabilities.",
            benefits: ["Smart filters", "Real-time updates", "Personalized recommendations", "Easy application"],
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: Award,
            title: "Automated Certificate Generator",
            description: "Edge function integration with Supabase Storage for instant certificate generation.",
            benefits: ["Instant generation", "Digital signatures", "Secure storage", "Easy download"],
            color: "from-yellow-500 to-yellow-600"
        },
        {
            icon: BarChart3,
            title: "Real-Time Analytics",
            description: "Comprehensive placement statistics and recruiter engagement metrics.",
            benefits: ["Live dashboards", "Performance tracking", "Trend analysis", "Custom reports"],
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: Headphones,
            title: "Support System",
            description: "Integrated ticketing system to raise support requests and contact placement cells.",
            benefits: ["24/7 support", "Ticket tracking", "Multi-channel help", "Quick resolution"],
            color: "from-indigo-500 to-indigo-600"
        },
        {
            icon: Smartphone,
            title: "Mobile Responsive + Dark Mode",
            description: "Fully accessible and responsive design across all devices with theme options.",
            benefits: ["Mobile-first design", "Dark/light themes", "Touch-friendly", "Cross-platform"],
            color: "from-teal-500 to-teal-600"
        }
    ];

    const additionalFeatures = [
        { icon: CheckCircle, title: "One-Click Applications", description: "Apply to multiple opportunities instantly" },
        { icon: Globe, title: "Multi-Language Support", description: "Available in Hindi, English, Marathi, Punjabi" },
        { icon: Lock, title: "Data Security", description: "Bank-grade security with encryption" },
        { icon: Zap, title: "Real-time Notifications", description: "Instant updates on application status" }
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle dark:bg-background">
            <TopBar />
            <Marquee />
            <Navbar />

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                        POWERED BY GOVERNMENT OF INDIA
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Platform Features
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                        Discover why PragatiPath is revolutionizing placement processes across India
                    </p>
                    <div className="flex items-center justify-center gap-3 text-white/90">
                        <CheckCircle className="h-5 w-5" />
                        <span>Trusted by 500+ colleges</span>
                        <span className="mx-2">•</span>
                        <CheckCircle className="h-5 w-5" />
                        <span>50,000+ students placed</span>
                    </div>
                </div>
            </section>

            {/* Key Features Grid */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                            Powerful Features That Set Us Apart
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Our platform offers cutting-edge features that make placement processes seamless,
                            secure, and efficient for all stakeholders.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {keyFeatures.map((feature, index) => (
                            <Card 
                                key={index} 
                                className="bg-white dark:bg-card shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden border dark:border-border"
                            >
                                <CardContent className="p-0">
                                    {/* Icon Section */}
                                    <div className={`bg-gradient-to-br ${feature.color} p-6 flex items-center justify-center relative`}>
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm relative z-10">
                                            <feature.icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-3 text-foreground">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                                        <div className="space-y-2">
                                            {feature.benefits.map((benefit, idx) => (
                                                <div key={idx} className="flex items-start text-xs text-muted-foreground">
                                                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                    <span>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-16 bg-white dark:bg-card">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
                        Additional Features
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {additionalFeatures.map((feature, index) => (
                            <Card key={index} className="bg-gradient-subtle dark:bg-background shadow-soft border border-gray-100 dark:border-border hover:shadow-card transition-shadow text-center">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-16 bg-gradient-subtle dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                            Why Switch to PragatiPath?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            See how we're transforming the traditional placement process with technology
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Traditional System */}
                            <Card className="bg-white dark:bg-card shadow-soft border-2 border-red-200 dark:border-red-900/50">
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                                            <X className="h-6 w-6 text-red-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">Traditional Placement</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {[
                                            "Manual verification - time consuming",
                                            "Paper-based applications and forms",
                                            "Limited reach to opportunities",
                                            "No real-time tracking",
                                            "Manual certificate generation",
                                            "Lack of transparency",
                                            "Limited analytics and insights",
                                            "Office hours support only"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-muted-foreground">
                                                <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* PragatiPath System */}
                            <Card className="bg-white dark:bg-card shadow-xl border-2 border-green-300 dark:border-green-900/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                                    RECOMMENDED
                                </div>
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">PragatiPath</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {[
                                            "Government KYC verification",
                                            "One-click digital applications",
                                            "Nationwide opportunities access",
                                            "Live tracking & notifications",
                                            "Auto-generated certificates",
                                            "Complete transparency",
                                            "Real-time analytics dashboard",
                                            "24/7 integrated support"
                                        ].map((item, idx) => (
                                            <li key={idx} className="flex items-start text-foreground font-medium">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security & Compliance */}
            <section className="py-16 bg-white dark:bg-card">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                            Security & Compliance
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Data Encryption</h3>
                                <p className="text-muted-foreground">End-to-end encryption for all sensitive data</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Government Compliance</h3>
                                <p className="text-muted-foreground">Fully compliant with Indian data protection laws</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-foreground">Regular Audits</h3>
                                <p className="text-muted-foreground">Continuous security monitoring and audits</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Placement Process?</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Join 500+ colleges and 50,000+ students who have already experienced the future of placements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg group">
                            Get Started Now
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;