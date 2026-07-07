import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { ProvenanceBadge, Hash } from "@/components/trust-badges";
import {
  user,
  stats,
  loans,
  short,
} from "@/lib/mock-data";
import { useActivityFeed } from "@/hooks/use-activity-feed";
import { useEffect } from "react";
import { Radio, Zap } from "lucide-react";
import {
  ArrowUpRight,
  Copy,
  Landmark,
  Send,
  Share2,
  Wallet,
  TrendingUp,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · KYRA" },
      { name: "description", content: "Your identity, credentials, loans and on-chain activity at a glance." },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  label,
  value,
  provenance,
  trend,
  score,
}: {
  label: string;
  value: string;
  provenance?: "on-chain" | "off-chain";
  trend?: string;
  score?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {trend && <TrendingUp className="h-4 w-4 text-trust" />}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {provenance && <ProvenanceBadge value={provenance} />}
        {score && (
          <span className="inline-flex items-center rounded-full bg-trust-soft px-2 py-0.5 text-[10px] font-medium text-trust">
            {score}
          </span>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { events, emitMock } = useActivityFeed(6);

  // Auto-emit a mock blockchain event every 12s while dashboard is open,
  // so the real-time feed feels alive across all open sessions.
  useEffect(() => {
    const t = setInterval(() => {
      emitMock();
    }, 12000);
    return () => clearInterval(t);
  }, [emitMock]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Here's what's happening with your identity and accounts.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            This Month
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Assets (Mock)" value={stats.totalAssets} provenance="off-chain" />
          <StatCard label="Active Loans" value={String(stats.activeLoans)} provenance="on-chain" />
          <StatCard label="Total Transactions" value={String(stats.totalTransactions)} provenance="on-chain" />
          <StatCard label="Trust Score" value={`${stats.trustScore}/100`} score="Excellent" trend="up" />
        </div>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-2xl bg-hero-gradient p-8 text-white shadow-elegant">
          <div className="max-w-lg">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              One Identity.
              <br />
              All Your Financial World.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              KYRA lets you prove, share and manage your verified records with
              complete privacy and transparency.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/wallet"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-white/90"
              >
                Open Wallet
              </Link>
              <Link
                to="/kyc-vault"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                View Credentials
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account overview */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Account Overview</div>
              <ProvenanceBadge value="off-chain" />
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Total Balance (Mock)</div>
            <div className="text-3xl font-semibold tracking-tight">₹3,85,240.00</div>
            <div className="mt-4">
              <div className="text-xs text-muted-foreground">Account Number</div>
              <div className="mt-1 font-mono text-sm">XXXX XXXX XXXX 4521</div>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 text-xs">
              {[
                { icon: Landmark, label: "Pay EMI" },
                { icon: Send, label: "Send Money" },
                { icon: Wallet, label: "View Loans" },
                { icon: Share2, label: "Share Proof" },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => toast.success(`${a.label} (mock action)`)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-background p-3 hover:bg-muted"
                >
                  <a.icon className="h-4 w-4 text-primary" />
                  <span className="text-[11px] font-medium">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Recent Activity</div>
              <Link to="/audit" className="text-xs font-medium text-trust hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {transactions.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium">{t.label}</div>
                      <div className="text-sm font-semibold">{t.amount}</div>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{t.ts}</span>
                      <ProvenanceBadge value={t.provenance} />
                      {t.tx !== "—" && <Hash value={short(t.tx, 6, 4)} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loans + Identity status */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Active Loans</div>
              <Link to="/loan-center" className="text-xs font-medium text-trust hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {loans.map((l) => (
                <div key={l.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{l.name}</div>
                    <span className="rounded-full bg-trust-soft px-2 py-0.5 text-[10px] font-medium text-trust">
                      Active
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground">Outstanding</div>
                      <div className="mt-0.5 font-semibold">{l.outstanding}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">EMI</div>
                      <div className="mt-0.5 font-semibold">{l.emi}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Due Date</div>
                      <div className="mt-0.5 font-semibold">{l.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Interest Rate</div>
                      <div className="mt-0.5 font-semibold">{l.interest}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground">Disbursement Tx</div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Hash value={short(l.disbursementTx, 6, 4)} />
                        <ProvenanceBadge value="on-chain" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Identity Status</div>
              <VerifiedBadge />
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-trust-soft/60 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-trust" />
              <div>
                <div className="text-sm font-semibold">Verified Identity</div>
                <div className="text-xs text-muted-foreground">
                  Your identity is verified and secured on Hyperledger Indy.
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="text-muted-foreground">DID</div>
                <div className="mt-1 flex items-center gap-2">
                  <Hash value={short(user.did, 20, 6)} />
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(user.did);
                      toast.success("DID copied");
                    }}
                    className="rounded p-1 hover:bg-muted"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-muted-foreground">DID Method</div>
                  <div className="mt-0.5 font-medium">indy</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Public Key</div>
                  <div className="mt-0.5 font-mono">{short(user.publicKey, 6, 4)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Issuer</div>
                  <div className="mt-0.5 font-medium">{user.issuer}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Issued On</div>
                  <div className="mt-0.5 font-medium">{user.issuedOn}</div>
                </div>
              </div>
            </div>
            <Link
              to="/wallet"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
            >
              Open Wallet <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Provenance legend */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <ProvenanceBadge value="on-chain" />
            <div className="text-xs text-muted-foreground">Stored on Hyperledger Indy</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <ProvenanceBadge value="off-chain" />
            <div className="text-xs text-muted-foreground">Stored in secure systems</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <VerifiedBadge label="Immutable" />
            <div className="text-xs text-muted-foreground">Tamper-proof &amp; auditable</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
