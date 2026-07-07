import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { VerifiedBadge, Hash } from "@/components/trust-badges";
import { CheckCircle2, UploadCloud, Wallet, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · KYRA" },
      { name: "description", content: "Create your decentralized identity and issue verifiable credentials." },
    ],
  }),
  component: Onboarding,
});

const generatedDid = "did:indy:bcovrin:8f7a3e9c6f70b42e9d1c5a8b3e2f";

function Onboarding() {
  const [step, setStep] = useState(0);
  const [issuing, setIssuing] = useState(false);
  const navigate = useNavigate();

  async function issueDid() {
    setIssuing(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIssuing(false);
    setStep(1);
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Onboarding</h1>
          <p className="text-sm text-muted-foreground">Set up your KYRA identity in three quick steps.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {["Create Wallet", "Complete KYC", "Confirmation"].map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  i <= step ? "bg-trust text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <div className={`text-xs font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </div>
              {i < 2 && <div className={`h-px flex-1 ${i < step ? "bg-trust" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-trust-gradient shadow-glow">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">Create your Web3 Identity Wallet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll generate a Decentralized Identifier (DID) issued on Hyperledger Indy. You control the keys.
              </p>
              <button
                onClick={issueDid}
                disabled={issuing}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow disabled:opacity-70"
              >
                {issuing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                {issuing ? "Generating DID…" : "Create Wallet"}
              </button>
              {issuing && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="font-mono text-xs text-muted-foreground animate-pulse">
                    generating keypair…
                  </div>
                  <div className="font-mono text-xs text-muted-foreground animate-pulse">
                    anchoring DID on Indy ledger…
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <h2 className="text-lg font-semibold">Complete KYC (one time only)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your identity documents. They will be verified and issued as reusable credentials.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {["Aadhaar", "PAN", "Address Proof", "Income Proof"].map((d) => (
                <label
                  key={d}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border p-4 hover:bg-muted/60"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                    <UploadCloud className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{d}</div>
                    <div className="text-xs text-muted-foreground">Click to upload (mock)</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setStep(0)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Back
              </button>
              <button
                onClick={() => {
                  toast.success("Credentials issued");
                  setStep(2);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
              >
                Submit &amp; Issue Credentials <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-trust-soft">
                <CheckCircle2 className="h-8 w-8 text-trust" />
              </div>
              <h2 className="mt-4 text-xl font-semibold">You're all set!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your decentralized identity is live and your verifiable credentials have been issued.
              </p>
            </div>
            <div className="mt-6 rounded-xl border border-border p-5">
              <div className="text-xs text-muted-foreground">Your DID</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <Hash value={generatedDid} className="text-sm text-foreground" />
                <VerifiedBadge label="Anchored on Indy" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {["Aadhaar Identity", "PAN Card", "Address Proof", "Income Proof"].map((c) => (
                <div key={c} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <span>{c}</span>
                  <VerifiedBadge label="Credential Issued" />
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate({ to: "/wallet" })}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-glow"
            >
              Open my KYRA Wallet <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
