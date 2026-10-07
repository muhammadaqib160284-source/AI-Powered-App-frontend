import { useState } from "react";
import { Check, ClipboardList, Link2, ListChecks, Lock, ShieldCheck, Users, UserRound, FileText, Repeat, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

function SectionHead({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 text-base text-muted-foreground">{body}</p>}
    </div>
  );
}

const STEPS = [
  { n: "01", icon: ClipboardList, title: "Describe the role", body: "Title, description and the exact skills you want assessed. That's the brief every candidate is measured against." },
  { n: "02", icon: Link2, title: "Send the interview link", body: "Each interview gets its own link. Candidates join when it suits them — no scheduling back-and-forth." },
  { n: "03", icon: ListChecks, title: "Review with your team", body: "Status, candidate details and the brief sit side by side, so reviewers see the same context." },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead eyebrow="How it works" title="Three steps from open role to first-round signal." />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-background p-8">
              <div className="flex items-center justify-between">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="mt-8 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: ListChecks, title: "Skill-based briefs", body: "Every interview is anchored to the skills you list, so candidates for the same role get the same bar.", wide: true },
  { icon: Users, title: "Roles that match how you hire", body: "Admins manage the organization, HR runs interviews, viewers review. Nothing more, nothing less." },
  { icon: Repeat, title: "One account, many teams", body: "Switch between your personal space and every organization you belong to without signing out." },
  { icon: FileText, title: "Resume-aware practice", body: "Individuals upload a resume once and practice against roles they're actually applying for." },
  { icon: Lock, title: "Recordings go straight to storage", body: "Interview recordings upload in parts directly to object storage over signed URLs.", wide: true },
];

export function Features() {
  return (
    <section id="features" className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead eyebrow="Product" title="Built for consistent, fair first rounds." body="The parts of interviewing that should be the same for every candidate, handled the same way every time." />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className={cn("rounded-xl border bg-card p-7 transition-colors hover:border-foreground/20", f.wide && "md:col-span-2")}>
              <f.icon className="h-5 w-5 text-muted-foreground" />
              <h3 className="mt-6 font-semibold">{f.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const CASES = {
  individual: {
    icon: UserRound,
    title: "Practice for the job you actually want",
    body: "Set up an interview for a specific role and company, list the skills you expect to be tested on, and run it as many times as you need.",
    points: ["Interviews tailored to a target role", "Resume upload, up to 5 MB", "Personal workspaces to keep prep organized"],
  },
  organization: {
    icon: Building2,
    title: "Give every candidate the same first round",
    body: "Recruiters create an interview per candidate from a shared brief. Hiring managers review status and details in one place.",
    points: ["Admin, HR and viewer roles", "Invite teammates by email", "Interview links per candidate"],
  },
};

export function UseCases() {
  const [tab, setTab] = useState("organization");
  const c = CASES[tab];
  return (
    <section id="use-cases" className="border-t py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <SectionHead eyebrow="Use cases" title="For hiring teams, and for the people they hire." />
          <div className="mt-8 inline-flex rounded-lg border p-1" role="tablist">
            {[["organization", "Organizations"], ["individual", "Individuals"]].map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} data-testid={`landing-usecase-tab-${k}`}
                className={cn("rounded-md px-4 py-1.5 text-sm transition-colors", tab === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div key={tab} className="fade-up rounded-xl border bg-card p-8" data-testid="landing-usecase-panel">
          <c.icon className="h-5 w-5 text-primary" />
          <h3 className="mt-6 text-xl font-semibold">{c.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          <ul className="mt-6 space-y-3">
            {c.points.map((p) => <li key={p} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-success" /> {p}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  { name: "Individual", price: "$0", unit: "forever", body: "For job seekers preparing for specific roles.", points: ["Practice interviews", "Resume upload", "Personal workspaces"] },
  { name: "Team", price: "$49", unit: "per seat / month", body: "For recruiting teams running first rounds.", points: ["Unlimited interviews", "Admin, HR & viewer roles", "Member invitations", "Multiple workspaces"], featured: true },
  { name: "Enterprise", price: "Custom", unit: "annual", body: "For organizations with security and procurement needs.", points: ["Everything in Team", "SSO (coming soon)", "Dedicated support"] },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead eyebrow="Pricing" title="Simple pricing that scales with your team." />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={cn("flex flex-col rounded-xl border bg-card p-7", p.featured && "border-primary/50 ring-1 ring-primary/30")} data-testid={`pricing-plan-${p.name.toLowerCase()}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{p.name}</p>
                {p.featured && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Most teams</span>}
              </div>
              <p className="mt-6"><span className="text-4xl font-semibold tracking-tight">{p.price}</span> <span className="text-sm text-muted-foreground">{p.unit}</span></p>
              <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.points.map((pt) => <li key={pt} className="flex items-center gap-2.5 text-sm"><Check className="h-4 w-4 text-muted-foreground" /> {pt}</li>)}
              </ul>
              <Button asChild variant={p.featured ? "default" : "outline"} className="mt-8"><Link to="/app">{p.name === "Enterprise" ? "Talk to us" : "Get started"}</Link></Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  ["Who is Candor for?", "Recruiting teams who want a consistent first-round interview for every candidate, and individuals preparing for specific roles."],
  ["Can I use one account for my own prep and my company?", "Yes. Your personal space and every organization you belong to live under one account. Switch from the profile menu at any time."],
  ["What can each organization role do?", "Admins manage workspaces, invitations and member roles. HR creates and runs interviews. Viewers have read-only access to interviews and candidate details."],
  ["How do candidates join an interview?", "Each interview has its own link. Share it with the candidate and they join from the browser."],
  ["Where are interview recordings stored?", "Recordings are uploaded in parts directly from the browser to object storage using short-lived signed URLs."],
  ["Which resume formats are supported?", "PDF, DOC and DOCX files up to 5 MB."],
];

export function Faq() {
  return (
    <section id="faq" className="border-t py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="FAQ" title="Questions, answered." body="Something else on your mind? Reach us at hello@candor.so." />
        <Accordion type="single" collapsible className="w-full" data-testid="landing-faq">
          {FAQS.map(([q, a], i) => (
            <AccordionItem key={q} value={`q${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium" data-testid={`faq-trigger-${i}`}>{q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function TrustStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Role-based access</span>
      <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Signed-URL uploads</span>
      <span className="flex items-center gap-2"><Repeat className="h-4 w-4" /> Multi-organization accounts</span>
    </div>
  );
}
