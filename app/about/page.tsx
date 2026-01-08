import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Shield,
  Rocket,
  Globe,
  Code,
  Database,
  Smartphone,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          About{" "}
          <span className="bg-gradient-to-r from-[#3CFF9D] to-[#2DBAFF] bg-clip-text text-transparent">
            DevStudios
          </span>
        </h1>
      </div>

      {/* Founder Identity Section */}
      <div className="mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-muted/40 to-muted/10 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Built by Atul Singh
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-base md:text-lg">
              DevStudios is a{" "}
              <span className="font-semibold text-foreground">
                one-person development studio
              </span>{" "}
              founded and operated by Atul Singh, a full-stack engineer with{" "}
              <span className="font-semibold text-foreground">
                2+ years of experience
              </span>{" "}
              building production-grade web applications, automation systems,
              and AI-integrated platforms.
            </p>
            <p className="text-base md:text-lg">
              I specialize in creating{" "}
              <span className="font-semibold text-foreground">
                high-performance eCommerce platforms
              </span>{" "}
              that combine modern UI/UX design with scalable backend
              architecture. My focus is on delivering{" "}
              <span className="font-semibold text-foreground">
                conversion-optimized, AI-powered solutions
              </span>{" "}
              that help businesses grow faster.
            </p>
            <p className="text-base md:text-lg">
              Brands choose DevStudios because I bring{" "}
              <span className="font-semibold text-foreground">
                technical expertise, design sensibility, and a commitment to
                quality
              </span>{" "}
              — all in one package. Whether you need a custom store from scratch
              or want to modernize your existing platform, I build solutions
              that work.
            </p>
          </div>
        </div>
      </div>

      {/* What This Platform Demonstrates */}
      <div className="mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          What This Platform Demonstrates
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          This eCommerce platform showcases production-grade architecture and
          modern commerce capabilities, built entirely by DevStudios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">AI Shopping Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Real-time product search powered by AI with intelligent
                recommendations
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Next.js 14 App Router</h3>
              <p className="text-sm text-muted-foreground">
                Server-side streaming, optimized rendering & instant navigation
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Lightning-Fast UI</h3>
              <p className="text-sm text-muted-foreground">
                Built with Tailwind CSS & Shadcn UI for premium user experience
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Scalable Backend</h3>
              <p className="text-sm text-muted-foreground">
                Firebase Authentication & Firestore database with real-time sync
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Razorpay integration with enterprise-grade security standards
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Responsive Design</h3>
              <p className="text-sm text-muted-foreground">
                Premium modern UX that works flawlessly on all devices
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">SEO Optimized</h3>
              <p className="text-sm text-muted-foreground">
                Edge caching, meta tags, and performance optimization built-in
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Clean Architecture</h3>
              <p className="text-sm text-muted-foreground">
                Modular, maintainable codebase with TypeScript & best practices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl border border-primary/20 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
            To build{" "}
            <span className="font-semibold text-foreground">
              future-ready AI commerce experiences
            </span>{" "}
            that empower businesses to scale faster, convert better, and deliver
            exceptional customer experiences. I believe that modern eCommerce
            should be{" "}
            <span className="font-semibold text-foreground">
              fast, intelligent, and beautiful
            </span>{" "}
            — and I'm here to make that happen for your brand.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mb-12">
        <h3 className="text-xl md:text-2xl font-bold mb-6">
          Ready to Build Your Store?
        </h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <Link href="/contact" className="flex-1">
            <Button size="full" className="w-full">
              Work With Us
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button size="full" variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap flex-col justify-center gap-3">
          <Link
            href="https://atulsingh369.netlify.app/studio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline font-medium"
          >
            Learn more about DevStudios →
          </Link>
          <Link
            href="https://atulsingh369.netlify.app/engineer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline font-medium"
          >
            Learn more about Atul Singh →
          </Link>
        </div>
      </div>

      {/* Legal/Licensing Note */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          © {new Date().getFullYear()} DevStudios. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 max-w-2xl mx-auto">
          This e-commerce platform is owned & operated by DevStudios.
          Unauthorized reproduction or distribution or commercial deployment
          without written permission is strictly prohibited.
        </p>
      </div>
    </div>
  );
}
