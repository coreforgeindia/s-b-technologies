import { useEffect, useState, useCallback } from 'react';
import { supabase, logActivity } from '@/lib/supabase';
import type { Product, Service } from '@/lib/supabase';
import { products as staticProducts } from '@/data/content';
import {
  Plus, Pencil, Trash2, Save, X, Upload, Package, Settings,
  ChevronDown, ChevronUp, GripVertical, Layers, AlertTriangle,
} from 'lucide-react';

// ── Get admin email from session ──
function getAdminEmail(): string {
  try {
    const raw = sessionStorage.getItem('sb_admin_direct_login');
    if (raw) return JSON.parse(raw).email;
  } catch {}
  return 'admin';
}

function getProductImage(product: Product): string {
  if (product.image_url) return product.image_url;
  const match = staticProducts.find((sp) => sp.id === product.id);
  return match && typeof match.image === 'string' ? match.image : '';
}

// ── Icon options for services ──
const ICON_OPTIONS = ['Settings', 'Factory', 'Layers', 'Wrench', 'Zap', 'Shield', 'Cpu', 'Package'];

// ── Image Upload Helper ──
async function uploadImage(file: File, bucket: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

// ── Editable Tags Component ──
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
// ── Gallery Images Editor (Multi-image upload) ──
function GalleryImagesEditor({
  gallery,
  onChange,
}: {
  gallery: { url: string; caption: string }[];
  onChange: (gallery: { url: string; caption: string }[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newItems: { url: string; caption: string }[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, 'product-images');
        newItems.push({ url, caption: file.name.replace(/\.[^.]+$/, '') });
      }
      onChange([...gallery, ...newItems]);
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeItem = (index: number) => {
    onChange(gallery.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...gallery];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">
        Gallery Images ({gallery.length})
      </label>
      <p className="text-zinc-600 text-xs mb-3">
        Upload multiple images for the product gallery. Each can have a caption.
      </p>

      {/* Existing gallery items */}
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {gallery.map((item, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 group relative">
              <div className="aspect-[4/3] flex items-center justify-center p-2">
                <img src={item.url} alt={item.caption} className="w-full h-full object-contain" />
              </div>
              <div className="p-2 border-t border-zinc-700">
                <input
                  type="text"
                  value={item.caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Caption..."
                  className="w-full px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={() => removeItem(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <label className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border border-zinc-700 border-dashed rounded-xl text-zinc-400 text-sm cursor-pointer hover:border-primary hover:text-primary transition-all w-max">
        <Upload size={16} />
        {uploading ? 'Uploading...' : 'Add Gallery Images'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}

// ── Product Form ──
function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Partial<Product> | null;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Product>>({
    title: '',
    description: '',
    detail: '',
    image_url: '',
    features: [],
    applications: [],
    gallery: [],
    sort_order: 0,
    ...product,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'product-images');
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <Package size={18} className="text-primary" />
        {product?.id ? 'Edit Product' : 'New Product'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Sort Order</label>
          <input
            type="number"
            value={form.sort_order || 0}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Short Description</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-y"
        />
      </div>

      <div>
        <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Detail (Long Description)</label>
        <textarea
          value={form.detail || ''}
          onChange={(e) => setForm({ ...form, detail: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-y"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Product Image</label>
        <div className="flex items-center gap-4">
          {form.image_url && (
            <div className="w-24 h-24 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
              <img src={form.image_url} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border border-zinc-700 border-dashed rounded-xl text-zinc-400 text-sm cursor-pointer hover:border-primary hover:text-primary transition-all">
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      <EditableTags label="Features" values={form.features || []} onChange={(vals) => setForm({ ...form, features: vals })} />
      <EditableTags label="Applications" values={form.applications || []} onChange={(vals) => setForm({ ...form, applications: vals })} />

      {/* Gallery Images (Multiple) */}
      <GalleryImagesEditor
        gallery={form.gallery || []}
        onChange={(gallery) => setForm({ ...form, gallery })}
      />

      <div className="flex gap-3 pt-4 border-t border-zinc-800">
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:from-primary/90 hover:to-blue-500 transition-all"
        >
          <Save size={16} /> Save Product
        </button>
        <button onClick={onCancel} className="px-6 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Service Form ──
function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service: Partial<Service> | null;
  onSave: (data: Partial<Service>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Service>>({
    title: '',
    description: '',
    benefits: [],
    industries: [],
    icon: 'Settings',
    sort_order: 0,
    ...service,
  });

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <Layers size={18} className="text-violet-400" />
        {service?.id ? 'Edit Service' : 'New Service'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Icon</label>
          <select
            value={form.icon || 'Settings'}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
          >
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Description</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary resize-y"
        />
      </div>

      <EditableTags label="Benefits" values={form.benefits || []} onChange={(vals) => setForm({ ...form, benefits: vals })} />
      <EditableTags label="Industries" values={form.industries || []} onChange={(vals) => setForm({ ...form, industries: vals })} />

      <div>
        <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Sort Order</label>
        <input
          type="number"
          value={form.sort_order || 0}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
          className="w-32 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-zinc-800">
        <button
          onClick={() => onSave(form)}
          className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:from-violet-400 hover:to-purple-500 transition-all"
        >
          <Save size={16} /> Save Service
        </button>
        <button onClick={onCancel} className="px-6 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; title: string } | null>(null);

  const loadData = useCallback(async () => {
    const [{ data: prods }, { data: servs }] = await Promise.all([
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('services').select('*').order('sort_order'),
    ]);
    setProducts((prods as Product[]) || []);
    setServices((servs as Service[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Product CRUD ──
  const saveProduct = async (data: Partial<Product>) => {
    const email = getAdminEmail();
    if (data.id && products.find((p) => p.id === data.id)) {
      // Update
      const { id, created_at, updated_at, ...rest } = data as any;
      await supabase.from('products').update(rest).eq('id', id);
      await logActivity(email, 'UPDATE', 'product', id, `Updated product: ${data.title}`);
    } else {
      // Create
      const { created_at, updated_at, ...rest } = data as any;
      const id = rest.id || (rest.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await supabase.from('products').insert({ ...rest, id });
      await logActivity(email, 'CREATE', 'product', id, `Created product: ${data.title}`);
    }
    setShowProductForm(false);
    setEditingProduct(null);
    loadData();
  };

  const deleteProduct = async (id: string, title: string) => {
    await supabase.from('products').delete().eq('id', id);
    await logActivity(getAdminEmail(), 'DELETE', 'product', id, `Deleted product: ${title}`);
    setDeleteConfirm(null);
    loadData();
  };

  // ── Service CRUD ──
  const saveService = async (data: Partial<Service>) => {
    const email = getAdminEmail();
    if (data.id && services.find((s) => s.id === data.id)) {
      const { id, created_at, updated_at, ...rest } = data as any;
      await supabase.from('services').update(rest).eq('id', id);
      await logActivity(email, 'UPDATE', 'service', id, `Updated service: ${data.title}`);
    } else {
      const { created_at, updated_at, ...rest } = data as any;
      const id = rest.id || (rest.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await supabase.from('services').insert({ ...rest, id });
      await logActivity(email, 'CREATE', 'service', id, `Created service: ${data.title}`);
    }
    setShowServiceForm(false);
    setEditingService(null);
    loadData();
  };

  const deleteService = async (id: string, title: string) => {
    await supabase.from('services').delete().eq('id', id);
    await logActivity(getAdminEmail(), 'DELETE', 'service', id, `Deleted service: ${title}`);
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
      {/* Tab Switcher */}
      <div className="flex gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-1.5">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Package size={16} /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'services'
              ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Layers size={16} /> Services ({services.length})
        </button>
      </div>

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete <strong className="text-white">{deleteConfirm.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'product') deleteProduct(deleteConfirm.id, deleteConfirm.title);
                  else deleteService(deleteConfirm.id, deleteConfirm.title);
                }}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Add Button */}
          {!showProductForm && (
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-400 hover:text-primary hover:border-primary flex items-center justify-center gap-2 text-sm font-bold transition-all"
            >
              <Plus size={18} /> Add New Product
            </button>
          )}

          {/* Product Form */}
          {showProductForm && (
            <ProductForm
              product={editingProduct}
              onSave={saveProduct}
              onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
            />
          )}

          {/* Product List */}
          {products.map((product) => {
            const imgSrc = getProductImage(product);
            return (
              <div key={product.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-full bg-primary/30 rounded-full hidden md:block" />
                  {imgSrc ? (
                    <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-700">
                      <img src={imgSrc} alt={product.title} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-700">
                      <Package size={24} className="text-zinc-600" />
                    </div>
                  )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-white font-bold text-sm">{product.title}</h4>
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'product', id: product.id, title: product.title })}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(product.features || []).slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">{f}</span>
                    ))}
                    <span className="text-[10px] font-bold px-2 py-1 bg-zinc-800 text-zinc-500 rounded">#{product.sort_order}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {!showServiceForm && (
            <button
              onClick={() => { setEditingService(null); setShowServiceForm(true); }}
              className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-400 hover:text-violet-400 hover:border-violet-500 flex items-center justify-center gap-2 text-sm font-bold transition-all"
            >
              <Plus size={18} /> Add New Service
            </button>
          )}

          {showServiceForm && (
            <ServiceForm
              service={editingService}
              onSave={saveService}
              onCancel={() => { setShowServiceForm(false); setEditingService(null); }}
            />
          )}

          {services.map((service) => (
            <div key={service.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-violet-500/10 rounded-xl flex-shrink-0">
                  <Settings size={18} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-white font-bold text-sm">{service.title}</h4>
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingService(service); setShowServiceForm(true); }}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'service', id: service.id, title: service.title })}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(service.industries || []).map((ind, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-1 bg-violet-500/10 text-violet-400 rounded border border-violet-500/20">{ind}</span>
                    ))}
                    <span className="text-[10px] font-bold px-2 py-1 bg-zinc-800 text-zinc-500 rounded">Icon: {service.icon}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
