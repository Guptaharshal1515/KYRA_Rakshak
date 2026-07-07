import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { ProvenanceBadge, Hash } from "@/components/trust-badges";
import { loans, short } from "@/lib/mock-data";
import { PenSquare, CheckCircle2, Clock, Landmark } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/loan-center")({
  head: () => ({
    meta: [
      { title: "Loan Center · KYRA" },
      { name: "description", content: "Apply for loans and track multi-level approval pipelines on-chain." },
    ],
  }),
  component: LoanCenter,
});

const pipeline = [
  { role: "Loan Officer", who: "Priya S.", ts: "Today · 10:14", state: "approved" as const },
  { role: "Branch Manager", who: "Rakesh P.", ts: "Today · 11:02", state: "approved" as const },
  { role: "Risk Team", who: "Auto Risk Engine", ts: "Today · 11:47", state: "pending" as const },
  { role: "Regional Office", who: "—", ts: "Pending", state: "pending" as const },
];

function LoanCenter() {
  const [amount, setAmount] = useState("500000");
  const [tenure, setTenure] = useState("36");
  const [purpose, setPurpose] = useState("Home renovation");

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Loan Center</h1>
          <p className="text-sm text-muted-foreground">
            Apply for a loan using your verified credentials. Every approval is digitally signed and logged on-chain.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Application submitted to Loan Officer");
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-elegant lg:col-span-2"
          >
            <div className="text-sm font-semibold">New Loan Application</div>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <label className="text-xs text-muted-foreground">Amount (₹)</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Tenure (months)</label>
                <input
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Purpose</label>
                <input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
              >
                Submit Application
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Approval Pipeline · Request #REQ-8271</div>
              <ProvenanceBadge value="on-chain" />
            </div>
            <div className="mt-6 space-y-4">
              {pipeline.map((s, i) => (
                <div key={s.role} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full ${
                        s.state === "approved"
                          ? "bg-trust text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.state === "approved" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    {i < pipeline.length - 1 && (
                      <div className={`mt-1 h-10 w-px ${s.state === "approved" ? "bg-trust" : "bg-border"}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold">{s.role}</div>
                      {s.state === "approved" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-trust-soft px-2 py-0.5 text-[11px] text-trust">
                          <PenSquare className="h-3 w-3" /> Digitally Signed
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {s.who} · {s.ts}
                    </div>
                    {s.state === "approved" && (
                      <div className="mt-1">
                        <Hash value={`0x${(i + 1).toString().padStart(2, "0")}a4b1c8f9d3e5b7a6c2d4e8f0a1b3c5d7`} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold">Active Loans</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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
                  <div>
                    <div className="text-muted-foreground">Outstanding</div>
                    <div className="mt-0.5 text-sm font-semibold">{l.outstanding}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">EMI</div>
                    <div className="mt-0.5 text-sm font-semibold">{l.emi}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Interest</div>
                    <div className="mt-0.5 text-sm font-semibold">{l.interest}</div>
                  </div>
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
        </div>
      </div>
    </AppLayout>
  );
}
