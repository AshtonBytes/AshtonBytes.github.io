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
  description: "Frequently asked questions about Aurivara's custom software solutions. Learn about our process, pricing, and what to expect.",
}

const faqs = [
  {
    question: "Who is your ideal client?",
    answer: "Small businesses of 50 people or less that have repetitive, manual software tasks eating up their team's time.",
  },
  {
    question: "How much does it cost?",
    answer: "Pricing depends on the scope of your project. Reach out for a free quote — there's no obligation.",
  },
  {
    question: "What do I get at the end?",
    answer: "Full source code, complete documentation, and total ownership of everything we build. It's your software.",
  },
  {
    question: "What kinds of tasks can you automate?",
    answer: "Data entry, report generation, file processing, system integrations, email notifications, scheduled jobs, and more. If it's repetitive, we can likely automate it.",
  },
  {
    question: "How long does it take?",
    answer: "It depends on the complexity. You'll receive a clear timeline upfront and regular progress updates throughout.",
  },
  {
    question: "Do you build from scratch?",
    answer: "It depends. If an off-the-shelf solution is the best fit for your problem and values, I'll set you up for success with it. If not, we build something custom — software designed specifically around your workflows, tools, and the way your team actually operates. That means no bloat, no workarounds, and nothing you don't need.",
  },
  {
    question: "What if I'm not sure exactly what I need?",
    answer: "That's fine — most clients aren't. We'll work through it together during a free discovery call.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Yes. Ongoing maintenance is included by default — we don't just hand off and disappear. After delivery, we stay available to keep your software running with long term support and working as your needs evolve.",
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
