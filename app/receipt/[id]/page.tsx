import Link from "next/link";
import { supabaseServer } from "@/lib/supabase";
import { CopyButton } from "@/components/copy-button";

type ReceiptRow = {
  id: string;
  status: "ACTIVE" | "RELEASED";
  payload_hash: string;
  created_at: string;
  last_checkin_at: string;
  release_at: string;
  released_at?: string | null;
  user_email: string;
  recipient_email: string;
};

const maskEmail = (value: string) => {
  const [name, domain] = value.split("@");
  if (!domain) return value;
  return `${name.slice(0, 1)}***@${domain}`;
};

const formatDate = (value-: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = supabaseServer();

  const { data } = await supabase
    .from("drops")
    .select(
      "id,status,payload_hash,created_at,last_checkin_at,release_at,released_at,user_email,recipient_email"
    )
    .eq("id", id)
    .single<ReceiptRow>();

  if (!data) {
    return (
      <div className="min-h-screen px-6 pb-20 pt-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <Link
            className="text-base font-semibold uppercase tracking-[0.25em]"
            href="/"
          >
            ← Back to home
          </Link>
          <div className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
            <h1 className="text-2xl font-semibold text-ink">Receipt</h1>
            <p className="mt-4 text-base text-muted">
              This receipt could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Link className="text-base font-semibold uppercase tracking-[0.25em]" href="/">
          ← Back to home
        </Link>

        <div className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-ink">Receipt</h1>
            <span className="rounded-md border border-edge px-3 py-1 text-base font-semibold uppercase tracking-[0.25em] text-muted">
              {data.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 text-base text-muted">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">Drop ID</span>
              <span className="font-mono text-base">{data.id.slice(0, 10)}...</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">
                Payload hash (SHA-256)
              </span>
              <span className="flex items-center gap-2 font-mono text-base">
                {data.payload_hash}
                <CopyButton value={data.payload_hash} />
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">Created</span>
              <span>{formatDate(data.created_at)}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">
                Last check-in
              </span>
              <span>{formatDate(data.last_checkin_at)}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">
                Release deadline
              </span>
              <span>{formatDate(data.release_at)}</span>
            </div>
            {data.status === "RELEASED" && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-base uppercase tracking-[0.25em]">
                  Released
                </span>
                <span>{formatDate(data.released_at)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-md border border-edge bg-[rgba(18,20,26,0.55)] p-4 text-base text-muted">
            <p className="text-base uppercase tracking-[0.25em] text-muted">
              Masked emails
            </p>
            <p className="mt-2">
              Owner: {maskEmail(data.user_email)} · Recipient:{" "}
              {maskEmail(data.recipient_email)}
            </p>
          </div>

          <p className="mt-6 text-base text-muted">
            This receipt proves timing and payload hash only. It does not reveal
            contents.
          </p>
        </div>
      </div>
    </div>
  );
}
