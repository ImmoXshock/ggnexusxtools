import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { refreshCookie, bypassAccount } from "@/lib/nexusx.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexusX — Refresher & Bypass" },
      {
        name: "description",
        content: "NexusX: Roblox cookie refresher and account bypass in one dark, neon-yellow dashboard.",
      },
      { property: "og:title", content: "NexusX" },
      { property: "og:description", content: "Roblox cookie refresher & bypass." },
    ],
  }),
  component: NexusX,
});

function Bolt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoBadge() {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-xl border border-nx-gold/40 bg-black/70 text-nx-gold shadow-[inset_0_0_20px_rgba(250,204,21,0.25)]">
      <Bolt className="h-6 w-6 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
    </div>
  );
}

function NexusX() {
  return (
    <div className="nx-root min-h-screen text-nx-text">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <LogoBadge />
          <div className="leading-tight">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Nexus<span className="text-nx-gold">X</span>
            </h1>
            <div className="text-[10px] font-semibold tracking-[0.35em] text-nx-gold/70">
              REFRESHER · BYPASS
            </div>
          </div>
        </div>
        <a
          href="https://discord.gg/bkA4mw8dJK"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-5 py-2.5 font-semibold text-white shadow-[0_0_30px_rgba(88,101,242,0.45)] transition hover:bg-[#6b76f5]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.5 14.5 0 0 0-.65 1.342 18.27 18.27 0 0 0-5.487 0A14 14 0 0 0 9.77 3a19.74 19.74 0 0 0-3.76 1.37C2.605 9.043 1.68 13.58 2.143 18.05a19.94 19.94 0 0 0 6.06 3.06c.49-.665.926-1.371 1.301-2.113-.71-.266-1.39-.594-2.036-.98.171-.126.338-.258.5-.394 3.927 1.79 8.18 1.79 12.06 0 .163.136.33.268.5.394-.647.387-1.328.715-2.04.981.376.741.812 1.447 1.302 2.112a19.9 19.9 0 0 0 6.063-3.06c.543-5.18-.93-9.68-3.535-13.681ZM9.7 15.567c-1.182 0-2.157-1.085-2.157-2.42 0-1.333.955-2.42 2.157-2.42 1.207 0 2.176 1.094 2.157 2.42 0 1.335-.96 2.42-2.157 2.42Zm8.6 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.954-2.42 2.157-2.42 1.207 0 2.176 1.094 2.157 2.42 0 1.335-.95 2.42-2.157 2.42Z" />
          </svg>
          Discord
        </a>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 md:grid-cols-2">
        <RefresherPanel />
        <BypasserPanel />
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-nx-text/50">
        NexusX hands off to external services. Never share cookies with people you don't trust.
      </footer>
    </div>
  );
}

function PanelShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="nx-card rounded-2xl p-7">
      <div className="mb-1 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg border border-nx-gold/40 bg-black/70 text-nx-gold">
          <Bolt className="h-4 w-4 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" />
        </div>
        <h2 className="text-2xl font-extrabold text-nx-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.45)]">
          {title}
        </h2>
      </div>
      <p className="mb-6 text-sm text-nx-text/70">{subtitle}</p>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <div className="mb-2 text-[11px] font-bold tracking-[0.25em] text-nx-text/70">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-nx-gold/30 bg-black/60 p-3 font-mono text-xs text-nx-text placeholder:text-nx-text/30 outline-none transition focus:border-nx-gold focus:shadow-[0_0_0_3px_rgba(250,204,21,0.15),0_0_22px_rgba(250,204,21,0.2)]";

const primaryBtn =
  "w-full rounded-xl bg-nx-gold py-3 font-extrabold tracking-wide text-black shadow-[0_0_25px_rgba(250,204,21,0.45)] transition hover:bg-yellow-300 disabled:opacity-60";

function ResultBlock({ value }: { value: string }) {
  if (!value) return null;
  return (
    <div className="mt-5">
      <div className="mb-2 text-[11px] font-bold tracking-[0.25em] text-nx-text/70">
        RESULT
      </div>
      <textarea
        readOnly
        value={value}
        className={`${inputClass} h-36`}
      />
      <button
        onClick={() => navigator.clipboard.writeText(value)}
        className="mt-2 rounded-lg border border-nx-gold/30 bg-black/60 px-4 py-1.5 text-xs font-semibold text-nx-gold hover:bg-nx-gold/10"
      >
        Copy
      </button>
    </div>
  );
}

function RefresherPanel() {
  const fn = useServerFn(refreshCookie);
  const [cookie, setCookie] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!cookie.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const r = await fn({ data: { cookie: cookie.trim() } });
      setResult(r.result || "(empty response)");
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelShell
      title="NexusX Refresher"
      subtitle="Paste your .ROBLOSECURITY cookie to refresh it."
    >
      <Field label="COOKIE">
        <textarea
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
          placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
          className={`${inputClass} h-32 resize-none`}
        />
      </Field>
      <button onClick={submit} disabled={loading} className={primaryBtn}>
        {loading ? "Refreshing..." : "Run Refresh"}
      </button>
      <ResultBlock value={result} />
    </PanelShell>
  );
}

function BypasserPanel() {
  const fn = useServerFn(bypassAccount);
  const [cookie, setCookie] = useState("");
  const [password, setPassword] = useState("");
  const [version, setVersion] = useState<"v1" | "v2">("v1");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!cookie.trim()) return;
    if (version === "v2" && !password) return;
    setLoading(true);
    setResult("");
    try {
      const r = await fn({
        data: { cookie: cookie.trim(), version, password },
      });
      setResult(JSON.stringify(r.data, null, 2));
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelShell
      title="NexusX Bypass"
      subtitle="Account bypass via rblxbypasser. V2 also requires your account password."
    >
      <div className="mb-4 inline-flex rounded-xl border border-nx-gold/30 bg-black/60 p-1">
        {(["v1", "v2"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={`px-4 py-1.5 text-xs font-bold tracking-[0.2em] rounded-lg transition ${
              version === v
                ? "bg-nx-gold text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                : "text-nx-text/60 hover:text-nx-gold"
            }`}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      <Field label="COOKIE">
        <textarea
          value={cookie}
          onChange={(e) => setCookie(e.target.value)}
          placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
          className={`${inputClass} h-24 resize-none`}
        />
      </Field>

      {version === "v2" && (
        <Field label="ACCOUNT PASSWORD">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>
      )}

      <button onClick={submit} disabled={loading} className={primaryBtn}>
        {loading ? "Running Bypass..." : "Run Bypass"}
      </button>
      <ResultBlock value={result} />
    </PanelShell>
  );
}

