import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, UserCircle2, Lock, EyeOff, ShieldCheck, Landmark } from "lucide-react";
import heroCoins from "@/assets/hero-coins.jpg";
import kyraLogo from "@/assets/kyra-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KYRA — One Identity. Every Record. Infinite Trust." },
      {
        name: "description",
        content:
          "KYRA empowers you to own your digital identity, verify once, share selectively, and manage your financial records with complete privacy and transparency.",
      },
      { property: "og:title", content: "KYRA — One Identity. Every Record. Infinite Trust." },
      {
        property: "og:description",
        content:
          "KYRA empowers you to own your digital identity, verify once, share selectively, and manage your financial records with complete privacy and transparency.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Technology", href: "#tech" },
  { label: "Whitepaper", href: "#whitepaper" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Contact", href: "#contact" },
];

const pillars = [
  { icon: UserCircle2, title: "You Own", sub: "Your Identity" },
  { icon: Lock, title: "You Control", sub: "Your Data" },
  { icon: EyeOff, title: "You Decide", sub: "What to Share" },
  { icon: ShieldCheck, title: "Built on", sub: "Privacy & Trust" },
  { icon: Landmark, title: "Verifiable", sub: "Tamper-proof Records" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Nav */}
      <header className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={kyraLogo} alt="KYRA" className="h-11 w-11" width={44} height={44} />
          <div className="leading-tight">
            <div className="text-2xl font-bold tracking-tight text-foreground">KYRA</div>
            <div className="text-[11px] tracking-wide text-muted-foreground">
              Keep Your Records Always
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-10 text-[15px] font-medium text-foreground/80 md:flex">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-elegant hover:shadow-glow transition-shadow"
        >
          Enter KYRA Wallet
          <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-8 px-8 pb-8 pt-8 md:grid-cols-2 md:pt-16">
        <div className="flex flex-col">
          <div className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Decentralized Trust Infrastructure
          </div>
          <h1 className="text-[64px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[80px]">
            <span className="block">One Identity.</span>
            <span className="block">Every Record.</span>
            <span className="block bg-trust-gradient bg-clip-text text-transparent">
              Infinite Trust.
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            KYRA empowers you to own your digital identity, verify once, share
            selectively, and manage your financial records with complete privacy
            and transparency.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 rounded-full bg-trust-gradient px-7 py-4 text-[15px] font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-shadow"
            >
              Enter KYRA Wallet
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/25">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-3 rounded-full border-2 border-primary bg-transparent px-7 py-4 text-[15px] font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              Explore Platform
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-primary">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative flex items-center justify-center">
          <img
            src={heroCoins}
            alt="KYRA glass coins floating"
            width={1280}
            height={1280}
            className="w-full max-w-[640px] rounded-3xl"
          />
        </div>
      </section>

      {/* Pillars strip */}
      <section className="mx-auto max-w-[1400px] px-8 pb-16">
        <div className="grid gap-2 rounded-3xl border border-white/60 bg-white/50 px-6 py-6 shadow-elegant backdrop-blur md:grid-cols-5">
          {pillars.map((p) => (
            <div key={p.title} className="flex items-center gap-4 px-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 text-primary">
                <p.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-[1400px] px-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} KYRA · Decentralized banking trust infrastructure · Prototype demo.
        </div>
      </footer>
    </div>
  );
}
