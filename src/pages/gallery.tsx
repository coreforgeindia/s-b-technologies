import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

import p1 from "@/assets/products/power-distribution-transformer.png";
import p2 from "@/assets/products/dry-type-transformer.png";
import p3 from "@/assets/products/dry-type-transformer-alt.png";
import p4 from "@/assets/products/booster-transformer.png";
import p5 from "@/assets/products/isolation-transformer.png";
import p6 from "@/assets/products/special-type-transformer.png";
import p7 from "@/assets/products/spm-fabrication.png";
import p8 from "@/assets/products/product-range-collage.png";

import c1 from "@/assets/construction/core-construction.png";
import c2 from "@/assets/construction/windings.png";
import c3 from "@/assets/construction/tank-fabrication.png";
import c4 from "@/assets/construction/terminations.png";
import c5 from "@/assets/construction/insulation.png";
import c6 from "@/assets/construction/accessories.png";

type GalleryItem = {
  id: string;
  src: string;
  title: string;
  category: "Products" | "Manufacturing";
};

const galleryData: GalleryItem[] = [
  { id: "g1", src: p1, title: "SMT Assembly Line", category: "Products" },
  { id: "g2", src: p2, title: "PCB Assembly Station", category: "Products" },
  { id: "g3", src: p3, title: "Multi-Layer PCB Board", category: "Products" },
  { id: "g4", src: p4, title: "Reflow Soldering Oven", category: "Products" },
  { id: "g5", src: p5, title: "Wave Soldering System", category: "Products" },
  { id: "g6", src: p6, title: "BGA / QFP Assembly", category: "Products" },
  { id: "g7", src: p7, title: "PCB CAD Design", category: "Manufacturing" },
  { id: "g8", src: p8, title: "Product Range Overview", category: "Products" },
  { id: "g9", src: c1, title: "Solder Paste Printing", category: "Manufacturing" },
  { id: "g10", src: c2, title: "Pick & Place Operation", category: "Manufacturing" },
  { id: "g11", src: c3, title: "Reflow Profile Setup", category: "Manufacturing" },
  { id: "g12", src: c4, title: "AOI Inspection", category: "Manufacturing" },
  { id: "g13", src: c5, title: "X-Ray Inspection", category: "Manufacturing" },
  { id: "g14", src: c6, title: "Component Storage & Handling", category: "Manufacturing" }
];

export default function Gallery() {
  const [filter, setFilter] = useState<"All" | "Products" | "Manufacturing">("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filteredItems = filter === "All" 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

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
            {(["All", "Products", "Manufacturing"] as const).map(cat => (
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

          {/* Masonry Grid */}
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
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  <p className="text-primary text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
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
              <motion.img 
                key={selectedIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={filteredItems[selectedIdx].src} 
                alt={filteredItems[selectedIdx].title} 
                className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
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
