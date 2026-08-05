import { useEffect, useState, useCallback } from 'react';
import { supabase, logActivity } from '@/lib/supabase';
import type { GalleryItem } from '@/lib/supabase';
import { galleryItems as staticGalleryItems } from '@/data/content';
import {
  Plus, Pencil, Trash2, Save, X, Upload, Images, AlertTriangle, Eye,
} from 'lucide-react';

function getAdminEmail(): string {
  try {
    const raw = sessionStorage.getItem('sb_admin_direct_login');
    if (raw) return JSON.parse(raw).email;
  } catch {}
  return 'admin';
}

function getItemImage(item: GalleryItem): string {
  if (item.image_url) return item.image_url;
  const match = staticGalleryItems.find((sg) => sg.id === item.id);
  return match ? match.src : '';
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  const { error } = await supabase.storage.from('gallery-images').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
  return data.publicUrl;
}

const CATEGORIES = ['Products', 'Manufacturing'];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Products');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const loadData = useCallback(async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order');
    setItems((data as GalleryItem[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Products');
    setFormImageUrl('');
    setFormSortOrder(items.length + 1);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormImageUrl(item.image_url);
    setFormSortOrder(item.sort_order);
    setShowForm(true);
  };

  const openNew = () => {
    resetForm();
    setFormSortOrder(items.length + 1);
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
    if (!formTitle.trim()) return alert('Title is required');
    const email = getAdminEmail();

    if (editing?.id) {
      await supabase.from('gallery_items').update({
        title: formTitle,
        category: formCategory,
        image_url: formImageUrl,
        sort_order: formSortOrder,
      }).eq('id', editing.id);
      await logActivity(email, 'UPDATE', 'gallery', editing.id, `Updated gallery item: ${formTitle}`);
    } else {
      const id = `g-${Date.now()}`;
      await supabase.from('gallery_items').insert({
        id,
        title: formTitle,
        category: formCategory,
        image_url: formImageUrl,
        sort_order: formSortOrder,
      });
      await logActivity(email, 'CREATE', 'gallery', id, `Added gallery item: ${formTitle}`);
    }
    resetForm();
    loadData();
  };

  const handleDelete = async (id: string, title: string) => {
    await supabase.from('gallery_items').delete().eq('id', id);
    await logActivity(getAdminEmail(), 'DELETE', 'gallery', id, `Deleted gallery item: ${title}`);
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
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-violet-500/10 rounded-xl">
            <Images className="text-violet-400 w-5 h-5" />
          </div>
          <div>
            <span className="text-white font-bold text-lg">{items.length}</span>
            <span className="text-zinc-500 text-sm ml-2">Gallery Items</span>
          </div>
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <span key={cat} className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-lg border border-zinc-700">
                {cat}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={openNew}
          className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-400 hover:text-violet-400 hover:border-violet-500 flex items-center justify-center gap-2 text-sm font-bold transition-all"
        >
          <Plus size={18} /> Add New Gallery Image
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Images size={18} className="text-violet-400" />
            {editing ? 'Edit Gallery Item' : 'New Gallery Item'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Image title..."
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Image</label>
            <div className="flex items-center gap-4">
              {formImageUrl && (
                <div className="w-32 h-24 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                  <img src={formImageUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border border-zinc-700 border-dashed rounded-xl text-zinc-400 text-sm cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-all">
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-2 uppercase tracking-wider">Sort Order</label>
            <input
              type="number"
              value={formSortOrder}
              onChange={(e) => setFormSortOrder(parseInt(e.target.value) || 0)}
              className="w-32 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:from-violet-400 hover:to-purple-500 transition-all"
            >
              <Save size={16} /> {editing ? 'Update' : 'Add'} Gallery Item
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
              Delete <strong className="text-white">{deleteConfirm.title}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.title)}
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

      {/* Image Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-xl" />
          <button onClick={() => setPreviewUrl(null)} className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const imgSrc = getItemImage(item);
          return (
            <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
              <div className="aspect-[4/3] bg-zinc-800 relative overflow-hidden">
                {imgSrc ? (
                  <img src={imgSrc} alt={item.title} className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Images size={40} />
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {imgSrc && (
                    <button
                      onClick={() => setPreviewUrl(imgSrc)}
                      className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(item)}
                    className="p-3 bg-white/10 rounded-xl text-white hover:bg-primary/50 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ id: item.id, title: item.title })}
                    className="p-3 bg-white/10 rounded-xl text-white hover:bg-red-500/50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold px-2 py-1 bg-violet-500/10 text-violet-400 rounded border border-violet-500/20">
                    {item.category}
                  </span>
                  <span className="text-zinc-600 text-xs">#{item.sort_order}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
