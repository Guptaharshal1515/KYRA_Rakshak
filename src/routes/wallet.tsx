import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { ProvenanceBadge, VerifiedBadge, Hash } from "@/components/trust-badges";
import {
  user,
  loans,
  credentials,
  transactions,
  auditEvents,
  short,
  type Credential,
} from "@/lib/mock-data";
import {
  Copy,
  Landmark,
  Share2,
  Wallet as WalletIcon,
  PenSquare,
  ShieldCheck,
  X,
  Loader2,
  CheckCircle2,
  Activity,
  KeyRound,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Web3 Wallet · KYRA" },
      { name: "description", content: "Your KYRA wallet — credentials, loans, transactions and DID-signed activity." },
    ],
  }),
  component: WalletPage,
});

type Tab = "credentials" | "loans" | "transactions" | "activity" | "security";

function Tabs({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "credentials", label: "Credentials" },
    { id: "loans", label: "Loans" },
    { id: "transactions", label: "Transactions" },
    { id: "activity", label: "Activity" },
    { id: "security", label: "Security" },
  ];
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => setTab(i.id)}
          className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === i.id
              ? "bg-primary text-primary-foreground shadow-elegant"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}

function ShareModal({ cred, onClose }: { cred: Credential; onClose: () => void }) {
  const [shared, setShared] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/40 backdrop-blur-sm">
      <div className="w-[min(460px,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-6 shadow-elegant">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Selective Disclosure · ZK-Proof</div>
            <div className="mt-1 text-lg font-semibold">Share only: Age &gt; 18</div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 rounded-lg bg-muted/60 p-4 text-sm">
          <div>Source credential: <b>{cred.type}</b></div>
          <div className="mt-1 text-xs text-muted-foreground">
            The verifier will only learn a Yes/No answer. Your name, DOB and document number are never revealed.
          </div>
        </div>
        {!shared ? (
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => {
                setShared(true);
                toast.success("ZK proof shared");
              }}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
            >
              Yes, share proof
            </button>
            <button onClick={onClose} className="rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-muted">
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-5 rounded-lg bg-trust-soft p-4 text-sm text-trust">
            ✓ Proof verified by requester. Your underlying document was never revealed.
          </div>
        )}
      </div>
    </div>
  );
}

function SignModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"request" | "signing" | "confirmed">("request");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/40 backdrop-blur-sm">
      <div className="w-[min(460px,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-6 shadow-elegant">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">DID Signature Request</div>
            <div className="mt-1 text-lg font-semibold">Sign Payment · EMI Home Loan</div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 space-y-2 rounded-lg bg-muted/60 p-4 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">To</span><span>IDBI Bank Limited</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold text-foreground">₹42,500</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Signer DID</span><Hash value={short(user.did, 14, 6)} /></div>
        </div>
        {state === "request" && (
          <button
            onClick={async () => {
              setState("signing");
              await new Promise((r) => setTimeout(r, 1200));
              setState("confirmed");
              toast.success("Transaction confirmed on-chain");
            }}
            className="mt-5 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
          >
            Sign with DID
          </button>
        )}
        {state === "signing" && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-muted py-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Signing on Hyperledger Indy…
          </div>
        )}
        {state === "confirmed" && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-trust-soft p-3 text-sm text-trust">
              <CheckCircle2 className="h-4 w-4" /> Confirmed on-chain
            </div>
            <button onClick={onClose} className="w-full rounded-lg border border-border py-2 text-sm hover:bg-muted">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WalletPage() {
  const [tab, setTab] = useState<Tab>("credentials");
  const [share, setShare] = useState<Credential | null>(null);
  const [sign, setSign] = useState(false);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Identity + Balance hero */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl bg-hero-gradient p-6 text-white shadow-elegant lg:col-span-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/15 text-lg font-semibold">
                  {user.initials}
                </div>
                <div>
                  <div className="text-lg font-semibold">{user.name}</div>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-trust/25 px-2 py-0.5 text-[11px] font-medium text-white">
                    <ShieldCheck className="h-3 w-3" /> Verified by {user.issuer}
                  </div>
                </div>
              </div>
              <ProvenanceBadge value="on-chain" className="!bg-white/15 !text-white" />
            </div>
            <div className="mt-6 rounded-xl bg-white/10 p-4">
              <div className="text-[11px] uppercase tracking-widest text-white/70">Decentralized Identifier</div>
              <div className="mt-1 flex items-center gap-2">
                <code className="font-mono text-sm">{short(user.did, 22, 6)}</code>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(user.did);
                    toast.success("DID copied");
                  }}
                  className="rounded p-1 hover:bg-white/10"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Balance Overview</div>
              <ProvenanceBadge value="off-chain" />
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">₹3,85,240.00</div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">XXXX XXXX XXXX 4521</div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-[11px]">
              {[
                { icon: Landmark, label: "Pay EMI", onClick: () => setSign(true) },
                { icon: FileCheck2, label: "Credentials", onClick: () => setTab("credentials") },
                { icon: Share2, label: "Share Proof", onClick: () => setShare(credentials[0]) },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-background p-3 hover:bg-muted"
                >
                  <a.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Tabs tab={tab} setTab={setTab} />

        {tab === "credentials" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {credentials.map((c) => (
              <div key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-elegant">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust-soft text-trust">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <VerifiedBadge />
                </div>
                <div className="mt-4 text-sm font-semibold">{c.type}</div>
                <div className="text-xs text-muted-foreground">Issued by {c.issuer} · {c.issuedOn}</div>
                <div className="mt-3">
                  <ProvenanceBadge value={c.provenance} />
                </div>
                <div className="mt-auto pt-5">
                  <button
                    onClick={() => setShare(c)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium hover:bg-muted"
                  >
                    <Share2 className="h-3.5 w-3.5" /> Selective Disclosure
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "loans" && (
          <div className="grid gap-4 md:grid-cols-2">
            {loans.map((l) => (
              <div key={l.id} className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust-soft text-trust">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{l.name}</div>
                      <div className="text-xs text-muted-foreground">Due {l.dueDate}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-trust-soft px-2 py-0.5 text-[10px] font-medium text-trust">
                    Active
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                  <div><div className="text-muted-foreground">Outstanding</div><div className="mt-0.5 text-sm font-semibold">{l.outstanding}</div></div>
                  <div><div className="text-muted-foreground">EMI</div><div className="mt-0.5 text-sm font-semibold">{l.emi}</div></div>
                  <div><div className="text-muted-foreground">Interest</div><div className="mt-0.5 text-sm font-semibold">{l.interest}</div></div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/60 p-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">Disbursement Tx</div>
                    <Hash value={short(l.disbursementTx, 8, 6)} />
                  </div>
                  <ProvenanceBadge value="on-chain" />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "transactions" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 border-b border-border p-4 last:border-b-0">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">{t.label}</div>
                    <div className="text-sm font-semibold">{t.amount}</div>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{t.ts}</span>
                    <ProvenanceBadge value={t.provenance} />
                    {t.tx !== "—" && <Hash value={short(t.tx, 8, 6)} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "activity" && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
            <div className="text-sm font-semibold">Your blockchain activity</div>
            <div className="mt-4 divide-y divide-border">
              {auditEvents.map((e, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{e.label}</div>
                    <div className="text-[11px] text-muted-foreground">{e.who} · {e.ts}</div>
                  </div>
                  {e.tx !== "—" && <Hash value={short(e.tx, 8, 6)} />}
                  <ProvenanceBadge value={e.type} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "security" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust-soft text-trust">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Public Key</div>
                  <div className="text-xs text-muted-foreground">Used to verify your signatures</div>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-muted/60 p-3">
                <Hash value={user.publicKey} className="text-sm text-foreground" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-muted-foreground">DID Method</div><div className="mt-0.5 font-medium">indy</div></div>
                <div><div className="text-muted-foreground">Issuer</div><div className="mt-0.5 font-medium">{user.issuer}</div></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust-soft text-trust">
                  <PenSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Sign a Transaction</div>
                  <div className="text-xs text-muted-foreground">Simulate a DID-signed payment</div>
                </div>
              </div>
              <button
                onClick={() => setSign(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
              >
                <WalletIcon className="h-4 w-4" /> Sign EMI Payment
              </button>
            </div>
          </div>
        )}
      </div>

      {share && <ShareModal cred={share} onClose={() => setShare(null)} />}
      {sign && <SignModal onClose={() => setSign(false)} />}
    </AppLayout>
  );
}
