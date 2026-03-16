import type { Metadata } from "next"
import { GraduationCap, Briefcase, Code2, Shield, Eye, Hammer } from "lucide-react"

export const metadata: Metadata = {
  title: "About — Aurivara",
  description: "Learn about Aurivara and our founder Ashton Anderson. We build custom websites for small businesses with reliability, transparency, and craftsmanship.",
}

const values = [
  {
    icon: Shield,
    title: "Reliability",
    description: "We deliver on our commitments. Every golden promise is backed by our guarantee.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear communication, honest timelines, and no hidden surprises along the way.",
  },
  {
    icon: Hammer,
    title: "Craftsmanship",
    description: "Every project is built with care, attention to detail, and long-term maintainability in mind.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Personal Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-12 gold-gradient text-balance">
              About the Founder
            </h1>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-semibold">
                  Ashton Anderson
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With a B.S. in Computer Science from the University of South Florida and over 2 years of professional experience, I bring both formal education and practical expertise to every project.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Self-taught across a wide range of technologies, I&apos;m committed to clear communication and follow-through on every promise made.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <div className="p-3 rounded-lg gold-gradient-bg shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Education</h3>
                    <p className="text-sm text-muted-foreground">B.S. Computer Science, University of South Florida</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <div className="p-3 rounded-lg gold-gradient-bg shrink-0">
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Experience</h3>
                    <p className="text-sm text-muted-foreground">2+ years professional development experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                  <div className="p-3 rounded-lg gold-gradient-bg shrink-0">
                    <Code2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Skills</h3>
                    <p className="text-sm text-muted-foreground">Self-taught across a wide range of technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Company Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 gold-gradient">
              About Aurivara
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Aurivara was founded on a simple principle: fulfilling golden promises. We believe that small businesses deserve the same quality of web development as enterprise companies, without the enterprise price tag.
              </p>
              <p>
                We exclusively serve small businesses under 50 employees, ensuring that every client receives personalized attention and a dedicated partnership throughout their project.
              </p>
              <p>
                Our all-American team means you&apos;ll always work with developers who understand your market and communicate clearly. At the end of every project, you receive the complete source code and full documentation — because it&apos;s your project, and you should own it completely.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Values Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full gold-gradient-bg">
                    <value.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold gold-gradient">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
