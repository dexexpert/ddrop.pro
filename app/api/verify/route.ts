import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { addDays, toIso } from "@/lib/server-utils";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

type VerifyBody = { token: string };

export async function POST(req: Request) {
  const body = (await req.json()) as VerifyBody;

  if (!body.token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const supabase = supabaseServer();
  const appUrl = process.env.APP_BASE_URL;

  if (!appUrl) {
    return NextResponse.json(
      { error: "Missing APP_BASE_URL." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("verify_token", body.token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token." }, { status: 404 });
  }

  if (data.is_verified) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  const now = new Date();
  const releaseAt = addDays(
    addDays(now, data.checkin_interval_days),
    data.grace_days
  );

  const { error: updateError } = await supabase
    .from("drops")
    .update({
      is_verified: true,
      verified_at: toIso(now),
      last_checkin_at: toIso(now),
      release_at: toIso(releaseAt),
    })
    .eq("id", data.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const checkinUrl = `${appUrl}/alive/${data.checkin_token}`;
  const receiptUrl = `${appUrl}/receipt/${data.id}`;

  await sendEmail({
    to: data.user_email,
    subject: "Your DEADDROP is active",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your drop is active</h2>
        <p>Bookmark your check-in link:</p>
        <p><a href="${checkinUrl}">${checkinUrl}</a></p>
        <p>Receipt: <a href="${receiptUrl}">${receiptUrl}</a></p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
