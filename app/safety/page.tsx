import Link from "next/link";

export default function SafetyPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <Link className="text-base font-semibold uppercase tracking-[0.25em]" href="/">
          ← Back to home
        </Link>

        <div>
          <h1 className="text-3xl font-semibold text-ink md:text-4xl">
            Safety &amp; Limits
          </h1>
          <p className="mt-2 text-base text-muted">
            Blunt truths. No marketing gloss.
          </p>
        </div>

        <section className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <h2 className="text-lg font-semibold text-ink">What this protects</h2>
          <ul className="mt-4 grid gap-2 text-base text-muted">
            <li>Platform compromise (payload encrypted).</li>
            <li>Forgotten instructions.</li>
            <li>Sudden unavailability.</li>
          </ul>
        </section>

        <section className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <h2 className="text-lg font-semibold text-ink">What it doesn’t</h2>
          <ul className="mt-4 grid gap-2 text-base text-muted">
            <li>Email compromise.</li>
            <li>Weak passphrases.</li>
            <li>Malicious recipients.</li>
            <li>Legal disputes.</li>
          </ul>
        </section>

        <section className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <h2 className="text-lg font-semibold text-ink">
            How to choose a passphrase
          </h2>
          <ul className="mt-4 grid gap-2 text-base text-muted">
            <li>Use 5+ unrelated words.</li>
            <li>Avoid names, dates, or quotes.</li>
            <li>Store it offline if it matters.</li>
          </ul>
        </section>

        <section className="glow-card rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8">
          <h2 className="text-lg font-semibold text-ink">
            Operational limits (email-only)
          </h2>
          <ul className="mt-4 grid gap-2 text-base text-muted">
            <li>Single timer per drop.</li>
            <li>One-time release only.</li>
            <li>Reliant on email deliverability.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
