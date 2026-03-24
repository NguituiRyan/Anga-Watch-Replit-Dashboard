import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  organization: string | null;
  phone: string | null;
  role: "admin" | "viewer" | "county_officer";
  created_at: string;
  last_login: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isViewer: boolean;
  isCountyOfficer: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isViewer: false,
  isCountyOfficer: false,
  role: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string, email?: string) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()
        .abortSignal(controller.signal);
      clearTimeout(timeout);
      if (error) {
        console.warn("Failed to fetch profile:", error.message);
        setProfile({
          id: userId,
          email: email ?? "",
          full_name: null,
          organization: null,
          phone: null,
          role: "viewer",
          created_at: new Date().toISOString(),
          last_login: null,
        });
      } else {
        setProfile(data as Profile);
      }
    } catch {
      setProfile({
        id: userId,
        email: email ?? "",
        full_name: null,
        organization: null,
        phone: null,
        role: "viewer",
        created_at: new Date().toISOString(),
        last_login: null,
      });
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      }
      if (mounted) setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    isViewer: profile?.role === "viewer",
    isCountyOfficer: profile?.role === "county_officer",
    role: profile?.role ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
