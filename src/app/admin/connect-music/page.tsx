"use client";

/**
 * One-time MusicKit JS auth flow to capture a Music User Token.
 *
 * Flow:
 *   1. Page loads MusicKit JS via CDN.
 *   2. Fetches a fresh Developer Token from /api/apple-music/developer-token.
 *   3. Initializes MusicKit with the token.
 *   4. User clicks "Authorize Apple Music" → Apple's auth flow opens in a popup.
 *   5. After auth, music.musicUserToken is exposed.
 *   6. Page displays the token + setup instructions.
 *
 * Workflow:
 *   - Visit /admin/connect-music
 *   - Click Authorize, complete Apple's flow
 *   - Copy the displayed Music User Token
 *   - Paste into APPLE_MUSIC_USER_TOKEN in .env.local (and Vercel env vars)
 *   - Restart dev server / redeploy
 *
 * Token has ~6 month lifetime. Repeat this flow when it expires.
 */

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    MusicKit?: {
      configure: (config: {
        developerToken: string;
        app: { name: string; build: string };
      }) => Promise<MusicKitInstance>;
      getInstance: () => MusicKitInstance | null;
    };
  }
}

type MusicKitInstance = {
  authorize: () => Promise<string>;
  unauthorize: () => Promise<void>;
  isAuthorized: boolean;
  musicUserToken: string;
};

type Status =
  | "loading-script"
  | "fetching-token"
  | "ready"
  | "authorizing"
  | "authorized"
  | "error";

export default function ConnectMusicPage() {
  const [status, setStatus] = useState<Status>("loading-script");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const musicKitRef = useRef<MusicKitInstance | null>(null);

  // Load MusicKit JS from CDN, fetch developer token, configure
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // 1. Inject the MusicKit JS script
        if (!window.MusicKit) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
            script.async = true;
            script.setAttribute("data-web-components", "");
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load MusicKit JS"));
            document.head.appendChild(script);
          });

          // The script dispatches 'musickitloaded' when ready
          await new Promise<void>((resolve) => {
            if (window.MusicKit) {
              resolve();
              return;
            }
            const onLoaded = () => {
              document.removeEventListener("musickitloaded", onLoaded);
              resolve();
            };
            document.addEventListener("musickitloaded", onLoaded);
          });
        }

        if (cancelled) return;
        if (!window.MusicKit) {
          throw new Error("MusicKit JS loaded but window.MusicKit is undefined");
        }

        // 2. Fetch the developer token
        setStatus("fetching-token");
        const tokenRes = await fetch("/api/apple-music/developer-token");
        if (!tokenRes.ok) {
          const body = await tokenRes.text();
          throw new Error(`Developer token fetch failed: ${body}`);
        }
        const { token: developerToken } = (await tokenRes.json()) as { token: string };

        if (cancelled) return;

        // 3. Configure MusicKit
        const instance = await window.MusicKit.configure({
          developerToken,
          app: { name: "Reckon House", build: "1.0.0" },
        });

        if (cancelled) return;
        musicKitRef.current = instance;

        // If already authorized (e.g. revisiting page), grab token immediately
        if (instance.isAuthorized && instance.musicUserToken) {
          setUserToken(instance.musicUserToken);
          setStatus("authorized");
        } else {
          setStatus("ready");
        }
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthorize = async () => {
    const instance = musicKitRef.current;
    if (!instance) return;

    setStatus("authorizing");
    setErrorMessage(null);

    try {
      await instance.authorize();
      const token = instance.musicUserToken;
      if (!token) {
        throw new Error("Authorization succeeded but no Music User Token returned");
      }
      setUserToken(token);
      setStatus("authorized");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Authorization failed or was cancelled"
      );
      setStatus("error");
    }
  };

  const handleSignOut = async () => {
    const instance = musicKitRef.current;
    if (!instance) return;
    try {
      await instance.unauthorize();
      setUserToken(null);
      setStatus("ready");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Sign-out failed");
    }
  };

  const handleCopyToken = () => {
    if (!userToken) return;
    navigator.clipboard.writeText(userToken);
  };

  return (
    <div className="min-h-full max-w-2xl mx-auto p-8 md:p-12">
      <h1 className="text-[22px] md:text-[28px] font-bold tracking-[-0.02em] mb-2">
        Connect Apple Music
      </h1>
      <p className="text-[14px] md:text-[16px] text-foreground/70 mb-8 leading-[1.6]">
        One-time setup to capture a Music User Token. Token lasts ~6 months;
        come back to this page to refresh when it expires.
      </p>

      {/* Status pill */}
      <div className="mb-6">
        <span className="inline-block text-[10px] tracking-[0.06em] uppercase font-medium px-3 py-1.5 rounded-full bg-[#141414]/[0.06] text-[#141414]">
          Status: {status}
        </span>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-[13px] leading-relaxed">
          <strong className="block mb-1">Error</strong>
          <code className="break-all">{errorMessage}</code>
        </div>
      )}

      {/* Authorize action */}
      {status === "ready" && (
        <button
          onClick={handleAuthorize}
          className="px-6 py-3 rounded-full bg-[#141414] text-[#F0EAE4] text-[14px] font-medium hover:opacity-90 transition-opacity"
        >
          Authorize Apple Music
        </button>
      )}

      {status === "authorizing" && (
        <p className="text-[14px] text-foreground/70">
          Authorization popup opened. Sign in with your Apple ID and approve access.
        </p>
      )}

      {/* Token output + instructions */}
      {status === "authorized" && userToken && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[14px] font-bold uppercase tracking-[0.06em]">
                Music User Token
              </h2>
              <button
                onClick={handleCopyToken}
                className="text-[11px] px-3 py-1.5 rounded-full bg-[#141414]/[0.06] hover:bg-[#141414]/[0.1] transition-colors"
              >
                Copy
              </button>
            </div>
            <code className="block p-4 rounded-lg bg-[#141414]/[0.05] text-[11px] font-mono break-all leading-relaxed">
              {userToken}
            </code>
          </div>

          <div className="space-y-2 text-[13px] leading-relaxed text-foreground/80">
            <h3 className="text-[14px] font-bold text-foreground mt-4">Next steps</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Copy the token above and paste it as the value of{" "}
                <code className="text-[12px] bg-[#141414]/[0.06] px-1.5 py-0.5 rounded">
                  APPLE_MUSIC_USER_TOKEN
                </code>{" "}
                in <code className="text-[12px] bg-[#141414]/[0.06] px-1.5 py-0.5 rounded">.env.local</code>.
              </li>
              <li>Restart the dev server so the new env var is picked up.</li>
              <li>
                For production, add the same env var to Vercel: Project → Settings → Environment Variables.
              </li>
              <li>
                Test it: visit <code className="text-[12px] bg-[#141414]/[0.06] px-1.5 py-0.5 rounded">/api/now-playing</code> to confirm it returns track data.
              </li>
            </ol>
          </div>

          <button
            onClick={handleSignOut}
            className="text-[12px] text-foreground/60 hover:text-foreground/90 underline underline-offset-2"
          >
            Sign out and authorize a different account
          </button>
        </div>
      )}
    </div>
  );
}
