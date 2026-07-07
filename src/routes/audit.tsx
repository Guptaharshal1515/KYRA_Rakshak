import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { ProvenanceBadge, VerifiedBadge, Hash } from "@/components/trust-badges";
import { auditEvents, short } from "@/lib/mock-data";
import { Search, Activity, AlertTriangle, Users } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit & Reports · KYRA" },
      { name: "description", content: "Immutable, real-time event feed for every on-chain action." },
    ],
  }),
  component: Audit,
});

function Audit() {
  const [q, setQ] = useState("");
  const filtered = auditEvents.filter(
    (e) => e.label.toLowerCase().includes(q.toLowerCase()) || e.who.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit &amp; Reports</h1>
          <p className="text-sm text-muted-foreground">
            Every on-chain event, verifiable and immutable — powered by Hyperledger Indy.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Total Transactions", value: "12,483", icon: Activity, tint: "text-primary bg-muted" },
            { label: "Active Users", value: "3,247", icon: Users, tint: "text-trust bg-trust-soft" },
            { label: "Fraud Flags", value: "2", icon: AlertTriangle, tint: "text-warn-foreground bg-warn/20" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-xl font-semibold tracking-tight">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold">Live Event Feed</div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events…"
                className="rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="mt-4 divide-y divide-border">
            {filtered.map((e, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3 py-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{e.label}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {e.who} · {e.ts}
                  </div>
                </div>
                {e.tx !== "—" && <Hash value={short(e.tx, 8, 6)} />}
                <ProvenanceBadge value={e.type} />
                <VerifiedBadge label="Immutable" />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">No events match your search.</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
