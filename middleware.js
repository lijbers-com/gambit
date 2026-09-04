/**
 * EpicContext gate — sign in with EpicContext to view this deploy.
 *
 * Drop this file at the root of any Vercel project (Next.js or not) as
 * `middleware.js`. It replaces Basic Auth on prototypes: instead of a
 * shared password nobody rotates, a viewer signs in with the
 * EpicContext account that already has access to the project — so they
 * land in the prototype *and* have the context beside it.
 *
 * ─── Optional by design ────────────────────────────────────────────
 * No `EPICCONTEXT_GATE_SECRET` set → the deploy is public and this file
 * does nothing. Set the secret → only EpicContext members get in.
 * That is the whole switch; there is no third state to reason about.
 *
 * ─── Flow ──────────────────────────────────────────────────────────
 * 1. No token → redirect to EpicContext, which checks the visitor is a
 *    member of the project and signs a short-lived token.
 * 2. EpicContext redirects back with `?ec_token=…`.
 * 3. This gate verifies the HMAC, sets an HttpOnly cookie, and strips
 *    the token from the URL.
 * 4. Later requests carry the cookie.
 *
 * ─── One rule worth reading before editing ─────────────────────────
 * Nothing bypasses this gate by default — not by extension, not by
 * path. The Storybook middleware it grew out of skipped anything ending
 * in `.js`, `.json` or `.css`; on an application that serves every
 * JSON API route unauthenticated. A later version skipped `/assets/`,
 * which on a Vite project is the entire built bundle.
 *
 * If a deploy genuinely needs a hole, name it explicitly in
 * `EPICCONTEXT_GATE_PUBLIC_PATHS`. Prefixes only.
 */

const COOKIE_NAME = "epiccontext_gate";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours
const TOKEN_PARAM = "ec_token";

export const config = {
  matcher: ["/(.*)"],
};

function getSecret() {
  return (
    process.env.EPICCONTEXT_GATE_SECRET ||
    // Accepted for projects migrating from the Storybook-only gate.
    process.env.EPICCONTEXT_STORYBOOK_SECRET ||
    ""
  );
}

function getEpicContextUrl() {
  return process.env.EPICCONTEXT_URL || "https://epiccontext.com";
}

/**
 * Nothing is public by default.
 *
 * An earlier version let through `/_next/static/`, `/assets/` and `/sb-`
 * on the reasoning that they "must load for the redirect page to
 * render". That reasoning was wrong: the redirect goes to EpicContext,
 * a different origin, which serves its own assets. Nothing on the gated
 * deploy is needed to draw a page the gated deploy does not draw.
 *
 * And the holes were real. `/assets/` is where Vite puts the entire
 * built bundle, so on a Vite project that one line handed out the whole
 * application source to anyone with the URL. `/sb-` assumed Storybook
 * at the root. Both were reported from a live deploy.
 *
 * An authenticated visitor carries the cookie, so their asset requests
 * pass; an unauthenticated one is redirected before any asset is asked
 * for. Gating everything therefore costs a middleware invocation per
 * asset and nothing else.
 *
 * `EPICCONTEXT_GATE_PUBLIC_PATHS` is the escape hatch — a
 * comma-separated list of path prefixes — for the deploy that genuinely
 * needs one. Prefixes only; never extensions.
 */
function publicPrefixes() {
  const raw = process.env.EPICCONTEXT_GATE_PUBLIC_PATHS || "";
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.startsWith("/"));
}

function isPublicPath(pathname) {
  return publicPrefixes().some((prefix) => pathname.startsWith(prefix));
}

function base64UrlDecode(value) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
}

async function hmac(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Constant-time-ish comparison.
 *
 * `a === b` on a signature leaks length and first-difference position
 * through timing. The window is small over a network, and closing it
 * costs four lines.
 */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyToken(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, error: "malformed token" };

  const [header, payload, signature] = parts;
  const expected = await hmac(`${header}.${payload}`, secret);
  if (!safeEqual(signature, expected)) {
    return { valid: false, error: "bad signature" };
  }

  let claims;
  try {
    claims = JSON.parse(base64UrlDecode(payload));
  } catch {
    return { valid: false, error: "unreadable payload" };
  }

  if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
    return { valid: false, error: "expired" };
  }

  return { valid: true, claims };
}

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((pair) => {
      const [key, ...rest] = pair.trim().split("=");
      return [key, rest.join("=")];
    })
  );
}

function signInRedirect(request) {
  const target = new URL("/auth/gate", getEpicContextUrl());
  target.searchParams.set("redirect", request.url);
  return Response.redirect(target.toString(), 302);
}

export default async function middleware(request) {
  const url = new URL(request.url);

  const secret = getSecret();
  // Public deploy. The gate is installed but switched off, which is the
  // normal state for anything that does not need a password.
  if (!secret) return undefined;

  if (isPublicPath(url.pathname)) return undefined;

  const tokenFromUrl = url.searchParams.get(TOKEN_PARAM);
  const cookies = parseCookies(request.headers.get("cookie"));
  const token = tokenFromUrl || cookies[COOKIE_NAME];

  if (!token) return signInRedirect(request);

  const result = await verifyToken(token, secret);
  if (!result.valid) {
    // An expired or tampered token is not an error page — it is someone
    // who needs to sign in again. Send them where that happens.
    return signInRedirect(request);
  }

  // Fresh from the URL: store it and strip it, so the token never sits
  // in the address bar, in history, or in a shared link.
  if (tokenFromUrl) {
    const clean = new URL(request.url);
    clean.searchParams.delete(TOKEN_PARAM);
    const secure = url.protocol === "https:" ? "; Secure" : "";
    return new Response(null, {
      status: 302,
      headers: {
        Location: clean.toString(),
        "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`,
      },
    });
  }

  return undefined;
}
