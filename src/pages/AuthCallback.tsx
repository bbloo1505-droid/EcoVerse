import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { supabase } from "@/lib/supabase";

/**
 * OAuth (and magic-link) return URL. Supabase exchanges the code/hash here; then we redirect into the app.
 * Add this exact path to Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      navigate("/login", { replace: true });
      return;
    }

    const go = (path: string) => {
      if (done.current) return;
      done.current = true;
      navigate(path, { replace: true });
    };

    void client.auth.getSession().then(({ data: { session } }) => {
      if (session) go("/home");
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) go("/home");
    });

    const fallback = window.setTimeout(() => {
      void client.auth.getSession().then(({ data: { session } }) => {
        if (session) go("/home");
        else go("/login");
      });
    }, 15000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(fallback);
    };
  }, [navigate]);

  return (
    <div className="container-app py-24 text-center">
      <Leaf className="mx-auto h-10 w-10 animate-pulse text-primary" aria-hidden />
      <p className="mt-4 text-sm text-muted-foreground">Completing sign in…</p>
    </div>
  );
}
