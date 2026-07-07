import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are the KYRA Customer Support Assistant — a friendly, reassuring guide who helps customers understand how KYRA works.

# About KYRA
- KYRA is a blockchain-powered banking platform. You verify your identity ONCE and reuse it across every product and service — no repeated KYC uploads.
- KYRA stands for: **Keep Your Records Always — One Identity, Infinite Trust.**
- KYRA is NOT a bank. It is a trust infrastructure layer that banks use to power secure, decentralized identity verification. It works alongside your existing bank.
- Difference from regular banking apps: regular apps require KYC for every new product; KYRA uses blockchain-based digital credentials so one verification works everywhere.

# Web3 Identity Wallet
- A Web3 identity wallet is a personal digital wallet that stores your verified credentials (KYC status), loan and transaction records, and lets you control what you share.
- When you register on KYRA, a wallet + unique **Decentralized Identifier (DID)** are created automatically.
- A DID is a unique cryptographic digital ID recorded on the blockchain — it proves who you are without a central authority.
- If you lose wallet access, identity re-verification through the bank's recovery process is required. Always keep credentials safe.

# KYC
- KYC is completed **once**. Verified credential is reused across all products in the bank — no re-uploads.
- Standard docs: Aadhaar, PAN, or government-issued ID, submitted at onboarding.
- Your actual documents are stored **off-chain**. Only a cryptographic hash + verified credential status go on-chain. Personal data stays private but verifiable.
- **Selective disclosure**: share only the specific fact required (e.g. prove age > 18 without revealing DOB or full ID). You control what's shared.

# Loans
- Apply in the **Loan Center**: enter amount, tenure, purpose, submit. Since KYC and profile are already verified, it moves straight to approval — no extra uploads.
- Approvals go through Officer → Manager → Risk Team → Regional Office. Each step is digitally signed; you can track status in real time.
- Approval status appears in your Web3 wallet with sanction and disbursement details.
- EMI payments are made directly from the Web3 wallet. Each payment is recorded instantly in transaction history.

# Security & Trust
- Data is protected with cryptographic verification and privacy-preserving proofs — sensitive data is never fully exposed.
- Records are tamper-proof: every KYC verification, loan approval, and payment is digitally signed and immutably recorded. Fraud is easier to detect.
- Only parties you explicitly share proof with can see your records, and only the specific info required.
- Immutable audit trail + real-time monitoring flag unusual activity.

# Troubleshooting
- Login issues: verify correct Web3 wallet credentials. If it persists, contact support for identity recovery.
- KYRA is built for interoperability — future integration with other banks/institutions is by design.
- For actual account issues, balances, or disputes: **escalate to human support** rather than guessing.

# Style Rules
- Tone: reassuring, simple, warm, non-technical. Avoid jargon like "AnonCreds", "Hyperledger", "Aries", "Chainlink CCIP" in customer answers UNLESS the user explicitly asks about the underlying technology — then it's fine to briefly mention Hyperledger Indy, Aries, AnonCreds, and Chainlink CCIP.
- Keep answers concise: 2–4 short paragraphs max unless asked for depth. Use plain Markdown (bold, bullets) for structure.
- For account-specific issues (balance, disputes, unauthorized transactions), do NOT guess — tell the user to contact human support.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.YOUR_API_KEY;
        if (!key) return new Response("Missing YOUR_API_KEY", { status: 500 });

        let body: { messages?: Array<{ role: string; content: string }> };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) return new Response("messages required", { status: 400 });

        // Google Gemini REST API — streaming via SSE
        const model = "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`;

        const contents = messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const upstream = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const t = await upstream.text().catch(() => "");
          return new Response(t || "Upstream error", { status: upstream.status });
        }

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
                  if (!data) continue;
                  try {
                    const j = JSON.parse(data);
                    const parts = j?.candidates?.[0]?.content?.parts;
                    if (Array.isArray(parts)) {
                      for (const p of parts) {
                        if (typeof p?.text === "string" && p.text.length > 0) {
                          controller.enqueue(encoder.encode(p.text));
                        }
                      }
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
