import type { Metadata } from "next"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "FAQ — Aurivara",
  description: "Frequently asked questions about Aurivara's web development services. Learn about our process, pricing, and what to expect.",
}

const faqs = [
  {
    question: "Who is your ideal client?",
    answer: "Small businesses of 50 people or less looking for a website or web application.",
  },
  {
    question: "How much does it cost?",
    answer: "Packages start at $350. See our Services page for full pricing.",
  },
  {
    question: "What do I get at the end?",
    answer: "Full source code, live Vercel deployment, and complete ownership of your GitHub repo and project.",
  },
  {
    question: "Do you use templates?",
    answer: "No. Every site is built from scratch using your branding, colors, and content.",
  },
  {
    question: "Can I update my own site after delivery?",
    answer: "On the Advanced tier yes, via a no-code CMS. On Starter and Standard, updates can be requested or made directly in the source code.",
  },
  {
    question: "What if I don't have a domain?",
    answer: "No problem. We can advise on purchasing one and handle the full deployment once you have it.",
  },
  {
    question: "What if I already have a website and want a redesign?",
    answer: "The process is the same. The new site replaces the old one on your existing domain.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Not as a default, but post-delivery support can be arranged. Ask about it when you get a quote.",
  },
]

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gold-gradient text-balance">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about working with us.
            </p>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* FAQ Accordion */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl bg-card border border-border px-6 data-[state=open]:border-gold/50 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-gold py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Still have questions?
            </h2>
            <p className="text-lg text-muted-foreground">
              We&apos;re happy to help. Reach out and we&apos;ll get back to you within 1-2 business days.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold btn-primary rounded-md"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
