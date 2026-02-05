"use client";

import { useState } from "react";
import Link from "next/link";

export default function DecryptPage() {
  const [mode, setMode] = useState<"paste" | "file">("paste");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<"text" | "file">("text");
  const [error, setError] = useState("");

  const handleDecrypt = () => {
    setError("");
    setOutput("");

    // TODO: Implement decryptPayload() using WebCrypto (client-side only).
    // decryptPayload(ciphertext, passphrase).then(...).catch(...)

    window.setTimeout(() => {
      setOutputType("text");
      setOutput("Decrypted output will appear here.");
    }, 500);
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <Link className="text-base font-semibold uppercase tracking-[0.25em]" href="/">
          ← Back to home
        </Link>

        <div>
          <h1 className="text-3xl font-semibold text-ink md:text-4xl">
            Decrypt a Drop
          </h1>
          <p className="mt-2 text-base text-muted">
            Paste the encrypted text or upload the encrypted file. Enter the
            passphrase. Decryption happens in your browser.
          </p>
        </div>

        <div className="rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <div className="flex items-center gap-4 text-base font-semibold uppercase tracking-[0.25em] text-muted">
            <button
              type="button"
              onClick={() => setMode("paste")}
              className={`rounded-md px-3 py-1 ${
                mode === "paste"
                  ? "bg-ink text-white"
                  : "border border-edge"
              }`}
            >
              Paste ciphertext
            </button>
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`rounded-md px-3 py-1 ${
                mode === "file" ? "bg-ink text-white" : "border border-edge"
              }`}
            >
              Upload file
            </button>
          </div>

          {mode === "paste" ? (
            <textarea
              className="mt-4 min-h-[160px] w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
              placeholder="Paste ciphertext here."
            />
          ) : (
            <input
              type="file"
              className="mt-4 w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
            />
          )}

          <label className="mt-6 grid gap-2 text-base font-medium">
            Passphrase
            <input
              type="password"
              className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
            />
          </label>

          <button
            type="button"
            onClick={handleDecrypt}
            className="btn-primary mt-6 w-full rounded-md px-6 py-4 text-base font-semibold uppercase tracking-[0.25em]"
          >
            Decrypt locally
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-edge bg-[rgba(18,20,26,0.78)] p-4 text-base text-red-400">
            {error}
          </div>
        )}

        {output && (
          <div className="rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
            <p className="text-base uppercase tracking-[0.25em] text-muted">
              Output
            </p>
            {outputType === "text" ? (
              <>
                <textarea
                  readOnly
                  value={output}
                  className="mt-4 min-h-[160px] w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
                />
                <button className="mt-4 rounded-md border border-edge px-4 py-2 text-base font-semibold uppercase tracking-[0.25em]">
                  Copy
                </button>
              </>
            ) : (
              <button className="mt-6 rounded-md border border-edge px-5 py-3 text-base font-semibold uppercase tracking-[0.25em]">
                Download decrypted file
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-base text-red-600">
            Wrong passphrase or corrupted file.
          </p>
        )}
      </div>
    </div>
  );
}

// TODO: Implement decryptPayload() using WebCrypto (client-side only).
// function decryptPayload(ciphertext: ArrayBuffer, passphrase: string): Promise<ArrayBuffer> {}
