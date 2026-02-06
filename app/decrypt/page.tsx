"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { decryptPayload } from "@/lib/client-crypto";

export default function DecryptPage() {
  const [mode, setMode] = useState<"paste" | "file">("paste");
  const [ciphertext, setCiphertext] = useState("");
  const [filePayload, setFilePayload] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [outputText, setOutputText] = useState("");
  const [outputFile, setOutputFile] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  const [error, setError] = useState("");

  const canDecrypt = useMemo(() => {
    if (!passphrase) return false;
    if (mode === "paste") return ciphertext.trim().length > 0;
    return !!filePayload;
  }, [mode, passphrase, ciphertext, filePayload]);

  const handleDecrypt = async () => {
    setError("");
    setOutputText("");
    setOutputFile(null);

    try {
      const json =
        mode === "paste" - ciphertext : await filePayload!.text();

      const result = await decryptPayload({ json, passphrase });

      if (result.type === "text") {
        setOutputText(result.text);
      } else {
        const url = URL.createObjectURL(result.blob);
        setOutputFile({ url, filename: result.filename });
      }
    } catch {
      setError("Wrong passphrase or corrupted file.");
    }
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

        <div className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <div className="flex items-center gap-4 text-base font-semibold uppercase tracking-[0.25em] text-muted">
            <button
              type="button"
              onClick={() => setMode("paste")}
              className={`rounded-md px-3 py-1 ${
                mode === "paste"
                  - "btn-toggle-active ring-2 ring-[rgba(0,204,193,0.45)]"
                  : "btn-toggle bg-transparent"
              }`}
            >
              Paste ciphertext
            </button>
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`rounded-md px-3 py-1 ${
                mode === "file"
                  - "btn-toggle-active ring-2 ring-[rgba(139,88,255,0.45)]"
                  : "btn-toggle bg-transparent"
              }`}
            >
              Upload file
            </button>
          </div>

          {mode === "paste" - (
            <textarea
              className="mt-4 min-h-[160px] w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
              placeholder="Paste ciphertext here."
              value={ciphertext}
              onChange={(event) => setCiphertext(event.target.value)}
            />
          ) : (
            <input
              type="file"
              className="mt-4 w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
              onChange={(event) =>
                setFilePayload(event.target.files?.[0] ?? null)
              }
            />
          )}

          <label className="mt-6 grid gap-2 text-base font-medium">
            Passphrase
            <input
              type="password"
              className="rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={handleDecrypt}
            disabled={!canDecrypt}
            className="btn-primary mt-6 w-full rounded-md px-6 py-4 text-base font-semibold uppercase tracking-[0.25em] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Decrypt locally
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-edge bg-[rgba(18,20,26,0.78)] p-4 text-base text-red-400">
            {error}
          </div>
        )}

        {outputText && (
          <div className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
            <p className="text-base uppercase tracking-[0.25em] text-muted">
              Output
            </p>
            <textarea
              readOnly
              value={outputText}
              className="mt-4 min-h-[160px] w-full rounded-md border border-edge bg-[rgba(14,16,21,0.9)] px-4 py-3 text-base"
            />
            <button
              onClick={() => navigator.clipboard.writeText(outputText)}
              className="btn-outline mt-4 rounded-md px-4 py-2 text-base font-semibold uppercase tracking-[0.25em]"
            >
              Copy
            </button>
          </div>
        )}

        {outputFile && (
          <div className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
            <p className="text-base uppercase tracking-[0.25em] text-muted">
              Output
            </p>
            <a
              href={outputFile.url}
              download={outputFile.filename}
              className="btn-outline mt-6 inline-flex rounded-md px-5 py-3 text-base font-semibold uppercase tracking-[0.25em]"
            >
              Download decrypted file
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
