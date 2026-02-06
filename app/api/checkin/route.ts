import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { addDays, toIso } from "@/lib/server-utils";

export const runtime = "nodejs";

type CheckinBody = { token: string };

export async function POST(req: Request) {
  const body = (await req.json()) as CheckinBody;

  if (!body.token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("checkin_token", body.token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Invalid token." }, { status: 404 });
  }

  if (!data.is_verified) {
    return NextResponse.json({ error: "Drop not verified." }, { status: 403 });
  }
  if (data.status !== "ACTIVE") {
    return NextResponse.json({ error: "Drop already released." }, { status: 409 });
  }

  const now = new Date();
  const releaseAt = addDays(
    addDays(now, data.checkin_interval_days),
    data.grace_days
  );

  const { error: updateError } = await supabase
    .from("drops")
    .update({
      last_checkin_at: toIso(now),
      release_at: toIso(releaseAt),
      last_checkin_sent_at: null,
    })
    .eq("id", data.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, release_at: toIso(releaseAt) });
}
