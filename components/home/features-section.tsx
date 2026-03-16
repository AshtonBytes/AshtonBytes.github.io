import { MessageSquare, RefreshCw, Wrench } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "Hassle-Free Communication",
    description: "American team, clear reports, milestone timelines, and consistent updates throughout your project.",
  },
  {
    icon: RefreshCw,
    title: "Agile Development",
    description: "Updates every 2 weeks, always a working version to review, and built for long-term maintainability.",
  },
  {
    icon: Wrench,
    title: "Our Expertise",
    description: "Web, Desktop, and Mobile Apps, APIs, Hardware integration, and Wireless Communication solutions.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-xl bg-card border border-border hover:border-gold/50 transition-colors"
            >
              <div className="mb-6 inline-flex p-4 rounded-lg gold-gradient-bg">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 gold-gradient">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
