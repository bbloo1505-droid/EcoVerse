import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { authCallbackUrl } from "@/lib/authRedirect";

export default function Auth({ mode }: { mode: "signup" | "login" }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const isSignup = mode === "signup";

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!supabase) {
        setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
        return;
      }
      if (!email.trim() || !password) {
        setError("Email and password are required.");
        return;
      }
      setLoading(true);
      setError("");
      setMessage("");
      try {
        if (isSignup) {
          const { data, error: signErr } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { full_name: name.trim() || undefined },
              emailRedirectTo: authCallbackUrl("/onboarding"),
            },
          });
          if (signErr) throw signErr;
          if (data.session) {
            navigate("/onboarding");
          } else {
            setMessage("Check your email to confirm your account, then log in.");
          }
        } else {
          const { error: signErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (signErr) throw signErr;
          navigate("/home");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed.");
      } finally {
        setLoading(false);
      }
    },
    [email, isSignup, name, navigate, password],
  );

  const onGoogle = useCallback(async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setError("");
    setGoogleLoading(true);
    const { error: oAuthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authCallbackUrl("/home") },
    });
    setGoogleLoading(false);
    if (oAuthErr) setError(oAuthErr.message);
  }, []);

  const onMagicLink = useCallback(async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setError("");
    setMessage("");
    setMagicLoading(true);
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: authCallbackUrl("/home"),
        },
      });
      if (otpErr) throw otpErr;
      setMessage("Check your email — we sent you a sign-in link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send link.");
    } finally {
      setMagicLoading(false);
    }
  }, [email]);

  return (
    <div className="container-app py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="card-elev p-7 sm:p-9 animate-fade-in">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Leaf className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold">{isSignup ? "Create your account" : "Welcome back"}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isSignup ? "Start your 14-day free trial. No card required." : "Log in with email or Google."}
            </p>
          </div>

          <button
            type="button"
            disabled={!hasSupabaseConfig || googleLoading}
            onClick={onGoogle}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-surface text-sm font-medium transition-colors hover:bg-surface-alt disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.4-13l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2a12 12 0 0 1-18-6.3l-6.5 5A20 20 0 0 0 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41.4 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"
              />
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3.5">
            {isSignup && (
              <div>
                <label className="text-xs font-medium text-text-secondary">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                  placeholder="Ella Martins"
                  required
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-text-secondary">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                placeholder="you@uni.edu.au"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary">Password</label>
              <input
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          {!isSignup && (
            <div className="mt-4 rounded-xl border border-border/80 bg-surface-alt/40 px-4 py-3">
              <p className="text-xs font-medium text-text-secondary">Prefer a passwordless link?</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                disabled={!hasSupabaseConfig || magicLoading}
                onClick={onMagicLink}
              >
                {magicLoading ? "Sending…" : "Email me a magic link"}
              </Button>
            </div>
          )}

          {!hasSupabaseConfig && (
            <p className="mt-4 rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground leading-relaxed">
              Add <code className="text-foreground">VITE_SUPABASE_URL</code> and{" "}
              <code className="text-foreground">VITE_SUPABASE_ANON_KEY</code> in <code className="text-foreground">.env</code>.
              Then in Supabase → Authentication → URL Configuration, set Site URL to this app and add redirect{" "}
              <code className="text-foreground break-all">{typeof window !== "undefined" ? window.location.origin : ""}/auth/callback</code>
              .
            </p>
          )}

          {isSignup && (
            <p className="mt-4 text-center text-[11px] text-muted-foreground leading-relaxed">
              By continuing, you agree to our <a className="underline hover:text-foreground">Terms</a> and{" "}
              <a className="underline hover:text-foreground">Privacy Policy</a>. We&apos;ll remind you before any billing.
            </p>
          )}

          <p className="mt-5 text-center text-sm text-text-secondary">
            {isSignup ? "Already have an account? " : "New here? "}
            <Link to={isSignup ? "/login" : "/signup"} className="font-semibold text-primary hover:underline">
              {isSignup ? "Log in" : "Create one"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
