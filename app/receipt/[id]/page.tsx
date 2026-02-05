import Link from "next/link";

type Receipt = {
  id: string;
  status: "ACTIVE" | "RELEASED";
  payloadHash: string;
  createdAt: string;
  lastCheckinAt: string;
  releaseAt: string;
  releasedAt?: string;
  userEmail: string;
  recipientEmail: string;
};

const maskEmail = (value: string) => {
  const [name, domain] = value.split("@");
  if (!domain) return value;
  return `${name.slice(0, 1)}***@${domain}`;
};

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: Fetch receipt from Supabase by id.
  const receipt: Receipt = {
    id,
    status: "ACTIVE",
    payloadHash:
      "a49e1b0f8e8d0b19b8d7e134e4f5c7c9a7c8b2a1d4f3e2b1c0d9e8f7a6b5c4d3",
    createdAt: "Feb 5, 2026 · 10:32 AM",
    lastCheckinAt: "Feb 5, 2026 · 10:32 AM",
    releaseAt: "Mar 6, 2026 · 10:32 AM",
    userEmail: "jane@domain.com",
    recipientEmail: "alex@domain.com",
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <Link className="text-base font-semibold uppercase tracking-[0.25em]" href="/">
          ← Back to home
        </Link>

        <div className="rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold text-ink">Receipt</h1>
            <span className="rounded-md border border-edge px-3 py-1 text-base font-semibold uppercase tracking-[0.25em] text-muted">
              {receipt.status}
            </span>
          </div>

          <div className="mt-6 grid gap-4 text-base text-muted">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">Drop ID</span>
              <span className="font-mono text-base">{receipt.id.slice(0, 10)}…</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">
                Payload hash (SHA-256)
              </span>
              <span className="flex items-center gap-2 font-mono text-base">
                {receipt.payloadHash}
                <button className="btn-outline rounded-md px-2 py-1 text-base font-semibold uppercase tracking-[0.2em]">
                  Copy
                </button>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">Created</span>
              <span>{receipt.createdAt}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">
                Last check-in
              </span>
              <span>{receipt.lastCheckinAt}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-base uppercase tracking-[0.25em]">
                Release deadline
              </span>
              <span>{receipt.releaseAt}</span>
            </div>
            {receipt.status === "RELEASED" && receipt.releasedAt ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-base uppercase tracking-[0.25em]">
                  Released
                </span>
                <span>{receipt.releasedAt}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-6 rounded-md border border-edge bg-[rgba(18,20,26,0.55)] p-4 text-base text-muted">
            <p className="text-base uppercase tracking-[0.25em] text-muted">
              Masked emails
            </p>
            <p className="mt-2">
              Owner: {maskEmail(receipt.userEmail)} · Recipient:{" "}
              {maskEmail(receipt.recipientEmail)}
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
