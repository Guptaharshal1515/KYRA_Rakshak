import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ActivityEvent = {
  id: string;
  label: string;
  amount: string;
  provenance: "on-chain" | "off-chain";
  tx_hash: string | null;
  kind: string;
  created_at: string;
};

const MOCK_EVENTS: Array<Omit<ActivityEvent, "id" | "created_at">> = [
  { label: "Credential Shared · Age Proof", amount: "—", provenance: "on-chain", tx_hash: randHash(), kind: "credential" },
  { label: "EMI Auto-Pay · Home Loan", amount: "−₹42,180", provenance: "on-chain", tx_hash: randHash(), kind: "payment" },
  { label: "Merchant Payment · Amazon", amount: "−₹2,499", provenance: "off-chain", tx_hash: null, kind: "transaction" },
  { label: "Loan Sanction · Personal Loan", amount: "+₹1,50,000", provenance: "on-chain", tx_hash: randHash(), kind: "loan" },
  { label: "KYC Re-attestation · Verified", amount: "—", provenance: "on-chain", tx_hash: randHash(), kind: "credential" },
  { label: "Salary Credit", amount: "+₹1,25,000", provenance: "off-chain", tx_hash: null, kind: "transaction" },
  { label: "Approval · Manager L2 Signed", amount: "—", provenance: "on-chain", tx_hash: randHash(), kind: "approval" },
  { label: "UPI Transfer · Rent", amount: "−₹28,000", provenance: "off-chain", tx_hash: null, kind: "transaction" },
];

function randHash() {
  const chars = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

export function useActivityFeed(limit = 8) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase
        .from("activity_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (mounted && data) {
        setEvents(data as ActivityEvent[]);
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel("activity_events_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activity_events" },
        (payload) => {
          setEvents((prev) => [payload.new as ActivityEvent, ...prev].slice(0, limit));
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  const emitMock = useCallback(async () => {
    const pick = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
    await supabase.from("activity_events").insert({
      ...pick,
      tx_hash: pick.tx_hash ? randHash() : null,
    });
  }, []);

  return { events, loading, emitMock };
}
