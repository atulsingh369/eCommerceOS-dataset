"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import emailjs from "@emailjs/browser";
import {
  Mail,
  MessageCircle,
  Briefcase,
  Linkedin,
  Github,
  Zap,
  Shield,
  Rocket,
  Sparkles,
  Clock,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const name = (form.querySelector("#name") as HTMLInputElement).value;
    const email = (form.querySelector("#email") as HTMLInputElement).value;
    const message = (form.querySelector("#message") as HTMLTextAreaElement)
      .value;

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name,
          email,
          message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
          Work With{" "}
          <span className="bg-gradient-to-r from-[#3CFF9D] to-[#2DBAFF] bg-clip-text text-transparent">
            DevStudios
          </span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground/90">
          Build Your AI-Powered Store
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
          I build custom high-performance eCommerce platforms with AI
          automation, real-time product search, blazing-fast UX, and modern
          scalable infrastructure.
        </p>
        <p className="text-sm md:text-base text-muted-foreground/80 max-w-2xl mx-auto">
          <span className="font-semibold text-foreground">2+ years</span>{" "}
          building production systems for startups, automation-optimized
          commerce platforms, and scalable AI-integrated solutions.
        </p>
      </div>

      {/* Direct Contact CTAs */}
      <div className="mb-16">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-6">
          Let's Connect
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/917518299883"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">
                    Quick response
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* Email */}
          <a href="mailto:atulsingh.0369@gmail.com" className="group">
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">
                    Detailed inquiries
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* Portfolio */}
          <a
            href="https://atulsingh369.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Briefcase className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Portfolio</p>
                  <p className="text-sm text-muted-foreground">View my work</p>
                </div>
              </div>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/atulsingh369"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors">
                  <Linkedin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">LinkedIn</p>
                  <p className="text-sm text-muted-foreground">
                    Professional network
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/atulsingh369"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-foreground/10 group-hover:bg-foreground/20 transition-colors">
                  <Github className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">GitHub</p>
                  <p className="text-sm text-muted-foreground">Code samples</p>
                </div>
              </div>
            </div>
          </a>

          {/* Gumroad (Optional) */}
          <a
            href="https://gumroad.com/atulsingh369"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Templates</p>
                  <p className="text-sm text-muted-foreground">
                    Ready-made solutions
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="mb-16">
        <div className="bg-gradient-to-br from-muted/50 to-muted/20 backdrop-blur-sm rounded-2xl border border-border p-8 md:p-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            What You Get
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  Custom Design & Development
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tailored to your brand, built from scratch with modern tech
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  Faster Conversion-Optimized Store
                </h4>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast performance that turns visitors into customers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  AI-Powered Recommendations & Automation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Smart product search and personalized shopping experiences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  Secure Payments & Backend Scalability
                </h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with Firebase & Razorpay integration
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  Launch-Ready Store in 7-14 Days
                </h4>
                <p className="text-sm text-muted-foreground">
                  Fast turnaround without compromising on quality
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pixel-Perfect Premium UI</h4>
                <p className="text-sm text-muted-foreground">
                  Beautiful, responsive design that works on all devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mb-16">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">OR</span>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Prefer Writing Instead?
          </h3>
          <p className="text-muted-foreground">
            Leave a message and I'll respond within 24 hours.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm rounded-2xl border border-border p-6 md:p-8">
          <form className="space-y-5" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name *
                </label>
                <Input
                  id="name"
                  placeholder="Your name"
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-foreground"
              >
                Message *
              </label>
              <textarea
                id="message"
                required
                className="flex min-h-[140px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Tell me about your project, timeline, and budget..."
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center">
        <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Built With
        </h4>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium">
            Next.js 14
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium">
            Firebase
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium">
            Razorpay
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium">
            Tailwind CSS
          </div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium">
            AI Integration
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          © {new Date().getFullYear()} DevStudios. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 max-w-2xl mx-auto mb-4">
          This e-commerce platform is owned & operated by DevStudios. Usage,
          distribution, or reproduction requires written permission
        </p>
        <div className="flex flex-wrap flex-col justify-center gap-3">
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
    </div>
  );
}
