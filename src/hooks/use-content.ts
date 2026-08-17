/**
 * Hook to fetch website content from Supabase with fallback to static data.
 * Used by public-facing pages (Products, Gallery, Contact, Layout, Projects).
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Service, GalleryItem, CompanyProfile, Project } from '@/lib/supabase';
import {
  products as staticProducts,
  companyInfo as staticCompanyInfo,
  projects as staticProjects,
  galleryItems as staticGalleryItems,
} from '@/data/content';

// Static fallback image for projects
const projectFallbackImages: Record<string, string> = {
  p1: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80",
  p2: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  p3: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
  p4: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80",
  p5: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80",
  p6: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80"
};

// ── Products ──
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sort_order');

        if (!error && data && data.length > 0) {
          // Fill in image_url from static asset if image_url is empty in DB
          const mapped = (data as Product[]).map((p) => {
            const staticMatch = staticProducts.find((sp) => sp.id === p.id);
            const defaultImg = staticMatch && typeof staticMatch.image === 'string' ? staticMatch.image : '';
            const defaultGallery = (staticMatch?.gallery || []).map((g: any) => ({
              url: typeof g.url === 'string' ? g.url : '',
              caption: g.caption || '',
            }));

            return {
              ...p,
              image_url: p.image_url || defaultImg,
              gallery: p.gallery && p.gallery.length > 0 && p.gallery.some(g => g.url) 
                ? p.gallery 
                : defaultGallery,
            };
          });
          setProducts(mapped);
        } else {
          // Fallback to static
          setProducts(
            staticProducts.map((p, i) => ({
              id: p.id,
              title: p.title,
              description: p.description,
              detail: p.detail,
              image_url: typeof p.image === 'string' ? p.image : '',
              features: p.features,
              applications: [],
              gallery: p.gallery?.map((g: any) => ({
                url: typeof g.url === 'string' ? g.url : '',
                caption: g.caption,
              })) || [],
              sort_order: i,
              created_at: '',
              updated_at: '',
            }))
          );
        }
      } catch {
        // Use static fallback on error
        setProducts(
          staticProducts.map((p, i) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            detail: p.detail,
            image_url: typeof p.image === 'string' ? p.image : '',
            features: p.features,
            applications: [],
            gallery: [],
            sort_order: i,
            created_at: '',
            updated_at: '',
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { products, loading };
}

// ── Services ──
export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('sort_order');

        if (!error && data && data.length > 0) {
          setServices(data as Service[]);
        }
      } catch {
        // No static fallback for services
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { services, loading };
}

// ── Gallery ──
export function useGalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .select('*')
          .order('sort_order');

        if (!error && data && data.length > 0) {
          const mapped = (data as GalleryItem[]).map((item) => {
            const staticMatch = staticGalleryItems.find((sg) => sg.id === item.id);
            return {
              ...item,
              image_url: item.image_url || (staticMatch ? staticMatch.src : ''),
            };
          });
          setItems(mapped);
        } else {
          setItems(
            staticGalleryItems.map((g, i) => ({
              id: g.id,
              title: g.title,
              category: g.category,
              image_url: g.src,
              sort_order: i + 1,
              created_at: '',
              updated_at: '',
            }))
          );
        }
      } catch {
        setItems(
          staticGalleryItems.map((g, i) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            image_url: g.src,
            sort_order: i + 1,
            created_at: '',
            updated_at: '',
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { items, loading };
}

// ── Company Profile ──
export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('company_profile')
          .select('*')
          .eq('id', 'main')
          .single();

        if (!error && data) {
          const p = data as CompanyProfile;
          if (!p.tagline || p.tagline.toUpperCase().includes('ELECTRONICS MANUFACTURING SERVICES')) {
            p.tagline = 'Implementing Technology';
          }
          if (p.phones) {
            p.phones = p.phones.filter(ph => !ph.includes('26662994'));
            if (!p.phones.some(ph => ph.includes('7353775422') || ph.includes('73537 75422'))) {
              p.phones.push('+91 73537 75422');
            }
          }
          setProfile(p);
        } else {
          setProfile({
            id: 'main',
            name: staticCompanyInfo.name,
            tagline: staticCompanyInfo.tagline,
            established: staticCompanyInfo.established,
            certifications: staticCompanyInfo.certifications,
            phones: staticCompanyInfo.phones,
            email: staticCompanyInfo.email,
            website: staticCompanyInfo.website,
            address: staticCompanyInfo.address,
            map_link: '',
            updated_at: '',
          });
        }
      } catch {
        setProfile({
          id: 'main',
          name: staticCompanyInfo.name,
          tagline: staticCompanyInfo.tagline,
          established: staticCompanyInfo.established,
          certifications: staticCompanyInfo.certifications,
          phones: staticCompanyInfo.phones,
          email: staticCompanyInfo.email,
          website: staticCompanyInfo.website,
          address: staticCompanyInfo.address,
          map_link: '',
          updated_at: '',
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { profile, loading };
}

// ── Projects ──
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order');

        if (!error && data && data.length > 0) {
          const mapped = (data as Project[]).map((p) => ({
            ...p,
            image_url: p.image_url || projectFallbackImages[p.id] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
          }));
          setProjects(mapped);
        } else {
          setProjects(
            staticProjects.map((p, i) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              location: p.location,
              industry: p.industry,
              technologies: p.technologies,
              image_url: projectFallbackImages[p.id] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
              sort_order: i,
              created_at: '',
              updated_at: '',
            }))
          );
        }
      } catch {
        setProjects(
          staticProjects.map((p, i) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            location: p.location,
            industry: p.industry,
            technologies: p.technologies,
            image_url: projectFallbackImages[p.id] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
            sort_order: i,
            created_at: '',
            updated_at: '',
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { projects, loading };
}
