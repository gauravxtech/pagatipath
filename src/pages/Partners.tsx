import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Award, Users, Star, Quote, CheckCircle, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const Partners = () => {
    const { t } = useTranslation();

    const partnerColleges = [
        { name: "IIT Delhi", logo: "🏛️", students: "2,500+", placements: "98%" },
        { name: "IIT Mumbai", logo: "🏛️", students: "2,200+", placements: "97%" },
        { name: "NIT Trichy", logo: "🏫", students: "1,800+", placements: "95%" },
        { name: "BITS Pilani", logo: "🏫", students: "1,500+", placements: "94%" },
        { name: "VIT Vellore", logo: "🏫", students: "3,000+", placements: "92%" },
        { name: "SRM University", logo: "🏫", students: "2,800+", placements: "90%" },
        { name: "Manipal University", logo: "🏫", students: "2,000+", placements: "91%" },
        { name: "Amity University", logo: "🏫", students: "3,500+", placements: "89%" },
    ];

    const governmentBodies = [
        { name: "Ministry of Education", logo: "🏛️", role: "Policy & Oversight" },
        { name: "Ministry of Skill Development", logo: "🏛️", role: "Training Programs" },
        { name: "AICTE", logo: "📋", role: "Technical Education" },
        { name: "UGC", logo: "📋", role: "University Grants" },
        { name: "NSDC", logo: "🎯", role: "Skill Development" },
        { name: "NIELIT", logo: "💻", role: "IT Training" },
    ];

    const corporatePartners = [
        { name: "Tata Consultancy Services", logo: "💼", hired: "500+" },
        { name: "Infosys", logo: "💼", hired: "450+" },
        { name: "Wipro", logo: "💼", hired: "400+" },
        { name: "HCL Technologies", logo: "💼", hired: "350+" },
        { name: "Tech Mahindra", logo: "💼", hired: "300+" },
        { name: "Accenture", logo: "💼", hired: "280+" },
        { name: "IBM India", logo: "💼", hired: "250+" },
        { name: "Microsoft India", logo: "💼", hired: "200+" },
    ];

    const testimonials = [
        {
            name: "Dr. Suresh Patel",
            role: "DTO - Gujarat",
            image: "👨‍💼",
            quote: "PragatiPath has revolutionized how we manage placements across our district. The transparency and efficiency are remarkable."
        },
        {
            name: "Ms. Kavita Sharma",
            role: "TPO - Delhi University",
            image: "👩‍💼",
            quote: "Our placement rates have increased by 40% since joining PragatiPath. The platform is intuitive and powerful."
        },
        {
            name: "Mr. Rajesh Kumar",
            role: "HR Director - TCS",
            image: "👨‍💼",
            quote: "Finding quality talent has never been easier. PragatiPath's verification system ensures we get the best candidates."
        },
        {
            name: "Priya Singh",
            role: "Placed Student - IIT Delhi",
            image: "👩‍🎓",
            quote: "I got my dream job through PragatiPath. The process was smooth and the support team was incredibly helpful."
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
                        Our Partners
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Building India's future together with trusted institutions and organizations
                    </p>
                </div>
            </section>

            {/* Partner Colleges */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Partner Colleges
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {partnerColleges.map((college, index) => (
                            <Card key={index} className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-4">{college.logo}</div>
                                    <h3 className="text-lg font-bold mb-3 text-gray-800">{college.name}</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Students:</span>
                                            <span className="font-semibold text-accent">{college.students}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Placement Rate:</span>
                                            <span className="font-semibold text-green-600">{college.placements}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Government Bodies */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Government Bodies
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {governmentBodies.map((body, index) => (
                            <Card key={index} className="bg-gradient-subtle shadow-soft border border-gray-100 hover:shadow-card transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-4">{body.logo}</div>
                                    <h3 className="text-lg font-bold mb-2 text-gray-800">{body.name}</h3>
                                    <Badge variant="outline" className="border-accent text-accent">
                                        {body.role}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Corporate Partners */}
            <section className="py-16 bg-gradient-subtle">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Corporate Partners
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {corporatePartners.map((partner, index) => (
                            <Card key={index} className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-4">{partner.logo}</div>
                                    <h3 className="text-lg font-bold mb-3 text-gray-800">{partner.name}</h3>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold text-accent">{partner.hired}</span> students hired
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        What Our Partners Say
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="bg-gradient-subtle shadow-soft border border-gray-100 hover:shadow-card transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start mb-4">
                                        <div className="text-4xl mr-4">{testimonial.image}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        </div>
                                        <Quote className="h-6 w-6 text-accent ml-auto" />
                                    </div>
                                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
                                    <div className="flex mt-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 bg-white border-t border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        <div className="text-center">
                            <Award className="h-12 w-12 text-accent mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-800">ISO Certified</p>
                        </div>
                        <div className="text-center">
                            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-800">Govt. Verified</p>
                        </div>
                        <div className="text-center">
                            <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-800">500+ Partners</p>
                        </div>
                        <div className="text-center">
                            <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-800">95% Success Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Become a Partner */}
            <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-white">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                        JOIN THE NETWORK
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Become a Partner</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Join India's largest placement network and be part of the transformation in education and employment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg">
                            Register as College
                        </Button>
                        <Button className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg">
                            Register as Recruiter
                        </Button>
                        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
                            Contact Partnership Team
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Partners;