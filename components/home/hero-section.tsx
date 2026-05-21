import Link from "next/link"
import { Zap, ArrowLeftRight, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              <span className="gold-gradient">We Automate the Boring Parts.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Custom software that automates the repetitive, menial, and tedious tasks slowing your business down.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold btn-primary rounded-md"
              >
                Get a Quote
              </Link>
              <a
                href="tel:+16159880408"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold btn-secondary rounded-md text-white"
              >
                Call Us
              </a>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative bg-card border border-border rounded-2xl p-8 lg:p-12">
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <div className="p-3 rounded-full gold-gradient-bg">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-center">Automate</span>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <div className="p-3 rounded-full gold-gradient-bg">
                    <ArrowLeftRight className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-center">Integrate</span>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-secondary/50">
                  <div className="p-3 rounded-full gold-gradient-bg">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-center">Save Time</span>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                <div className="h-3 bg-gold/20 rounded-full w-full" />
                <div className="h-3 bg-gold/20 rounded-full w-4/5" />
                <div className="h-3 bg-gold/20 rounded-full w-3/5" />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 gold-gradient-bg rounded-full opacity-10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 gold-gradient-bg rounded-full opacity-10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
