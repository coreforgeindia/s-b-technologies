import { useEffect, useState } from 'react';
import { supabase, logActivity } from '@/lib/supabase';
import type { CompanyProfile } from '@/lib/supabase';
import {
  Save, MapPin, Phone, Mail, Globe, Building2, Award, Calendar,
  CheckCircle2, X, Plus,
} from 'lucide-react';

function getAdminEmail(): string {
  try {
    const raw = sessionStorage.getItem('sb_admin_direct_login');
    if (raw) return JSON.parse(raw).email;
  } catch {}
  return 'admin';
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [established, setEstablished] = useState(1995);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('company_profile').select('*').eq('id', 'main').single();
      if (data) {
        const p = data as CompanyProfile;
        setProfile(p);
        setName(p.name);
        setTagline(p.tagline);
        setEstablished(p.established);
        setCertifications(p.certifications || []);
        setPhones(p.phones || []);
        setEmail(p.email);
        setWebsite(p.website);
        setAddress(p.address);
        setMapLink(p.map_link);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const updates = {
      name,
      tagline,
      established,
      certifications,
      phones,
      email,
      website,
      address,
      map_link: mapLink,
    };

    if (profile) {
      await supabase.from('company_profile').update(updates).eq('id', 'main');
    } else {
      await supabase.from('company_profile').insert({ id: 'main', ...updates });
    }

    await logActivity(getAdminEmail(), 'UPDATE', 'profile', 'main', 'Updated company profile & contact details');

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Success Toast */}
      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-right">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">Profile updated successfully!</span>
        </div>
      )}

      {/* Company Information */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Building2 className="text-primary w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-lg">Company Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <Calendar size={12} /> Year Established
          </label>
          <input
            type="number"
            value={established}
            onChange={(e) => setEstablished(parseInt(e.target.value) || 0)}
            className="w-40 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <Award size={12} /> Certifications
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {certifications.map((cert, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700">
                {cert}
                <button onClick={() => setCertifications(certifications.filter((_, j) => j !== i))} className="text-zinc-500 hover:text-red-400">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCert.trim()) {
                  e.preventDefault();
                  setCertifications([...certifications, newCert.trim()]);
                  setNewCert('');
                }
              }}
              placeholder="Add certification..."
              className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => {
                if (newCert.trim()) {
                  setCertifications([...certifications, newCert.trim()]);
                  setNewCert('');
                }
              }}
              className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/30"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl">
            <Phone className="text-emerald-400 w-5 h-5" />
          </div>
          <h3 className="text-white font-bold text-lg">Contact Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
              <Globe size={12} /> Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Phone Numbers */}
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <Phone size={12} /> Phone Numbers
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {phones.map((phone, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700">
                {phone}
                <button onClick={() => setPhones(phones.filter((_, j) => j !== i))} className="text-zinc-500 hover:text-red-400">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newPhone.trim()) {
                  e.preventDefault();
                  setPhones([...phones, newPhone.trim()]);
                  setNewPhone('');
                }
              }}
              placeholder="Add phone number..."
              className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary"
            />
            <button
              onClick={() => {
                if (newPhone.trim()) {
                  setPhones([...phones, newPhone.trim()]);
                  setNewPhone('');
                }
              }}
              className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-500/30"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={12} /> Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-y"
          />
        </div>

        {/* Map Link */}
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={12} /> Google Maps Embed Link
          </label>
          <input
            type="text"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
          />
          {mapLink && (
            <div className="mt-3 rounded-xl overflow-hidden border border-zinc-700 h-48">
              <iframe src={mapLink} className="w-full h-full border-0" loading="lazy" title="Map Preview" />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm hover:from-primary/90 hover:to-blue-500 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
        ) : (
          <>
            <Save size={18} /> Save All Changes
          </>
        )}
      </button>
    </div>
  );
}
