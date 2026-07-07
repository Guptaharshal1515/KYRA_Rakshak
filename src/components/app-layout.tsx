import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  UserPlus,
  ShieldCheck,
  Landmark,
  Wallet,
  ClipboardCheck,
  FileSearch,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { user } from "@/lib/mock-data";
import { ChatBot } from "@/components/chatbot";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/onboarding", label: "Onboarding", icon: UserPlus },
  { to: "/kyc-vault", label: "KYC Vault", icon: ShieldCheck },
  { to: "/loan-center", label: "Loan Center", icon: Landmark },
  { to: "/wallet", label: "Web3 Wallet", icon: Wallet },
  { to: "/approvals", label: "Approvals & Tasks", icon: ClipboardCheck },
  { to: "/audit", label: "Audit & Reports", icon: FileSearch },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-trust-gradient shadow-glow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
          <path
            d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-base font-semibold tracking-tight text-sidebar-foreground">KYRA</div>
        <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
          Know Your Records
        </div>
      </div>
    </Link>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 bg-sidebar p-4 md:flex">
        <div className="pt-2">
          <Logo />
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-sidebar-border/60 bg-sidebar-accent/40 p-3 text-xs text-sidebar-foreground/80">
          <div className="mb-1 font-medium text-sidebar-foreground">Connected Wallet</div>
          <div className="font-mono text-[11px] text-sidebar-foreground/60">kyra_wallet_01</div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-trust/20 px-2 py-0.5 text-[10px] font-medium text-trust">
            <span className="h-1.5 w-1.5 rounded-full bg-trust" /> Active
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">
            Welcome back, <span className="text-foreground font-medium">{user.name.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 hover:bg-muted" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user.initials}
              </div>
              <div className="hidden text-right leading-tight sm:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-[11px] text-muted-foreground">Verified Identity</div>
              </div>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-6 md:p-8">{children}</main>
      </div>

      <ChatBot />
    </div>
  );
}
