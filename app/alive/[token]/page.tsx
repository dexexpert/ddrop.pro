"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type State = "loading" | "success" | "error";

export default function AlivePage() {
  const params = useParams<{ token: string }>();
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    const token = params?.token ?? "";
    if (!token) {
      setState("error");
      return;
    }

    const run = async () => {
      try {
        const response = await fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Invalid");
        }

        setState("success");
      } catch {
        setState("error");
      }
    };

    run();
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glow-card w-full max-w-md rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8 text-center">
        <h1 className="text-2xl font-semibold text-ink">Check-in</h1>
        <p className="mt-2 text-base text-muted">
          Confirm you’re okay to delay release.
        </p>

        {state === "loading" && (
          <p className="mt-8 text-base text-muted">Verifying link...</p>
        )}

        {state === "success" && (
          <div className="mt-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-edge bg-[rgba(18,20,26,0.55)] text-lg">
              ✓
            </div>
            <p className="mt-4 text-lg font-semibold text-ink">
              You’re confirmed.
            </p>
            <p className="mt-2 text-base text-muted">
              Next release deadline extended.
            </p>
            <Link
              href="/"
              className="btn-primary mt-6 inline-flex rounded-md px-5 py-2 text-base font-semibold uppercase tracking-[0.25em]"
            >
              Done
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="mt-8">
            <p className="text-base text-muted">
              This link is invalid or expired.
            </p>
            <Link
              href="/"
              className="btn-outline mt-6 inline-flex rounded-md px-5 py-2 text-base font-semibold uppercase tracking-[0.25em]"
            >
              Go home
            </Link>
          </div>
        )}

        <p className="mt-8 text-base text-muted">
          If you didn’t request this, ignore it.
        </p>
      </div>
    </div>
  );
}
