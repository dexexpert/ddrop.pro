"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Status = "idle" | "progress" | "success";

export default function CreateDropPage() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [status, setStatus] = useState<Status>("idle");
  const [interval, setInterval] = useState(30);
  const [grace, setGrace] = useState(7);

  const exampleDates = useMemo(() => {
    const now = new Date();
    const checkIn = new Date(now);
    checkIn.setDate(checkIn.getDate() + interval);
    const release = new Date(checkIn);
    release.setDate(release.getDate() + grace);
    return {
      checkIn: checkIn.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      release: release.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [interval, grace]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("progress");

    // TODO: encryptPayload() with WebCrypto here (client-side only).
    // TODO: upload encrypted blob to Supabase Storage.
    // TODO: insert drop record into Supabase with payload_hash.

    window.setTimeout(() => setStatus("success"), 1300);
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <Link className="text-base font-semibold uppercase tracking-[0.25em]" href="/">
          ← Back to home
        </Link>

        <div>
          <h1 className="text-3xl font-semibold text-ink md:text-4xl">
            Create a Drop
          </h1>
          <p className="mt-2 text-base text-muted">
            Your passphrase is never saved. If you lose it, nobody can decrypt.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
            <h2 className="text-2xl font-semibold text-ink">
              Your Drop is active.
            </h2>
            <p className="mt-2 text-base text-muted">
              We’ll email you check-ins and notify your recipient if you miss
              the deadline.
            </p>
            <div className="mt-6 grid gap-4">
              <div className="rounded-md border border-edge bg-[rgba(18,20,26,0.55)] p-4 text-base">
                <p className="text-base uppercase tracking-[0.25em] text-muted">
                  Check-in link
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="truncate font-mono text-base">
                    https://deaddrop.example/alive/placeholder-token
                  </span>
                  <button className="rounded-md border border-edge px-3 py-1 text-base font-semibold">
                    Copy
                  </button>
                </div>
              </div>
              <div className="rounded-md border border-edge bg-[rgba(18,20,26,0.55)] p-4 text-base">
                <p className="text-base uppercase tracking-[0.25em] text-muted">
                  Receipt
                </p>
                <Link
                  href="/receipt/placeholder"
                  className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-ink"
                >
                  /receipt/placeholder
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2 text-base font-medium">
                  Your email
                  <input
                    type="email"
                    required
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                    placeholder="you@domain.com"
                  />
                </label>
                <label className="grid gap-2 text-base font-medium">
                  Recipient email
                  <input
                    type="email"
                    required
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                    placeholder="person@domain.com"
                  />
                </label>
                <label className="grid gap-2 text-base font-medium">
                  Check-in interval
                  <select
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                    value={interval}
                    onChange={(event) =>
                      setInterval(Number(event.target.value))
                    }
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </label>
                <label className="grid gap-2 text-base font-medium">
                  Grace period
                  <select
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                    value={grace}
                    onChange={(event) => setGrace(Number(event.target.value))}
                  >
                    <option value={1}>1 day</option>
                    <option value={3}>3 days</option>
                    <option value={7}>7 days</option>
                  </select>
                </label>
                <label className="grid gap-2 text-base font-medium">
                  Passphrase
                  <input
                    type="password"
                    required
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                  />
                  <span className="text-base text-muted">
                    Use 5+ words or a long random phrase.
                  </span>
                </label>
                <label className="grid gap-2 text-base font-medium">
                  Confirm passphrase
                  <input
                    type="password"
                    required
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                  />
                </label>
                <label className="grid gap-2 text-base font-medium md:col-span-2">
                  Passphrase hint (optional)
                  <input
                    type="text"
                    className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                    placeholder="Something only they can recall"
                  />
                </label>
              </div>

              <div className="mt-8 rounded-md border border-edge bg-[rgba(18,20,26,0.55)] p-4">
                <div className="flex items-center gap-4 text-base font-semibold uppercase tracking-[0.25em] text-muted">
                  <button
                    type="button"
                    onClick={() => setMode("text")}
                    className={`rounded-md px-3 py-1 ${
                      mode === "text"
                        ? "bg-ink text-white"
                        : "border border-edge"
                    }`}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("file")}
                    className={`rounded-md px-3 py-1 ${
                      mode === "file"
                        ? "bg-ink text-white"
                        : "border border-edge"
                    }`}
                  >
                    File
                  </button>
                </div>
                {mode === "text" ? (
                  <textarea
                    className="mt-4 min-h-[140px] w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                    placeholder="Paste instructions, keys, or any text payload."
                  />
                ) : (
                  <input
                    type="file"
                    className="mt-4 w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                  />
                )}
              </div>

              <div className="mt-6 rounded-md border border-edge bg-[rgba(18,20,26,0.55)] p-4 text-base text-muted">
                <p className="text-base uppercase tracking-[0.25em] text-muted">
                  What happens
                </p>
                <p className="mt-2">
                  Next check-in: {exampleDates.checkIn} · Release deadline:{" "}
                  {exampleDates.release}
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary mt-6 w-full rounded-md px-6 py-4 text-base font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
              >
                Encrypt &amp; Create
              </button>
            </form>

            {status === "progress" && (
              <div className="rounded-md border border-edge bg-[rgba(18,20,26,0.78)] p-6 text-base text-muted">
                <p className="text-base uppercase tracking-[0.25em] text-muted">
                  Processing
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-base font-medium text-ink">
                  <span>Encrypting →</span>
                  <span>Uploading →</span>
                  <span>Saving →</span>
                  <span>Done</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// TODO: Implement encryptPayload() using WebCrypto (client-side only).
// function encryptPayload(payload: ArrayBuffer, passphrase: string): Promise<ArrayBuffer> {}
