import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Users,
  Network,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KYRA — Decentralized Trust Infrastructure for Modern Banking" },
      {
        name: "description",
        content:
          "KYRA is a decentralized trust infrastructure that puts you in control of your identity and financial records. One identity. Infinite trust.",
      },
      { property: "og:title", content: "KYRA — Know Your Records, Always" },
      {
        property: "og:description",
        content:
          "Decentralized banking trust infrastructure powered by Hyperledger Indy, Aries, AnonCreds and Chainlink CCIP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  { n: 1, title: "Create Your Identity", desc: "Generate your decentralized identity (DID) and secure your Web3 wallet." },
  { n: 2, title: "Verify Once", desc: "Complete KYC once and receive verifiable credentials issued by trusted institutions." },
  { n: 3, title: "Reuse Everywhere", desc: "Use your verified identity to access banking and financial services instantly." },
  { n: 4, title: "Full Transparency", desc: "Track every action with real-time, immutable, auditable records." },
];

const benefits = [
  { icon: ShieldCheck, title: "Verify Once", desc: "Complete KYC once and reuse everywhere." },
  { icon: Lock, title: "Privacy by Design", desc: "Share only what's needed with zero-knowledge proofs." },
  { icon: FileCheck2, title: "Tamper-Proof Records", desc: "Every action recorded immutably on-chain." },
  { icon: Users, title: "Multi-Level Approval", desc: "Built-in workflows for secure decision making." },
  { icon: Network, title: "Interoperable", desc: "Works across banks and financial services." },
];

const techBadges = [
  { name: "Hyperledger Indy", sub: "Decentralized Identity", mark: "◇" },
  { name: "Hyperledger Aries", sub: "Credential Exchange", mark: "◈" },
  { name: "AnonCreds", sub: "Zero-Knowledge Proofs", mark: "∎" },
  { name: "Chainlink CCIP", sub: "Cross-Chain Interop", mark: "⬡" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-trust-gradient shadow-glow">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">KYRA</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Know Your Records, Always
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#benefits" className="hover:text-foreground">Benefits</a>
            <a href="#tech" className="hover:text-foreground">Technology</a>
          </nav>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow"
          >
            Enter KYRA <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero-gradient opacity-[0.04]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-trust" />
              Powered by Hyperledger &amp; Chainlink
            </div>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Banking Trust
              <br />
              Reimagined.
              <br />
              <span className="text-trust">Identity. Records. Yours.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              KYRA is a decentralized trust infrastructure that puts you in
              control of your identity and financial records. One identity.
              Infinite trust.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-elegant hover:bg-primary-glow"
              >
                Enter KYRA Wallet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:bg-muted"
              >
                Explore Platform
              </Link>
            </div>
            <div className="mt-10 flex max-w-md items-start gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-elegant">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-trust" />
              <div className="text-sm leading-relaxed">
                Your identity is more than documents.
                It's your gateway to every financial opportunity.
              </div>
            </div>
          </div>

          {/* Mock device */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-[300px] rounded-[2.5rem] border-[10px] border-primary bg-card p-4 shadow-elegant">
              <div className="rounded-[1.5rem] bg-hero-gradient p-5 text-white">
                <div className="mb-4 flex items-center justify-between text-[11px] opacity-80">
                  <span>KYRA Wallet</span>
                  <span className="h-2 w-2 rounded-full bg-trust" />
                </div>
                <div className="text-sm opacity-80">Welcome back,</div>
                <div className="text-2xl font-semibold">Aarav</div>
                <div className="mt-3 rounded-xl bg-white/10 p-3 text-[11px]">
                  <div className="text-white/70">Verified Identity</div>
                  <div className="font-mono">did:indy:bcovrin:8f7a…e32d</div>
                </div>
                <div className="mt-4 rounded-xl bg-card p-4 text-foreground">
                  <div className="text-[11px] text-muted-foreground">Balance Overview</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">₹3,85,240.00</div>
                  <div className="text-[11px] text-muted-foreground">Total Assets</div>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between"><span>Active Loans</span><span className="font-medium">2</span></div>
                    <div className="flex justify-between"><span>Credentials</span><span className="font-medium">6</span></div>
                    <div className="flex justify-between"><span>Recent Transactions</span><span className="font-medium">128</span></div>
                  </div>
                  <button className="mt-4 w-full rounded-lg bg-trust py-2 text-xs font-medium text-white">
                    View Dashboard
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-8 hidden animate-pulse rounded-lg bg-card px-3 py-2 text-xs shadow-elegant md:block">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-trust" />
                <span className="font-medium">Credential Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits strip */}
        <div id="benefits" className="mx-auto -mt-6 max-w-7xl px-6 pb-16">
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-elegant md:grid-cols-5">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/60">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-trust-soft text-trust">
                  <b.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{b.title}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
          How <span className="text-trust underline decoration-trust/30 underline-offset-8">KYRA</span> Works
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-full top-8 hidden h-px w-full -translate-x-1/2 border-t border-dashed border-border md:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant">
                  <span className="text-lg font-semibold">{s.n}</span>
                </div>
                <div className="mt-4 text-base font-semibold">{s.title}</div>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech */}
      <section id="tech" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <div className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Built on Trusted Enterprise Technologies
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {techBadges.map((t) => (
              <div key={t.name} className="flex items-center gap-3 rounded-xl border border-border p-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust-soft">
                  <Network className="h-5 w-5 text-trust" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{t.sub}</div>
                  <div className="text-sm font-semibold">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-hero-gradient p-10 text-center text-white shadow-elegant md:flex-row md:justify-between md:text-left">
          <div>
            <div className="text-2xl font-semibold">You own your identity. We protect your trust.</div>
            <div className="mt-2 max-w-xl text-sm text-white/80">
              KYRA is the foundation for a secure, transparent and interoperable financial future.
            </div>
          </div>
          <Link
            to="/wallet"
            className="inline-flex items-center gap-2 rounded-lg bg-trust px-5 py-3 text-sm font-medium text-white shadow-glow hover:opacity-90"
          >
            Open KYRA Wallet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} KYRA · Decentralized banking trust infrastructure · Prototype demo.
        </div>
      </footer>
    </div>
  );
}
