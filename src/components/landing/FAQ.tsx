import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Who can register on PragatiPath?",
    answer: "Students from registered colleges, Training & Placement Officers (TPOs), verified recruiters, and administrative officers (DTOs, STOs, NTOs) can register. Students need an ABC ID or institutional invite.",
  },
  {
    question: "How are placements verified?",
    answer: "All placements are verified through a multi-step process involving college TPO confirmation, recruiter validation, and digital certificate issuance. The system maintains complete audit trails for transparency.",
  },
  {
    question: "Is this platform government approved?",
    answer: "Yes, PragatiPath is an official initiative backed by the Ministry of Education, Government of India. All processes follow national guidelines for training and placement.",
  },
  {
    question: "How do I track my applications?",
    answer: "Students can track all applications in real-time through their dashboard. You'll receive notifications at each stage: application submitted, under review, shortlisted, interview scheduled, and final decision.",
  },
  {
    question: "What is ABC ID?",
    answer: "Academic Bank of Credits (ABC) ID is a unique identifier issued by the government for students in higher education. It's used for seamless authentication and profile verification on PragatiPath.",
  },
  {
    question: "How do recruiters verify students?",
    answer: "Recruiters have access to verified student profiles with educational credentials, certificates, employability scores, and assessment results. All documents are validated by respective institutions.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Everything you need to know about PragatiPath
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
