import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  projectType: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(5000),
  /** Honeypot — must be empty. */
  company: z.string().optional(),
});

/**
 * Contact route handler.
 *
 * Provider hook (configure via environment variables, see .env.example):
 *  - RESEND_API_KEY      → delivered through Resend to CONTACT_TO
 *  - CONTACT_WEBHOOK_URL → JSON POST to any webhook inbox (Slack, Make, n8n…)
 *  - neither set         → 501, and the UI falls back to the direct email / mailto
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Some fields need attention.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, projectType, message, company } = parsed.data;

  // honeypot tripped — pretend success, send nothing
  if (company && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const to = process.env.CONTACT_TO ?? "hello@mufasa.studio";
  const from = process.env.CONTACT_FROM ?? "MUFASA® site <onboarding@resend.dev>";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `New project enquiry — ${projectType} — ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[contact] resend error:", err);
      return NextResponse.json(
        { message: "The form couldn't be delivered right now — please email directly." },
        { status: 502 }
      );
    }
  }

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, projectType, message, source: "mufasa-portfolio" }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[contact] webhook error:", err);
      return NextResponse.json(
        { message: "The form couldn't be delivered right now — please email directly." },
        { status: 502 }
      );
    }
  }

  // No provider configured — never fake success.
  return NextResponse.json(
    {
      ok: false,
      provider: "none",
      message: "Form delivery isn't configured — use the direct email address.",
    },
    { status: 501 }
  );
}
