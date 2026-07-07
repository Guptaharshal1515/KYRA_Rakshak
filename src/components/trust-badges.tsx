import { cn } from "@/lib/utils";
import type { Provenance } from "@/lib/mock-data";

export function ProvenanceBadge({
  value,
  className,
}: {
  value: Provenance;
  className?: string;
}) {
  const onChain = value === "on-chain";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        onChain
          ? "bg-chain/10 text-chain"
          : "bg-offchain/10 text-offchain",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          onChain ? "bg-chain" : "bg-offchain",
        )}
      />
      {onChain ? "On-Chain" : "Off-Chain"}
    </span>
  );
}

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-trust-soft px-2 py-0.5 text-[11px] font-medium text-trust">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-trust">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
      {label}
    </span>
  );
}

export function Hash({ value, className }: { value: string; className?: string }) {
  return (
    <code
      title={value}
      className={cn(
        "font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      {value}
    </code>
  );
}
