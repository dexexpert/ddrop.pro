"use client";

import { useState } from "react";

export const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="btn-outline rounded-md px-2 py-1 text-base font-semibold uppercase tracking-[0.2em]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};
