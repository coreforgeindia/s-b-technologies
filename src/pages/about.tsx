import { motion } from "framer-motion";
import { Shield, Cog, CheckCircle, Target, Factory, PenTool, Truck } from "lucide-react";
import { qualityStandards, keyStrengths, companyInfo } from "@/data/content";
import { useCompanyProfile } from "@/hooks/use-content";

export default function About() {
  const { profile } = useCompanyProfile();
  const established = profile?.established || companyInfo.established;
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="w-full bg-white">
      {/* Page Header */}
      <section className="bg-zinc-950 py-24 border-b-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent z-10" />
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl md:text-6xl font-bold text-white mb-6">About Us</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } } }} className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Established in {established}, S.B. Technologies is an IPC-A-610 compliant Electronics Manufacturing Services (EMS) provider known for precision assembly, dependable quality, and global service.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary inline-block"></span> Our Legacy
              </h2>
              <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed text-lg space-y-6">
                <p>
                  Since our inception in 1995, S.B. TECHNOLOGIES has grown to become a trusted name in Electronics Manufacturing Services. Based in Bangalore, we specialize in PCB manufacturing, automated reflow soldering, through-hole and SMD technology assembly, and PCB CAD/CAM design services.
                </p>
                <p>
                  With IPC-A-610 compliant processes and state-of-the-art equipment including JUKI pick-and-place machines, multi-zone reflow ovens, and wave soldering systems, we deliver consistent, high-quality assemblies. Our advanced AOI and X-ray inspection systems ensure zero-defect manufacturing.
                </p>
                <p>
                  Beyond assembly, our capabilities extend to PCB design (OrCAD, PCAD, PADS), prototype development, rework services, and embedded system development — allowing us to serve as a comprehensive EMS partner for clients across the globe.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 bg-zinc-50 p-8 md:p-12 rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100/50"
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-zinc-900">
                <Target className="text-primary w-8 h-8" /> Key Strengths
              </h3>
              <div className="space-y-8">
                {keyStrengths.map((strength, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="text-primary w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg mb-2">{strength.title}</h4>
                      <p className="text-zinc-600 leading-relaxed">{strength.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Manufacturing Excellence</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-zinc-600 text-lg">
              From solder paste printing to final inspection, our assembly pipeline is built for total reliability and zero-defect manufacturing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm"
            >
              <PenTool className="text-primary w-12 h-12 mb-6" />
              <h4 className="text-xl font-bold mb-3">DFM-First Design</h4>
              <p className="text-zinc-600">
                Our in-house PCB CAD/CAM team reviews every design for manufacturability before production, catching issues early and optimizing for yield.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm"
            >
              <Factory className="text-primary w-12 h-12 mb-6" />
              <h4 className="text-xl font-bold mb-3">Precision Assembly</h4>
              <p className="text-zinc-600">
                Automated pick-and-place with 0201 capability, multi-zone reflow, and wave soldering — all with in-line AOI and X-ray inspection.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm"
            >
              <Truck className="text-primary w-12 h-12 mb-6" />
              <h4 className="text-xl font-bold mb-3">Fast Turnaround</h4>
              <p className="text-zinc-600">
                Prototype assemblies in 3–5 days, production runs in 2–4 weeks. Our reputation is built on on-time delivery to clients worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="py-24 bg-zinc-950 text-white relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Uncompromising Quality Standards</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-8"></div>
            <p className="text-zinc-400 text-lg">
              Our assemblies are manufactured and inspected in strict accordance with IPC-A-610 Class 2 and Class 3 workmanship standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityStandards.map((std, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-primary/50 transition-colors group"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Cog size={28} />
                </div>
                <h4 className="text-xl font-bold mb-4">{std.title}</h4>
                <p className="text-zinc-400 leading-relaxed">
                  {std.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
