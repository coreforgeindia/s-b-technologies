import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useGalleryItems } from "@/hooks/use-content";

export default function Gallery() {
  const { items: galleryItems, loading } = useGalleryItems();
  const [filter, setFilter] = useState<string>("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Get unique categories from data
  const categories = ["All", ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredItems = filter === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const handleNext = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % filteredItems.length);
    }
  }, [selectedIdx, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [selectedIdx, filteredItems.length]);

  const handleClose = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, handleClose, handleNext, handlePrev]);

  useEffect(() => {
    if (selectedIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedIdx]);

  return (
    <div className="w-full bg-zinc-50 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-zinc-950 py-24 border-b-4 border-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Images className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Visual Gallery
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl">
            A closer look at our engineered products and manufacturing processes.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          {/* Filters */}
          <div className="flex justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setSelectedIdx(null); }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  filter === cat 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="break-inside-avoid rounded-2xl bg-zinc-200 animate-pulse" style={{ height: `${200 + (i % 3) * 60}px` }} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24 text-zinc-400">
              <Images size={48} className="mx-auto mb-4" />
              <p className="text-lg font-semibold">No gallery images yet</p>
              <p className="text-sm mt-2">Add images through the admin dashboard</p>
            </div>
          ) : (
            /* Masonry Grid */
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredItems.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 10) * 0.05 }}
                  className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer bg-white border border-zinc-200 shadow-sm"
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="bg-zinc-100 flex items-center justify-center p-4 min-h-[200px]">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-center text-zinc-400 py-8">
                        <Images size={40} className="mx-auto mb-2" />
                        <p className="text-sm font-bold">{item.title}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                    <p className="text-primary text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && filteredItems[selectedIdx] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="w-full max-w-5xl max-h-[85vh] p-4 flex flex-col items-center justify-center" onClick={handleClose}>
              {filteredItems[selectedIdx].image_url ? (
                <motion.img 
                  key={selectedIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={filteredItems[selectedIdx].image_url} 
                  alt={filteredItems[selectedIdx].title} 
                  className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="text-center text-zinc-500">
                  <Images size={64} className="mx-auto mb-4" />
                  <p className="text-lg font-bold">No image available</p>
                </div>
              )}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-1">{filteredItems[selectedIdx].title}</h3>
                <p className="text-primary font-semibold">{filteredItems[selectedIdx].category}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
