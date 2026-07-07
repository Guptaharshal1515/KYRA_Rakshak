import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { ProvenanceBadge, Hash } from "@/components/trust-badges";
import { approvals, short } from "@/lib/mock-data";
import { ChevronDown, PenSquare, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Approvals & Tasks · KYRA" },
      { name: "description", content: "Bank staff view — review requests and sign approvals with your DID." },
    ],
  }),
  component: Approvals,
});

function SignModal({
  applicant,
  onClose,
}: {
  applicant: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<"idle" | "signing" | "done">("idle");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/40 backdrop-blur-sm">
      <div className="w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-6 shadow-elegant">
        <div className="text-xs text-muted-foreground">DID Signature Request</div>
        <div className="mt-1 text-lg font-semibold">Approve request from {applicant}</div>
        <div className="mt-4 space-y-2 rounded-lg bg-muted/60 p-4 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Signer DID</span><Hash value="did:indy:bcovrin:staff1234…" /></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Action</span><span>Approve credential proof</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Timestamp</span><span>{new Date().toLocaleString()}</span></div>
        </div>
        <div className="mt-6">
          {state === "idle" && (
            <button
              onClick={async () => {
                setState("signing");
                await new Promise((r) => setTimeout(r, 1200));
                setState("done");
                toast.success("Approval signed & anchored on-chain");
              }}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
            >
              Approve &amp; Sign with DID
            </button>
          )}
          {state === "signing" && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-muted py-3 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Signing…
            </div>
          )}
          {state === "done" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-trust-soft p-3 text-sm text-trust">
                <CheckCircle2 className="h-4 w-4" /> Approval confirmed on-chain
              </div>
              <button onClick={onClose} className="w-full rounded-lg border border-border py-2 text-sm hover:bg-muted">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Approvals() {
  const [open, setOpen] = useState<string | null>(null);
  const [signFor, setSignFor] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Approvals &amp; Tasks</h1>
          <p className="text-sm text-muted-foreground">Bank staff view — review, verify and sign pending requests.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <div className="grid grid-cols-12 gap-3 border-b border-border bg-muted/40 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <div className="col-span-3">Applicant</div>
            <div className="col-span-3">Requested</div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-2">Submitted</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          {approvals.map((a) => {
            const isOpen = open === a.id;
            return (
              <div key={a.id} className="border-b border-border last:border-b-0">
                <button
                  onClick={() => setOpen(isOpen ? null : a.id)}
                  className="grid w-full grid-cols-12 items-center gap-3 px-5 py-4 text-left text-sm hover:bg-muted/40"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {a.applicant.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium">{a.applicant}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{short(a.did, 14, 6)}</div>
                    </div>
                  </div>
                  <div className="col-span-3 text-sm">{a.requested}</div>
                  <div className="col-span-2">
                    <span className="rounded-full bg-warn/20 px-2 py-0.5 text-[11px] font-medium text-warn-foreground">
                      {a.stage}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground">{a.submitted}</div>
                  <div className="col-span-2 flex justify-end">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>
                {isOpen && (
                  <div className="grid gap-4 border-t border-border bg-muted/20 px-5 py-5 md:grid-cols-2">
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Applicant DID</div>
                        <Hash value={a.did} />
                      </div>
                      <div>
                        <div className="text-muted-foreground">Requested Amount</div>
                        <div className="text-sm font-semibold text-foreground">{a.amount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Required Proof</div>
                        <div className="text-foreground">Income &gt; ₹75,000/mo · KYC verified · No active default</div>
                      </div>
                      <ProvenanceBadge value="on-chain" />
                    </div>
                    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-4">
                      <div className="text-xs text-muted-foreground">
                        Verify the ZK proof from the applicant, then sign the approval with your organizational DID.
                      </div>
                      <button
                        onClick={() => setSignFor(a.applicant)}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
                      >
                        <PenSquare className="h-4 w-4" /> Approve &amp; Sign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {signFor && <SignModal applicant={signFor} onClose={() => setSignFor(null)} />}
    </AppLayout>
  );
}
