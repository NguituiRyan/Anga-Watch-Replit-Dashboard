import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { signUp } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, UserPlus, AlertTriangle, CheckCircle } from "lucide-react";
import logoUrl from "@assets/favicon_1774360352247.png";

export function Register() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "viewer",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  function updateField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email is required";
    if (form.password.length < 8) return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    if (form.phone && !/^\+254\d{9}$/.test(form.phone.replace(/\s/g, "")))
      return "Phone must be in Kenyan format (+254XXXXXXXXX)";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        organization: form.organization || undefined,
        phone: form.phone || undefined,
        role: form.role,
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      const msg = err?.message ?? "Registration failed";
      const code = err?.code ?? err?.status ?? "";
      setError(code ? `${msg} (${code})` : msg);
      console.error("Signup error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  const inputCls =
    "mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-emerald-500/20 overflow-hidden mb-4 shadow-lg shadow-emerald-500/10">
            <img src={logoUrl} alt="AngaWatch" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Create Account</h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            AngaWatch Dashboard Access
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl"
        >
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 mb-5 text-sm text-emerald-400">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Account created. Redirecting to dashboard...</span>
            </div>
          )}

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Full Name *</span>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Grace Muthoni"
              className={inputCls}
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Organization / County</span>
            <input
              type="text"
              value={form.organization}
              onChange={(e) => updateField("organization", e.target.value)}
              placeholder="Tana River County"
              className={inputCls}
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Phone Number</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className={inputCls}
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Email *</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="grace@county.go.ke"
              className={inputCls}
            />
          </label>

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Password *</span>
            <div className="relative mt-1.5">
              <input
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="Minimum 8 characters"
                className={`${inputCls} mt-0 pr-12`}
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

          <label className="block mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Confirm Password *</span>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="Re-enter password"
              className={inputCls}
            />
          </label>

          <label className="block mb-6">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Role</span>
            <select
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              className={`${inputCls} mt-1.5 cursor-pointer`}
            >
              <option value="viewer">Viewer — Read-only dashboard access</option>
              <option value="county_officer">County Officer — Dashboard + CSV reports</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
