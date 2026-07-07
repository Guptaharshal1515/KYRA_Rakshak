import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are the KYRA Assistant — a friendly, concise guide for users of KYRA, a decentralized banking trust infrastructure demo.

KYRA in one line: "Keep Your Records Always — One Identity, Infinite Trust."

Core concepts you should explain clearly and simply:
- Decentralized Identifiers (DIDs) issued on Hyperledger Indy — the user owns their identity, not the bank.
- Verifiable Credentials (VCs) via Hyperledger Aries — reusable digital proofs (KYC, PAN, income, loan agreement).
- Selective Disclosure with AnonCreds — share ONLY what's needed (e.g. prove "age > 18" without revealing DOB) using zero-knowledge proofs.
- Multi-level bank approval pipelines — every step is digitally signed and immutably logged.
- Cross-chain interoperability via Chainlink CCIP — credentials work across banks and networks.
- On-Chain vs Off-Chain data — hashes and proofs go on-chain; documents stay in secure off-chain storage.

Tone: warm, precise, fintech-professional. Avoid crypto-bro language. Keep answers short (2–4 short paragraphs max) unless the user asks for depth. Use plain Markdown for structure.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let body: { messages?: Array<{ role: string; content: string }> };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) return new Response("messages required", { status: 400 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            stream: true,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const t = await upstream.text().catch(() => "");
          return new Response(t || "Upstream error", { status: upstream.status });
        }

        // Parse SSE upstream, emit plaintext delta stream to client.
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const reader = upstream.body!.getReader();
            const decoder = new TextDecoder();
            const encoder = new TextEncoder();
            let buf = "";
            try {
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  const l = line.trim();
                  if (!l.startsWith("data:")) continue;
                  const data = l.slice(5).trim();
                  if (!data || data === "[DONE]") continue;
                  try {
                    const j = JSON.parse(data);
                    const delta = j?.choices?.[0]?.delta?.content;
                    if (typeof delta === "string" && delta.length > 0) {
                      controller.enqueue(encoder.encode(delta));
                    }
                  } catch {
                    /* ignore malformed line */
                  }
                }
              }
            } catch (e) {
              controller.error(e);
              return;
            }
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-cache",
          },
        });
      },
    },
  },
});
