import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Award, Users, Cpu, Settings, Headphones,
  Smile, Truck, ShieldAlert, BadgeCheck, Activity
} from "lucide-react";
import { stats } from "@/data/content";
import { AnimatedCounter } from "@/components/animated-counter";

export default function WhyUs() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const advantages = [
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Quality Assurance",
      desc: "Every assembly is inspected per IPC-A-610 Class 2 and Class 3 standards with AOI and X-ray verification."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Experienced Engineers",
      desc: "Our design and assembly team possesses decades of combined experience in electronics manufacturing and PCB design."
    },
    {
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Advanced Equipment",
      desc: "YAMAHA pick-and-place machines, multi-zone reflow ovens, wave solderingand automated optical inspection systems."
    },
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: "Customized Solutions",
      desc: "From prototype single boards to high-volume production, we tailor our process to your exact BOM, specsand delivery schedule."
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary" />,
      title: "Reliable Support",
      desc: "We offer end-to-end support from DFM review and BOM sourcing to assembly, testing, firmware flashingand box-build."
    },
    {
      icon: <Smile className="w-8 h-8 text-primary" />,
      title: "Customer Satisfaction",
      desc: "Our client retention rate reflects our dedication to quality, on-time deliveryand transparent communication."
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "On-Time Delivery",
      desc: "Prototypes in 3–5 days, production in 2–4 weeks. Efficient scheduling and logistics ensure your projects stay on track."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-primary" />,
      title: "ESD & Safety Standards",
      desc: "Full ESD-safe facility with controlled access, anti-static workstationsand compliant packaging for sensitive components."
    },
    {
      icon: <BadgeCheck className="w-8 h-8 text-primary" />,
      title: "IPC-Certified Processes",
      desc: "IPC-A-610 compliant manufacturing workflow ensuring reproducibility, traceabilityand workmanship excellence."
    },
    {
      icon: <Activity className="w-8 h-8 text-primary" />,
      title: "Global Expertise",
      desc: "Serving clients in telecom, medical, automotive, IoTand defense sectors across multiple continents since 1995."
    }
  ];

  const timelineSteps = [
    { year: "1995", title: "Company Founded", desc: "S.B. Technologies established in Bangalore, starting with through-hole PCB assembly and basic electronics manufacturing." },
    { year: "2002", title: "SMT Line Expansion", desc: "Invested in first YAMAHA pick-and-place machine and reflow oven, expanding into surface mount technology assembly." },
    { year: "2008", title: "CAD/CAM Design Division", desc: "Launched in-house PCB design division with OrCAD, PCADand PADS, offering end-to-end design-to-assembly services." },
    { year: "2015", title: "Advanced Inspection Capability", desc: "Added AOI and X-ray inspection systems for BGA/QFN verification, achieving IPC-A-610 compliance across all assembly lines." },
    { year: "2024", title: "High-Volume & Global Reach", desc: "Expanded capacity with multiple SMT lines and wave soldering, serving OEM clients across 15+ countries worldwide." }
  ];

  return (
    <div className="w-full bg-white">
      {/* Page Header */}
      <section className="bg-zinc-950 py-24 border-b-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent z-10" />
          <div className="w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Why Us</h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Discover why leading companies trust S.B. TECHNOLOGIES to assemble their critical electronic products and PCB assemblies.
          </p>
        </div>
      </section>

      {/* Main Why Us Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Why Choose S.B. TECHNOLOGIES
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-zinc-600 text-lg leading-relaxed">
              We stand apart through our commitment to engineering excellence, design transparencyand uncompromising build quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {advantages.map((adv, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 5) * 0.1 }}
                className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col items-center text-center animate-fade-in"
              >
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <div className="group-hover:scale-110 transition-transform">
                    {adv.icon}
                  </div>
                </div>
                <h3 className="font-bold text-primary text-lg mb-3">{adv.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed flex-grow">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4">
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

      {/* Timeline Section */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Our Journey</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-zinc-600 text-lg">
              Tracing our history of technical development and capability growth since 1995.
            </p>
          </div>

          <div className="relative border-l-2 border-primary/20 max-w-4xl mx-auto pl-6 md:pl-10 space-y-12">
            {timelineSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-sm" />

                <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full mb-3">
                  {step.year}
                </span>
                <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-zinc-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Large CTA Section */}
      <section className="py-24 bg-white text-center relative overflow-hidden border-t border-zinc-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-navy">Ready to Work with Us?</h2>
          <p className="text-zinc-500 text-xl mb-10 max-w-2xl mx-auto">
            Contact our expert engineering team today to review your customized project requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 text-lg shadow-xl shadow-primary/20">
                Request Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary text-primary hover:bg-primary hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
