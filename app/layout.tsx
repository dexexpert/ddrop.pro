import type { Metadata } from "next";
import { IBM_Plex_Mono, VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  variable: "--font-space",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DEADDROP",
  description:
    "Upload an encrypted file; if you don't click 'I'm alive' within N days, it's emailed to your person.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} ${plexMono.variable} min-h-screen bg-paper text-ink antialiased`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(0,204,193,0.18),transparent_60%)]" />
          <div className="absolute right-[-10%] top-[18%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(139,88,255,0.18),transparent_62%)]" />
          <div className="absolute bottom-[-20%] left-[20%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(255,44,42,0.14),transparent_60%)]" />
        </div>
        {children}
      </body>
    </html>
  );
}
