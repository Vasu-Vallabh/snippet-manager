import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-primary">Snippet Manager</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Empowering developers to save, organize, and share code snippets efficiently.
            </p>
          </div>
        </section>

        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground">
                    We're building the most intuitive and powerful code snippet management tool
                    to help developers focus on what matters most - writing great code.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Built by developers for developers</li>
                    <li>✓ Trusted by 10,000+ developers worldwide</li>
                    <li>✓ Open source and community-driven</li>
                    <li>✓ Continuous updates and improvements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
            <p className="text-center text-muted-foreground mb-4">
              We're a passionate team of developers and designers committed to creating
              the best developer tools. Our diverse backgrounds and expertise come together
              to deliver an exceptional snippet management experience.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}