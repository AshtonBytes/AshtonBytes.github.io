import type { Metadata } from "next"
import { ContactForm } from "@/components/contact/contact-form"
import { Clock, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact — Aurivara",
  description: "Get in touch with Aurivara. Let's build something together. Request a quote for your custom website project.",
}

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gold-gradient text-balance">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Let&apos;s build something together.
            </p>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Form Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <ContactForm />

            {/* Contact Info */}
            <div className="mt-12 pt-12 border-t border-border">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg gold-gradient-bg shrink-0">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-sm text-muted-foreground">Monday – Friday</p>
                    <p className="text-sm text-muted-foreground">9AM – 5PM CST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg gold-gradient-bg shrink-0">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:contact@aurivara.com" 
                      className="text-sm text-gold hover:underline"
                    >
                      contact@aurivara.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
