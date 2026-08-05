import { createContext, useContext } from 'react';
import { supabase, logActivity } from './supabase';
import type { User } from '@supabase/supabase-js';

// ── Types ──
export interface AdminAuthState {
  user: User | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AdminAuthActions {
  loginWithPassword: (email: string, password: string) => Promise<{ needsOtp: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

export type AdminAuthContextType = AdminAuthState & AdminAuthActions;

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

// ── Direct login check ──
const DIRECT_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase();
const DIRECT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export function isDirectLoginUser(email: string): boolean {
  return email.toLowerCase() === DIRECT_EMAIL;
}

export function validateDirectLogin(email: string, password: string): boolean {
  return email.toLowerCase() === DIRECT_EMAIL && password === DIRECT_PASSWORD;
}

// ── Supabase auth helpers ──
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error && data.user) {
    await logActivity(email, 'LOGIN', 'auth', null, 'User logged in with password');
  }
  return { data, error };
}

export async function signInWithOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  return { data, error };
}

export async function verifyOtpToken(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (!error && data.user) {
    await logActivity(email, 'LOGIN', 'auth', null, 'User logged in with OTP');
  }
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
