import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { addDays, randomToken, toIso } from "@/lib/server-utils";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

type CreateBody = {
  user_email: string;
  recipient_email: string;
  passphrase_hint?: string;
  checkin_interval_days: number;
  grace_days: number;
  encrypted_payload_json: string;
  payload_hash: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as CreateBody;

  if (
    !body.user_email ||
    !body.recipient_email ||
    !body.checkin_interval_days ||
    !body.grace_days ||
    !body.encrypted_payload_json ||
    !body.payload_hash
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const supabase = supabaseServer();
  const bucket = process.env.SUPABASE_BUCKET;
  const appUrl = process.env.APP_BASE_URL;

  if (!bucket) {
    return NextResponse.json(
      { error: "Missing SUPABASE_BUCKET." },
      { status: 500 }
    );
  }
  if (!appUrl) {
    return NextResponse.json(
      { error: "Missing APP_BASE_URL." },
      { status: 500 }
    );
  }

  const id = crypto.randomUUID();
  const path = `drops/${id}.json`;
  const now = new Date();
  const releaseAt = addDays(
    addDays(now, body.checkin_interval_days),
    body.grace_days
  );

  const upload = await supabase.storage
    .from(bucket)
    .upload(path, Buffer.from(body.encrypted_payload_json, "utf-8"), {
      contentType: "application/json",
      upsert: false,
    });

  if (upload.error) {
    return NextResponse.json(
      { error: upload.error.message },
      { status: 500 }
    );
  }

  const verifyToken = randomToken();
  const checkinToken = randomToken();

  const { error } = await supabase.from("drops").insert({
    id,
    user_email: body.user_email,
    recipient_email: body.recipient_email,
    encrypted_payload_url: path,
    payload_hash: body.payload_hash,
    passphrase_hint: body.passphrase_hint ?? null,
    checkin_interval_days: body.checkin_interval_days,
    grace_days: body.grace_days,
    last_checkin_at: toIso(now),
    release_at: toIso(releaseAt),
    status: "ACTIVE",
    created_at: toIso(now),
    is_verified: false,
    verify_token: verifyToken,
    checkin_token: checkinToken,
    last_checkin_sent_at: null,
    released_at: null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const verifyUrl = `${appUrl}/verify/${verifyToken}`;

  await sendEmail({
    to: body.user_email,
    subject: "Confirm your DEADDROP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Confirm your DEADDROP</h2>
        <p>Click the link below to activate your drop:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>If you didn't create this, ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({
    id,
    receipt_url: `${appUrl}/receipt/${id}`,
    checkin_url: `${appUrl}/alive/${checkinToken}`,
    verify_required: true,
  });
}
