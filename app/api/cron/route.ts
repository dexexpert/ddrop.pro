import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseServer } from "@/lib/supabase";
import { addDays, toIso } from "@/lib/server-utils";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const daysBetween = (a: Date, b: Date) => {
  const diff = a.getTime() - b.getTime();
  return diff / (1000 * 60 * 60 * 24);
};

export async function POST() {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = headers().get("x-cron-secret");
    if (header !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const supabase = supabaseServer();
  const bucket = process.env.SUPABASE_BUCKET;
  const appUrl = process.env.APP_BASE_URL;

  if (!bucket || !appUrl) {
    return NextResponse.json(
      { error: "Missing SUPABASE_BUCKET or APP_BASE_URL." },
      { status: 500 }
    );
  }

  const now = new Date();

  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("status", "ACTIVE")
    .eq("is_verified", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const drop of data ?? []) {
    if (!drop.release_at || !drop.last_checkin_at) {
      continue;
    }
    const releaseAt = new Date(drop.release_at);
    const lastCheckinAt = new Date(drop.last_checkin_at);
    const lastCheckinSentAt = drop.last_checkin_sent_at
      ? new Date(drop.last_checkin_sent_at)
      : null;

    if (now > releaseAt) {
      const signed = await supabase.storage
        .from(bucket)
        .createSignedUrl(drop.encrypted_payload_url, 60 * 60 * 24 * 30);

      if (signed.error) {
        results.push({ id: drop.id, action: "release_failed" });
        continue;
      }

      const decryptUrl = `${appUrl}/decrypt`;
      const receiptUrl = `${appUrl}/receipt/${drop.id}`;

      await sendEmail({
        to: drop.recipient_email,
        subject: "DEADDROP release",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Release notice</h2>
            <p>The deadline was missed. The encrypted payload is ready.</p>
            <p><a href="${signed.data.signedUrl}">Download encrypted payload</a></p>
            <p>Decrypt instructions: <a href="${decryptUrl}">${decryptUrl}</a></p>
            <p>Passphrase hint: ${drop.passphrase_hint ?? "-"}</p>
            <p>Receipt: <a href="${receiptUrl}">${receiptUrl}</a></p>
          </div>
        `,
      });

      await supabase
        .from("drops")
        .update({ status: "RELEASED", released_at: toIso(now) })
        .eq("id", drop.id);

      results.push({ id: drop.id, action: "released" });
      continue;
    }

    const due =
      daysBetween(now, lastCheckinAt) >= drop.checkin_interval_days;
    const sentToday =
      lastCheckinSentAt && daysBetween(now, lastCheckinSentAt) < 1;

    if (due && !sentToday) {
      const checkinUrl = `${appUrl}/alive/${drop.checkin_token}`;

      await sendEmail({
        to: drop.user_email,
        subject: "DEADDROP check-in",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Check-in required</h2>
            <p>Click to reset your timer:</p>
            <p><a href="${checkinUrl}">${checkinUrl}</a></p>
          </div>
        `,
      });

      await supabase
        .from("drops")
        .update({ last_checkin_sent_at: toIso(now) })
        .eq("id", drop.id);

      results.push({ id: drop.id, action: "checkin_sent" });
    }
  }

  return NextResponse.json({ ok: true, results });
}

export async function GET() {
  return POST();
}
