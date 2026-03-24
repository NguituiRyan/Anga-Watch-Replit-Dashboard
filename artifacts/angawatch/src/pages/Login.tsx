import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, LogIn, AlertTriangle } from "lucide-react";
import logoUrl from "@assets/favicon_1774360352247.png";

export function Login() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn({ email, password });
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-emerald-500/20 overflow-hidden mb-4 shadow-lg shadow-emerald-500/10">
            <img src={logoUrl} alt="AngaWatch" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">AngaWatch</h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Tana Basin Early Warning System
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Access the flood monitoring dashboard</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@angawatch.ke"
              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </label>

          <label className="block mb-6">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Password</span>
            <div className="relative mt-1.5">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Access Dashboard
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-500 mt-5">
            No account?{" "}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
