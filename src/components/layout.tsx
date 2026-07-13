import { Link, useLocation } from "wouter";
import { companyInfo } from "@/data/content";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Menu, X, Home, Building2, Package, Images, MapPin, Phone, Mail, 
  ShieldCheck, Briefcase, FileText, HelpCircle, PhoneCall, Factory, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import logoUrl from "@/assets/logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: <Home size={14} className="mr-1" /> },
    { label: "About Us", href: "/about", icon: <Building2 size={14} className="mr-1" /> },
    { label: "Why Us", href: "/why-us", icon: <ShieldCheck size={14} className="mr-1" /> },
    { label: "Products & Services", href: "/products", icon: <Package size={14} className="mr-1" /> },
    { label: "Gallery", href: "/gallery", icon: <Images size={14} className="mr-1" /> },
    { label: "FAQs", href: "/faqs", icon: <HelpCircle size={14} className="mr-1" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 font-sans">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2 border-b border-zinc-100" : "bg-white py-4"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={logoUrl} alt={companyInfo.name} className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm md:text-base leading-tight tracking-tight text-navy uppercase">
                S.B. TECHNOLOGIES
              </span>
              <span className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none">
                ELECTRONICS MANUFACTURING SERVICES
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center text-[13px] font-bold transition-all relative py-1.5 ${
                    isActive 
                      ? "text-primary font-extrabold" 
                      : "text-zinc-600 hover:text-primary"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                    />
                  )}
                </Link>
              );
            })}
            <Link href="/contact" className="ml-2">
              <Button className="bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 rounded-xl px-4 py-2 flex items-center gap-1">
                Contact Us <ArrowRight size={12} />
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden text-foreground p-2 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-white border-t border-zinc-100 shadow-xl py-4 px-4 flex flex-col gap-1 max-h-[85vh] overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center text-sm font-bold py-3.5 px-4 rounded-xl border border-transparent transition-all ${
                    isActive 
                      ? "bg-primary/5 border-primary/10 text-primary" 
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span className="mr-3 text-zinc-500 group-hover:text-primary">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="mt-4 px-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-1.5">
                Contact Us <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 pt-[72px] xl:pt-[80px]">{children}</main>

      <footer className="bg-zinc-950 text-white py-20 border-t-[6px] border-primary">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 bg-white p-4 rounded-2xl w-max shadow-md">
              <img src={logoUrl} alt={companyInfo.name} className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm leading-tight tracking-tight text-zinc-900">
                  S.B. TECHNOLOGIES
                </span>
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none">
                  ELECTRONICS MANUFACTURING SERVICES
                </span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              A Bangalore-based Electronics Manufacturing Services (EMS) provider offering PCB assembly, automated SMT soldering, through-hole assembly, and PCB CAD/CAM design to clients across the globe.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-extrabold mb-6 text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-zinc-400 text-sm font-semibold">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center"><Home size={12} className="mr-1.5"/> Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors flex items-center"><Building2 size={12} className="mr-1.5"/> About Us</Link></li>
              <li><Link href="/why-us" className="hover:text-primary transition-colors flex items-center"><ShieldCheck size={12} className="mr-1.5"/> Why Us</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors flex items-center"><Package size={12} className="mr-1.5"/> Products</Link></li>
              <li><Link href="/industries" className="hover:text-primary transition-colors flex items-center"><Factory size={12} className="mr-1.5"/> Industries</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors flex items-center"><Briefcase size={12} className="mr-1.5"/> Projects</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors flex items-center"><Images size={12} className="mr-1.5"/> Gallery</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors flex items-center"><FileText size={12} className="mr-1.5"/> Resources</Link></li>
              <li><Link href="/faqs" className="hover:text-primary transition-colors flex items-center"><HelpCircle size={12} className="mr-1.5"/> FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center"><PhoneCall size={12} className="mr-1.5"/> Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold mb-6 text-white uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-zinc-400 text-sm font-semibold">
              <li className="flex gap-3">
                <MapPin className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <span className="leading-relaxed">{companyInfo.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <span className="flex flex-col gap-0.5">
                  {companyInfo.phones.map(p => <span key={p}>{p}</span>)}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-primary mt-0.5 flex-shrink-0" size={16} />
                <span>{companyInfo.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold mb-6 text-white uppercase tracking-wider">Certifications</h4>
            <div className="flex flex-wrap gap-2.5">
              {companyInfo.certifications.map(cert => (
                <div key={cert} className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300">
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-zinc-900 text-center text-zinc-500 text-xs font-bold uppercase tracking-wider">
          &copy; {new Date().getFullYear()} S.B. TECHNOLOGIES. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
