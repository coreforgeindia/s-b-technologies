import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Tag, Briefcase, Filter, Images } from "lucide-react";
import { useProjects } from "@/hooks/use-content";

export default function Projects() {
  const { projects, loading } = useProjects();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");

  const industries = ["All", ...Array.from(new Set(projects.map((p) => p.industry).filter(Boolean)))];

  const filteredProjects = selectedIndustry === "All"
    ? projects
    : projects.filter((p) => p.industry === selectedIndustry);

  return (
    <div className="w-full bg-white">
      {/* Page Header */}
      <section className="bg-zinc-950 py-24 border-b-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent z-10" />
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our Projects</h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            A showcase of our completed installations, customized power solutions, and engineering achievements.
          </p>
        </div>
      </section>

      {/* Projects Portfolio */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Filtering Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-zinc-100 pb-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-2.5 text-navy font-bold text-lg">
              <Filter className="text-primary" size={20} />
              <span>Filter by Industry</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                    selectedIndustry === industry
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-zinc-50 border border-zinc-100 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden animate-pulse">
                  <div className="h-52 bg-zinc-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-zinc-200 rounded w-1/3" />
                    <div className="h-5 bg-zinc-200 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-full" />
                    <div className="h-3 bg-zinc-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24 text-zinc-400 max-w-6xl mx-auto">
              <Briefcase size={48} className="mx-auto mb-4" />
              <p className="text-lg font-semibold">No projects found</p>
              <p className="text-sm mt-2">
                {selectedIndustry !== "All" 
                  ? "Try selecting a different industry filter" 
                  : "Projects will appear here once added via the admin dashboard"}
              </p>
            </div>
          ) : (
            /* Grid Layout */
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Image Header */}
                    <div className="h-52 overflow-hidden relative">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                          <Briefcase size={40} className="text-zinc-300" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1.5 border border-zinc-200/50">
                        <Briefcase size={12} className="text-primary" />
                        {project.industry}
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-navy group-hover:text-primary transition-colors line-clamp-1">{project.name}</h3>
                        
                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {(project.technologies || []).map((tech) => (
                            <span 
                              key={tech} 
                              className="bg-zinc-50 border border-zinc-100 text-zinc-600 text-xs px-2.5 py-1 rounded font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center text-zinc-500 text-xs gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-primary" />
                          <span>{project.location}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
