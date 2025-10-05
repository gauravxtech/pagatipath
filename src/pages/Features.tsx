import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
    const { t } = useTranslation();

    const keyFeatures = [
        {
            icon: Shield,
            title: "Verified Recruiters",
            description: "Every recruiter goes through KYC and approval process ensuring authentic job opportunities.",
            benefits: ["Government verification", "Background checks", "Company validation", "Fraud prevention"]
        },
        {
            icon: FileText,
            title: "Digital Resume + Certificates",
            description: "Students can upload and download verified documents with digital signatures.",
            benefits: ["Secure document storage", "Digital verification", "Easy sharing", "Tamper-proof certificates"]
        },
        {
            icon: Users,
            title: "Role-based Access",
            description: "Comprehensive access control for Student, Coordinator, DTO/STO/NTO, Recruiter, Admin roles.",
            benefits: ["Secure permissions", "Role-specific dashboards", "Data privacy", "Controlled access"]
        },
        {
            icon: Search,
            title: "Opportunities Portal",
            description: "Filterable list of internships, jobs, and placement drives with advanced search capabilities.",
            benefits: ["Smart filters", "Real-time updates", "Personalized recommendations", "Easy application"]
        },
        {
            icon: Award,
            title: "Automated Certificate Generator",
            description: "Edge function integration with Supabase Storage for instant certificate generation.",
            benefits: ["Instant generation", "Digital signatures", "Secure storage", "Easy download"]
        },
        {
            icon: BarChart3,
            title: "Real-Time Analytics",
            description: "Comprehensive placement statistics and recruiter engagement metrics.",
            benefits: ["Live dashboards", "Performance tracking", "Trend analysis", "Custom reports"]
        },
        {
            icon: Headphones,
            title: "Support System",
            description: "Integrated ticketing system to raise support requests and contact placement cells.",
            benefits: ["24/7 support", "Ticket tracking", "Multi-channel help", "Quick resolution"]
        },
        {
            icon: Smartphone,
            title: "Mobile Responsive + Dark Mode",
            description: "Fully accessible and responsive design across all devices with theme options.",
            benefits: ["Mobile-first design", "Dark/light themes", "Touch-friendly", "Cross-platform"]
        }
    ];

    const additionalFeatures = [
        { icon: CheckCircle, title: "One-Click Applications", description: "Apply to multiple opportunities instantly" },
        { icon: Globe, title: "Multi-Language Support", description: "Available in Hindi, English, Marathi, Punjabi" },
        { icon: Lock, title: "Data Security", description: "Bank-grade security with encryption" },
        { icon: Zap, title: "Real-time Notifications", description: "Instant updates on application status" }
    ];

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <TopBar />
            <Navbar />

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Platform Features
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Discover why PragatiPath is India's most trusted placement platform
                    </p>
                </div>
            </section>

            {/* Why Choose PragatiPath */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                            Why Choose PragatiPath?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our platform offers advanced features that make placement processes seamless,
                            secure, and efficient for all stakeholders.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {keyFeatures.map((feature, index) => (
                            <Card key={index} className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-6">
                                    <div className="w-14 h-14 bg-gradient-to-r from-accent to-orange-500 rounded-2xl flex items-center justify-center mb-4">
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                                    <div className="space-y-2">
                                        {feature.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-center text-sm text-gray-500">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Features */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Additional Features
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {additionalFeatures.map((feature, index) => (
                            <Card key={index} className="bg-gradient-subtle shadow-soft border border-gray-100 hover:shadow-card transition-shadow text-center">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="h-6 w-6 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="py-16 bg-gradient-subtle">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        PragatiPath vs Traditional Placement
                    </h2>
                    <div className="max-w-5xl mx-auto">
                        <Card className="bg-white shadow-soft border border-gray-100 overflow-hidden">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-primary to-primary/90 text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                                                <th className="px-6 py-4 text-center font-semibold">PragatiPath</th>
                                                <th className="px-6 py-4 text-center font-semibold">Traditional</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {[
                                                { feature: "Verification Process", pragati: "Government KYC", traditional: "Manual verification" },
                                                { feature: "Application Process", pragati: "One-click apply", traditional: "Multiple forms" },
                                                { feature: "Certificate Generation", pragati: "Automated digital", traditional: "Manual paper-based" },
                                                { feature: "Real-time Tracking", pragati: "Live updates", traditional: "Email/phone updates" },
                                                { feature: "Multi-language Support", pragati: "4 languages", traditional: "English only" },
                                                { feature: "Analytics & Reports", pragati: "Real-time dashboards", traditional: "Manual reports" },
                                                { feature: "Support System", pragati: "24/7 integrated", traditional: "Office hours only" },
                                                { feature: "Mobile Access", pragati: "Full mobile app", traditional: "Limited mobile" }
                                            ].map((row, index) => (
                                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                                    <td className="px-6 py-4 font-medium text-gray-800">{row.feature}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                                            {row.pragati}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge variant="outline" className="border-gray-300 text-gray-600">
                                                            {row.traditional}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Security & Compliance */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
                            Security & Compliance
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Data Encryption</h3>
                                <p className="text-gray-600">End-to-end encryption for all sensitive data</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Government Compliance</h3>
                                <p className="text-gray-600">Fully compliant with Indian data protection laws</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Regular Audits</h3>
                                <p className="text-gray-600">Continuous security monitoring and audits</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Future of Placements</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Join the revolution in education and employment. Start your journey with PragatiPath today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            Get Started Now
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg font-semibold transition-colors">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;