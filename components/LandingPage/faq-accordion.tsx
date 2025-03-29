"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqAccordion() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqItems = [
    {
      question: "How does the AI career coach work?",
      answer:
        "Our AI career coach uses advanced natural language processing to analyze your resume, career goals, and skills. It then provides personalized recommendations, feedback, and guidance based on current industry trends and best practices.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes, we take data security and privacy very seriously. All your personal information and career data are encrypted and stored securely. We never share your information with third parties without your explicit consent.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "You can cancel your subscription at any time with no questions asked. You'll continue to have access to the platform until the end of your current billing period.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer:
        "Our AI is trained on millions of resumes, job descriptions, and interview responses, making its feedback highly accurate and relevant. However, we always recommend using it as a tool to complement your own judgment and expertise.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 14-day money-back guarantee if you're not satisfied with our service. Simply contact our support team within 14 days of your purchase to request a refund.",
    },
    {
      question: "Can I switch between pricing plans?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference for the remainder of your billing cycle. If you downgrade, the new rate will apply at the start of your next billing cycle.",
    },
  ];

  const handleItemClick = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={openItem || undefined}
    >
      {faqItems.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border rounded-lg px-6 mb-4 data-[state=open]:shadow-sm hover:border-primary/20 transition-colors"
        >
          <AccordionTrigger
            className="text-left py-4 hover:no-underline"
            onClick={() => handleItemClick(`item-${index}`)}
          >
            <span className="text-lg font-medium">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2 text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
