import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Who can register on PragatiPath?",
      answer: "Students can register using their ABC ID. Colleges, recruiters, and training partners need to receive an invite and go through a verification process.",
    },
    {
      question: "How are placements verified?",
      answer: "All placements are verified through our system. Recruiters must confirm the placement, and digital certificates are automatically generated with verification codes.",
    },
    {
      question: "Is this platform government approved?",
      answer: "Yes, PragatiPath is a Government of India initiative under the Ministry of Education, ensuring authenticity and nationwide reach.",
    },
    {
      question: "How can I track my applications?",
      answer: "Students can track all their applications in real-time through their dashboard, including application status, interview schedules, and placement offers.",
    },
    {
      question: "What is ABC ID?",
      answer: "Academic Bank of Credits (ABC) ID is a unique identifier for students that stores their academic credits and achievements, used for seamless registration on government platforms.",
    },
    {
      question: "How do recruiters verify students?",
      answer: "Recruiters can access verified student profiles with education records, skills, certificates, and employability scores to make informed hiring decisions.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card hover:border-accent/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
