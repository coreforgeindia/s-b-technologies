import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowRight, CheckCircle2, ShieldCheck, Factory, Zap, 
  Settings, Users, Briefcase, HelpCircle, MessageSquare, ChevronDown, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats, faqs, industries } from "@/data/content";
import { useProducts, useProjects, useGalleryItems, useCompanyProfile } from "@/hooks/use-content";
import heroBg from "@/assets/hero-bg.png";
import { AnimatedCounter } from "@/components/animated-counter";
import { useState } from "react";

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { products, loading: productsLoading } = useProducts();
  const { projects, loading: projectsLoading } = useProjects();
  const { items: galleryItems, loading: galleryLoading } = useGalleryItems();
  const { profile } = useCompanyProfile();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const clientLogos = [
    { name: "JUKI", type: "Equipment" },
    { name: "Yamaha", type: "Partner" },
    { name: "Kester", type: "Supplier" },
    { name: "Indium", type: "Materials" },
    { name: "Vishay", type: "Components" },
    { name: "Murata", type: "Supplier" }
  ];

  // Use first 3 gallery items with images for preview, or fallback placeholder
  const previewGallery = galleryItems
    .filter(g => g.image_url)
    .slice(0, 3);

  // Dynamic company info
  const companyName = profile?.name || 'S.B. TECHNOLOGIES';
  const companyTagline = profile?.tagline || 'ELECTRONICS MANUFACTURING SERVICES';

  // Loading skeleton for cards
  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-sm animate-pulse">
      <div className="h-44 bg-zinc-200" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-zinc-200 rounded w-3/4" />
        <div className="h-3 bg-zinc-100 rounded w-full" />
        <div className="h-3 bg-zinc-100 rounded w-2/3" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-white font-sans">
      
      {/* 1. Hero Section */}
      <section 
        className="relative min-h-[100vh] flex items-end pb-24 justify-center overflow-hidden bg-zinc-950 border-b border-zinc-900"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent z-10" />
        </div>
        
        <div className="max-w-[1280px] w-full relative z-10 px-4 md:px-8 mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl text-left"
          >
            <motion.span 
              variants={fadeIn} 
              className="inline-block px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest rounded-full mb-6"
            >
              IPC-A-610 Compliant
            </motion.span>
            
            <motion.h1 
              variants={fadeIn} 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight uppercase font-display"
            >
              {companyName} <br />
              <span className="text-primary text-3xl sm:text-4xl md:text-5xl">{companyTagline}</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn} 
              className="text-lg md:text-xl text-zinc-300 mb-10 max-w-2xl leading-relaxed"
            >
              Delivering Precision PCB Assembly, SMT Soldering, Through-Hole Assembly, and CAD/CAM Design Services to Clients Across the Globe.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-base shadow-xl shadow-primary/20 rounded-xl">
                  Explore Products & Services <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-zinc-900/50 backdrop-blur-sm text-white border-white/20 hover:bg-white/10 hover:text-white rounded-xl">
                  Request Quote
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-primary rounded-full" 
            />
          </div>
        </div>
      </section>

      {/* 2. About Company Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Trusted EMS Partner Since {profile?.established || 1995}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy">Who We Are</h2>
              <div className="h-1 w-20 bg-primary"></div>
              <p className="text-zinc-600 text-lg leading-relaxed">
                {companyName} is a Bangalore-based Electronics Manufacturing Services (EMS) provider offering PCB manufacturing, automated reflow soldering, through-hole and SMD technology assembly, and PCB CAD/CAM design services to clients across the globe.
              </p>
              <p className="text-zinc-500 leading-relaxed text-sm">
                With IPC-A-610 compliant processes, state-of-the-art JUKI pick-and-place machines, and multi-zone reflow ovens, we deliver consistent, high-quality assemblies from prototype to production volume.
              </p>
              <div className="pt-4">
                <Link href="/about">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl">
                    More About Company <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex flex-col justify-center space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-lg mb-1">IPC-A-610 Compliant</h4>
                  <p className="text-zinc-600 text-sm">Industry-standard workmanship ensuring consistent, high-reliability assemblies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Factory size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-navy text-lg mb-1">Advanced SMT Equipment</h4>
                  <p className="text-zinc-600 text-sm">JUKI pick-and-place machines, multi-zone reflow ovens, and automated inspection systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Preview */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-150">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Our Competitive Edge</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">Why Choose {companyName}</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-xl font-bold text-navy">Quality & IPC Standards</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  All assemblies manufactured and inspected per IPC-A-610 Class 2 and Class 3 standards with AOI and X-ray verification.
                </p>
              </div>
              <Link href="/why-us" className="block mt-6">
                <span className="text-primary text-xs font-bold hover:underline cursor-pointer flex items-center gap-1">
                  Learn More &rarr;
                </span>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Settings size={22} />
                </div>
                <h3 className="text-xl font-bold text-navy">Custom Assembly Solutions</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  From prototype runs to high-volume production, we tailor our SMT and through-hole processes to your exact specifications and DFM requirements.
                </p>
              </div>
              <Link href="/why-us" className="block mt-6">
                <span className="text-primary text-xs font-bold hover:underline cursor-pointer flex items-center gap-1">
                  Learn More &rarr;
                </span>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users size={22} />
                </div>
                <h3 className="text-xl font-bold text-navy">Dedicated OEM Support</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  From BOM sourcing to box-build assembly and firmware flashing, our engineers provide complete turnkey EMS support for OEM clients.
                </p>
              </div>
              <Link href="/why-us" className="block mt-6">
                <span className="text-primary text-xs font-bold hover:underline cursor-pointer flex items-center gap-1">
                  Learn More &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products & Services Preview (from Supabase) */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Our Offerings</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">Featured Solutions</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            <Link href="/products">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl h-12 mt-4 sm:mt-0">
                View Full Range <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            ) : (
              products.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/45 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="h-44 bg-zinc-950 p-6 flex items-center justify-center border-b-2 border-primary">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="text-zinc-600 text-center">
                          <Zap size={40} className="mx-auto mb-2 text-zinc-700" />
                          <span className="text-xs">{product.title}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="font-bold text-navy text-lg line-clamp-1">{product.title}</h3>
                      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{product.description}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href={`/products/${product.id}`}>
                      <span className="text-primary text-xs font-bold hover:underline cursor-pointer flex items-center gap-1">
                        Details <ArrowRight size={12} />
                      </span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Industries We Serve */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-150">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Diverse Applications</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">Industries We Serve</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            <Link href="/industries">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl h-12 mt-4 sm:mt-0">
                All Industries <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {industries.slice(0, 5).map((ind) => (
              <div key={ind.id} className="bg-white p-6 rounded-2xl border border-zinc-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                  <Zap size={20} />
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{ind.name}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{ind.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Projects (from Supabase) */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Engineering Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">Featured Projects</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            <Link href="/projects">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl h-12 mt-4 sm:mt-0">
                View All Projects <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-sm animate-pulse">
                  <div className="h-52 bg-zinc-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-zinc-200 rounded w-1/3" />
                    <div className="h-5 bg-zinc-200 rounded w-3/4" />
                    <div className="h-3 bg-zinc-100 rounded w-full" />
                  </div>
                </div>
              ))
            ) : (
              projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                  {proj.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={proj.image_url} alt={proj.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <span className="inline-block px-2.5 py-0.5 bg-zinc-100 text-zinc-600 font-bold text-[9px] uppercase rounded">
                      {proj.industry}
                    </span>
                    <h3 className="text-lg font-bold text-navy">{proj.name}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">{proj.description}</p>
                  </div>
                  <div className="p-6 pt-0 border-t border-zinc-50 bg-zinc-50/50 flex items-center text-zinc-500 text-xs gap-1.5">
                    <MapPin size={12} className="text-primary" />
                    <span>{proj.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7. Statistics Counter */}
      <section className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 animate-fade-in">
                <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base font-semibold text-zinc-300 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Client Logos */}
      <section className="py-16 bg-zinc-50 border-b border-zinc-150">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <p className="text-center text-zinc-400 font-bold text-xs uppercase tracking-widest mb-10">
            Trusted Equipment & Material Partners
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-65 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            {clientLogos.map((client, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white border border-zinc-200 px-6 py-4 rounded-xl shadow-sm w-36 text-center">
                <span className="font-extrabold text-navy text-lg leading-tight tracking-tight uppercase">
                  {client.name}
                </span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-wide">
                  {client.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Gallery Preview (from Supabase) */}
      <section className="py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
            <div>
              <span className="text-primary font-bold text-sm uppercase tracking-wider">Visual Showcase</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">Assembly & Facility Gallery</h2>
              <div className="h-1 w-20 bg-primary"></div>
            </div>
            <Link href="/gallery">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl h-12 mt-4 sm:mt-0">
                View Gallery <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {galleryLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-zinc-200 animate-pulse" />
              ))
            ) : previewGallery.length > 0 ? (
              previewGallery.map((gal, i) => (
                <div key={gal.id || i} className="h-64 rounded-2xl overflow-hidden relative group border border-zinc-150 shadow-sm">
                  <img src={gal.image_url} alt={gal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent flex items-end p-6">
                    <h3 className="text-white font-bold text-base md:text-lg">{gal.title}</h3>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 text-zinc-400">
                <p className="text-lg font-semibold">Gallery images coming soon</p>
                <p className="text-sm mt-2">Upload images via the admin dashboard</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10. FAQs Accordion */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-150">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Answering Questions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-4"></div>
            <Link href="/faqs" className="text-primary font-bold text-sm hover:underline flex items-center justify-center gap-1">
              Search & View All FAQs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {faqs.slice(0, 4).map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div key={idx} className="border border-zinc-150 rounded-2xl bg-white overflow-hidden hover:border-primary/30 transition-colors">
                  <button 
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-navy hover:bg-zinc-50/50 cursor-pointer text-sm sm:text-base"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle size={18} className="text-primary" />
                      <span>{faq.question}</span>
                    </div>
                    <ChevronDown size={18} className={`text-zinc-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="p-6 border-t border-zinc-100 bg-zinc-50 text-zinc-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Contact CTA */}
      <section className="py-24 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy">Ready to Start Your Next PCB Project?</h2>
          <p className="text-zinc-500 text-xl mb-10 max-w-2xl mx-auto">
            Contact our engineering team to discuss your PCB assembly, SMT soldering, or design requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 text-lg shadow-xl shadow-primary/20 rounded-xl">
                Request Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary text-primary hover:bg-primary hover:text-white rounded-xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
