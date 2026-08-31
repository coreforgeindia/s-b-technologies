import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Download, FileText, Filter, HelpCircle } from "lucide-react";
import { resources } from "@/data/content";
import { Button } from "@/components/ui/button";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const types = ["All", ...Array.from(new Set(resources.map((r) => r.type)))];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full bg-white">
      {/* Page Header */}
      <section className="bg-zinc-950 py-24 border-b-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent z-10" />
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Technical Resources</h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Download our company profile, catalogues, certificates, type-testing reportsand manuals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 bg-zinc-50 border border-zinc-100 p-6 rounded-2xl">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedType === type
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <FileText size={22} />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 bg-zinc-100 text-zinc-600 font-bold text-[10px] uppercase rounded tracking-wider">
                      {resource.type}
                    </span>
                    <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors leading-snug">{resource.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                      {resource.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span>Size: {resource.fileSize}</span>
                    {/* Simulated download */}
                    <a
                      href="#download"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading ${resource.title}... (Mock File Transfer)`);
                      }}
                      className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Download size={14} /> Download PDF
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredResources.length === 0 && (
            <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <HelpCircle className="mx-auto text-zinc-400 mb-4" size={40} />
              <p className="text-zinc-600 font-medium">No resources match your search criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
