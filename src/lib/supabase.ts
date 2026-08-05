import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Type definitions for our database tables ──

export interface Product {
  id: string;
  title: string;
  description: string;
  detail: string;
  image_url: string;
  features: string[];
  applications: string[];
  gallery: { url: string; caption: string }[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  industries: string[];
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  tagline: string;
  established: number;
  certifications: string[];
  phones: string[];
  email: string;
  website: string;
  address: string;
  map_link: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  industry: string;
  technologies: string[];
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ── Helper: Log an activity ──
export async function logActivity(
  userEmail: string,
  action: string,
  entityType: string,
  entityId: string | null,
  details: string
) {
  await supabase.from('activity_logs').insert({
    user_email: userEmail,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
}

// ── Helper: Get public URL for a storage file ──
export function getStorageUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
