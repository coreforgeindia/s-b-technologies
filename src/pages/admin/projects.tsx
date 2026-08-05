import { useEffect, useState, useCallback } from 'react';
import { supabase, logActivity } from '@/lib/supabase';
import type { Project } from '@/lib/supabase';
import {
  Plus, Pencil, Trash2, Save, X, Upload, Briefcase, AlertTriangle, MapPin, Tag,
} from 'lucide-react';

function getAdminEmail(): string {
  try {
    const raw = sessionStorage.getItem('sb_admin_direct_login');
    if (raw) return JSON.parse(raw).email;
  } catch {}
  return 'admin';
}

const projectFallbackImages: Record<string, string> = {
  p1: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80",
  p2: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  p3: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
  p4: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80",
  p5: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80",
  p6: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80"
};

function getProjectImage(proj: Project): string {
  if (proj.image_url) return proj.image_url;
  return projectFallbackImages[proj.id] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80";
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const { error } = await supabase.storage.from('project-images').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
  return data.publicUrl;
}

// ── Editable Tags ──
function EditableTags({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setNewTag('');
    }
  };

  return (
    <div>
      <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((val, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700">
            {val}
            <button onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-zinc-500 hover:text-red-400 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary"
        />
        <button onClick={addTag} className="px-3 py-2 bg-primary/20 text-primary rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}

const INDUSTRY_OPTIONS = [
  'Telecommunications',
  'Industrial Controls',
  'Medical Devices',
  'Automotive',
  'Consumer Electronics',
  'Aerospace & Defense',
  'Power Electronics',
  'IoT & Embedded Systems',
  'LED & Lighting',
  'Renewable Energy',
];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formTechnologies, setFormTechnologies] = useState<string[]>([]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order');
    setProjects((data as Project[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormLocation('');
    setFormIndustry('');
    setFormTechnologies([]);
    setFormImageUrl('');
    setFormSortOrder(projects.length + 1);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (proj: Project) => {
    setEditing(proj);
    setFormName(proj.name);
    setFormDescription(proj.description);
    setFormLocation(proj.location);
    setFormIndustry(proj.industry);
    setFormTechnologies(proj.technologies || []);
    setFormImageUrl(proj.image_url);
    setFormSortOrder(proj.sort_order);
    setShowForm(true);
  };

  const openNew = () => {
    resetForm();
    setFormSortOrder(projects.length + 1);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setFormImageUrl(url);
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) return alert('Project name is required');
    const email = getAdminEmail();

    const payload = {
      name: formName,
      description: formDescription,
      location: formLocation,
      industry: formIndustry,
      technologies: formTechnologies,
      image_url: formImageUrl,
      sort_order: formSortOrder,
    };

    if (editing?.id) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
      await logActivity(email, 'UPDATE', 'project', editing.id, `Updated project: ${formName}`);
    } else {
      const id = `proj-${Date.now()}`;
      await supabase.from('projects').insert({ ...payload, id });
      await logActivity(email, 'CREATE', 'project', id, `Added project: ${formName}`);
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    await supabase.from('projects').delete().eq('id', id);
    await logActivity(getAdminEmail(), 'DELETE', 'project', id, `Deleted project: ${name}`);
    setDeleteConfirm(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl">
            <Briefcase className="text-emerald-400 w-5 h-5" />
          </div>
          <div>
            <span className="text-white font-bold text-lg">{projects.length}</span>
            <span className="text-zinc-500 text-sm ml-2">Projects</span>
          </div>
        </div>
        <div className="flex gap-2">
          {Array.from(new Set(projects.map((p) => p.industry))).slice(0, 4).map((ind) => (
            <span key={ind} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-lg border border-zinc-700">
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={openNew}
          className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 flex items-center justify-center gap-2 text-sm font-bold transition-all"
        >
          <Plus size={18} /> Add New Project
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-400" />
            {editing ? 'Edit Project' : 'New Project'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Project Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Telecom Base Station Controller"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. Bangalore, Karnataka"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Industry</label>
              <select
                value={formIndustry}
                onChange={(e) => setFormIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select industry...</option>
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Sort Order</label>
              <input
                type="number"
                value={formSortOrder}
                onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              placeholder="Describe the project scope, deliverables, and outcomes..."
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-y"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Project Image</label>
            <div className="flex items-center gap-4">
              {formImageUrl && (
                <div className="w-32 h-24 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                  <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border border-zinc-700 border-dashed rounded-xl text-zinc-400 text-sm cursor-pointer hover:border-emerald-500 hover:text-emerald-400 transition-all">
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <EditableTags label="Technologies" values={formTechnologies} onChange={setFormTechnologies} />

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:from-emerald-400 hover:to-green-500 transition-all"
            >
              <Save size={16} /> {editing ? 'Update' : 'Add'} Project
            </button>
            <button onClick={resetForm} className="px-6 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-500/10 rounded-xl">
                <AlertTriangle className="text-red-400 w-5 h-5" />
              </div>
              <h3 className="text-white font-bold">Confirm Delete</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              Delete <strong className="text-white">{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600"
              >
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="px-6 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => {
          const imgSrc = getProjectImage(proj);
          return (
            <div key={proj.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors group">
              <div className="flex items-start gap-4">
                {imgSrc ? (
                  <div className="w-24 h-20 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700">
                    <img src={imgSrc} alt={proj.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-20 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
                    <Briefcase size={20} className="text-zinc-600" />
                  </div>
                )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-white font-bold text-sm">{proj.name}</h4>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{proj.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(proj)}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: proj.id, name: proj.name })}
                      className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 flex items-center gap-1">
                    <Tag size={10} /> {proj.industry}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-zinc-800 text-zinc-500 rounded flex items-center gap-1">
                    <MapPin size={10} /> {proj.location}
                  </span>
                  {(proj.technologies || []).slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
