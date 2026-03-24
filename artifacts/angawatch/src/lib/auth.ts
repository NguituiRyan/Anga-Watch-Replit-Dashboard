import { supabase } from "./supabase";

const SAFE_ROLES = new Set(["viewer", "county_officer"]);

export interface SignUpPayload {
  email: string;
  password: string;
  fullName: string;
  organization?: string;
  phone?: string;
  role?: string;
}

export async function signUp({ email, password, fullName, organization, phone, role = "viewer" }: SignUpPayload) {
  const safeRole = SAFE_ROLES.has(role) ? role : "viewer";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: safeRole },
    },
  });
  if (error) throw error;

  if (!data.session) {
    throw new Error("Please check your email to confirm your account, then sign in.");
  }

  if (data.user) {
    await supabase
      .from("profiles")
      .update({ organization, phone, full_name: fullName })
      .eq("id", data.user.id);
  }
  return data;
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  await supabase
    .from("profiles")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.user.id);

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
