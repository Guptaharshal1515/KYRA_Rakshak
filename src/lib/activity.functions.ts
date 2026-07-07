import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const EventInput = z.object({
  label: z.string().min(1).max(200),
  amount: z.string().max(60),
  provenance: z.enum(["on-chain", "off-chain"]),
  tx_hash: z.string().max(80).nullable(),
  kind: z.string().max(40),
});

export const emitActivityEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => EventInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("activity_events").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
