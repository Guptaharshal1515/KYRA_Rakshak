import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { ProvenanceBadge, VerifiedBadge } from "@/components/trust-badges";
import { credentials, type Credential } from "@/lib/mock-data";
import { FileCheck2, Share2, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/kyc-vault")({
  head: () => ({
    meta: [
      { title: "KYC Vault · KYRA" },
      { name: "description", content: "DigiLocker-style store of your verifiable credentials." },
    ],
  }),
  component: Vault,
});

function ShareModal({ cred, onClose }: { cred: Credential; onClose: () => void }) {
  const [shared, setShared] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/40 backdrop-blur-sm">
      <div className="w-[min(480px,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-6 shadow-elegant">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Selective Disclosure · AnonCreds ZK-Proof</div>
            <div className="mt-1 text-lg font-semibold">Share {cred.type}</div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <div className="rounded-lg border border-border p-3">
            <label className="flex items-center justify-between">
              <span>Prove: Age &gt; 18</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-current" />
            </label>
          </div>
          <div className="rounded-lg border border-border p-3">
            <label className="flex items-center justify-between">
              <span>Prove: PAN is valid</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-current" />
            </label>
          </div>
          <div className="rounded-lg border border-border p-3 opacity-60">
            <label className="flex items-center justify-between">
              <span>Reveal: Full name</span>
              <input type="checkbox" className="h-4 w-4 accent-current" />
            </label>
          </div>
        </div>
        {!shared ? (
          <button
            onClick={() => {
              setShared(true);
              toast.success("Proof generated & shared");
            }}
            className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
          >
            Generate &amp; Share Zero-Knowledge Proof
          </button>
        ) : (
          <div className="mt-6 rounded-lg bg-trust-soft p-4 text-sm text-trust">
            ✓ ZK proof shared. Verifier confirmed the claims without seeing your document.
          </div>
        )}
      </div>
    </div>
  );
}

function Vault() {
  const [share, setShare] = useState<Credential | null>(null);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">KYC Vault</h1>
          <p className="text-sm text-muted-foreground">
            Your verifiable credentials, stored securely and shareable with zero-knowledge proofs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c) => (
            <div key={c.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust-soft text-trust">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <VerifiedBadge />
              </div>
              <div className="mt-4">
                <div className="text-sm font-semibold">{c.type}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">Issued by {c.issuer}</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <ProvenanceBadge value={c.provenance} />
                <span className="text-[11px] text-muted-foreground">· {c.issuedOn}</span>
              </div>
              <div className="mt-4 rounded-lg bg-muted/60 p-3">
                <div className="text-[11px] font-medium text-muted-foreground">Used by</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {c.usedBy.map((u) => (
                    <span key={u} className="rounded-full bg-background px-2 py-0.5 text-[11px] text-foreground">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShare(c)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs font-medium hover:bg-muted"
              >
                <Share2 className="h-3.5 w-3.5" /> Share Selectively
              </button>
            </div>
          ))}
        </div>
      </div>
      {share && <ShareModal cred={share} onClose={() => setShare(null)} />}
    </AppLayout>
  );
}
