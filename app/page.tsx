import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-edge bg-[rgba(244,242,236,0.92)] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            <Image src="/logo.jpg" alt="DeadDrop logo" width={28} height={28} />
          </div>
          <span className="text-base font-semibold uppercase tracking-[0.4em]">
            DEADDROP
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-base font-medium uppercase tracking-[0.2em] text-muted md:flex">
          <Link className="hover:text-ink" href="/create">
            Create
          </Link>
          <Link className="hover:text-ink" href="/decrypt">
            Decrypt
          </Link>
          <Link className="hover:text-ink" href="/receipt/demo">
            Receipt
          </Link>
          <Link className="hover:text-ink" href="/safety">
            Safety
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16">
        <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <p className="text-base font-semibold uppercase tracking-[0.4em] text-muted">
              Dead-simple dead drop
            </p>
            <h1 className="text-5xl leading-[1.05] text-ink md:text-6xl">
              If you disappear, your{" "}
              <span className="glow-text">instructions</span> don't.
            </h1>
            <p className="text-xl leading-7 text-muted">
              Upload an encrypted file; if you don't click{" "}
              <span className="glow-text">"I'm alive"</span> within N days, it's
              emailed to your person.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/create"
                className="btn-primary rounded-md px-6 py-3 text-base font-semibold uppercase tracking-[0.25em] transition hover:-translate-y-0.5"
              >
                Create a Drop
              </Link>
              <a
                href="#how"
                className="rounded-md border border-edge px-6 py-3 text-base font-semibold uppercase tracking-[0.25em] text-ink transition hover:-translate-y-0.5 hover:bg-accent-ghost"
              >
                How it works
              </a>
            </div>
          </div>

          <aside className="rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between text-base font-semibold uppercase tracking-[0.35em] text-muted">
              <span>Flow</span>
              <span>Binary</span>
            </div>
            <div className="mt-5 grid gap-3 text-base">
              {[
                "Encrypt in your browser",
                "Monthly check-in email",
                "Miss the deadline \u2192 release email",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-md border border-edge bg-[rgba(14,16,21,0.85)] px-4 py-3"
                >
                  <span className="font-medium text-ink">{item}</span>
                  <span className="text-base text-muted">\u2713</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-dashed border-edge px-4 py-3 text-base text-muted">
              No wallets. No tokens. One timer.
            </div>
          </aside>
        </section>

        <section
          id="how"
          className="grid gap-6 border-t border-edge pt-10 md:grid-cols-[1fr_1fr_1fr]"
        >
          {[
            {
              title: "Encrypt in your browser",
              body: "Client-side WebCrypto only. We never see the passphrase.",
            },
            {
              title: "Check in on schedule",
              body: "One email ping. Click \"I'm alive\" to reset the timer.",
            },
            {
              title: "Release on miss",
              body: "If the deadline passes, the encrypted payload is emailed.",
            },
          ].map((step, index) => (
            <div key={step.title} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-[rgba(18,20,26,0.55)] text-base font-semibold text-ink">
                  {index + 1}
                </div>
                <p className="text-base font-semibold uppercase tracking-[0.35em] text-muted">
                  Step {index + 1}
                </p>
              </div>
              <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              <p className="text-base leading-6 text-muted">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 rounded-lg border border-edge bg-[rgba(18,20,26,0.78)] p-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-ink">What we do</h3>
            <ul className="mt-4 grid gap-2 text-base text-muted">
              <li>Client-side encryption only.</li>
              <li>Email-only check-ins.</li>
              <li>One-time release on missed deadline.</li>
              <li>Immutable receipt hash.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ink">What we don't do</h3>
            <ul className="mt-4 grid gap-2 text-base text-muted">
              <li>No custody. No recovery for lost passphrases.</li>
              <li>No legal guarantees or arbitration.</li>
              <li>No SMS, Telegram, or multi-channel failsafes.</li>
              <li>No on-chain storage, tokens, or staking.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-base text-muted">
        Client-side encryption. No on-chain storage. No trading.
      </footer>
    </div>
  );
}
