import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Faq, Features, HowItWorks, Pricing, TrustStrip, UseCases } from "@/components/landing/Sections";

const LINKS = [["How it works", "#how"], ["Product", "#features"], ["Use cases", "#use-cases"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link to="/" aria-label="Candor home"><Logo /></Link>
        <nav className="hidden flex-1 gap-6 md:flex" aria-label="Primary">
          {LINKS.map(([l, h]) => <a key={h} href={h} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex" data-testid="landing-nav-open-app"><Link to="/app">Open app</Link></Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" data-testid="landing-mobile-menu-toggle">{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && (
        <nav className="border-t px-6 py-4 md:hidden" data-testid="landing-mobile-menu">
          {LINKS.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2 text-sm">{l}</a>)}
          <Button asChild size="sm" className="mt-3 w-full"><Link to="/app">Open app</Link></Button>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
        <div className="max-w-3xl fade-up">
          <a href="#use-cases" className="mb-8 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Now with multi-organization accounts <ArrowRight className="h-3 w-3" />
          </a>
          <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            The same fair first round,<br className="hidden sm:block" /> <span className="text-muted-foreground">for every candidate.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Candor runs structured voice interviews against the skills you define, then puts candidate details and status in one place for your team to review. Job seekers use it to practice for the roles they want.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" data-testid="landing-hero-open-app"><Link to="/app">Open the app <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" data-testid="landing-hero-how-it-works"><a href="#how">See how it works</a></Button>
          </div>
          <div className="mt-10"><TrustStrip /></div>
        </div>
        <div className="mt-16 fade-up" style={{ animationDelay: "120ms" }}><ProductPreview /></div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Run your next first round on Candor.</h2>
          <p className="mt-3 text-muted-foreground">Set up a role in minutes. Invite your team when you're ready.</p>
        </div>
        <Button asChild size="lg" data-testid="landing-cta-open-app"><Link to="/app">Open the app <ArrowRight /></Link></Button>
      </div>
    </section>
  );
}

const FOOTER = { Product: ["How it works", "Pricing", "FAQ"], Company: ["About", "Careers", "Contact"], Legal: ["Privacy", "Terms", "Security"] };

function Footer() {
  return (
    <footer className="border-t py-14" data-testid="landing-footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">Structured interviews for hiring teams and the people they hire.</p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems operational</p>
        </div>
        {Object.entries(FOOTER).map(([h, items]) => (
          <div key={h}>
            <p className="eyebrow mb-4">{h}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">{items.map((i) => <li key={i}><span className="cursor-default hover:text-foreground">{i}</span></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-6xl px-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Candor Labs, Inc.</div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <UseCases />
        <Pricing />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
