import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import * as Icons from "lucide-react";

export default function Industries() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const industriesData = [
    {
      id: "telecom",
      name: "Telecommunications",
      icon: "Radio",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
      description: "High-reliability PCB assemblies for telecom infrastructure, base station controllers, networking equipment, and 5G communication modules."
    },
    {
      id: "industrial-controls",
      name: "Industrial Controls",
      icon: "Settings2",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80",
      description: "Ruggedized PCB assemblies for PLCs, motor drives, sensors, HMI panels, and factory automation control systems."
    },
    {
      id: "medical-devices",
      name: "Medical Devices",
      icon: "HeartPulse",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      description: "IPC Class 3 assemblies for patient monitors, diagnostic instruments, imaging electronics, and wearable health devices."
    },
    {
      id: "automotive",
      name: "Automotive",
      icon: "Car",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
      description: "Automotive-grade PCB assemblies for ECUs, infotainment systems, ADAS modules, EV charging electronics, and dashboard controllers."
    },
    {
      id: "consumer-electronics",
      name: "Consumer Electronics",
      icon: "Smartphone",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      description: "High-volume SMT assembly for IoT devices, wearables, smart home products, audio equipment, and consumer gadgets."
    },
    {
      id: "aerospace-defense",
      name: "Aerospace & Defense",
      icon: "Shield",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80",
      description: "Mission-critical PCB assemblies with full traceability and conformal coating for avionics, satellite, and defense electronics."
    },
    {
      id: "power-electronics",
      name: "Power Electronics",
      icon: "Zap",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&auto=format&fit=crop&q=80",
      description: "Heavy-copper PCB assemblies for power converters, inverters, UPS systems, motor drives, and battery management systems."
    },
    {
      id: "iot-embedded",
      name: "IoT & Embedded",
      icon: "Cpu",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      description: "Compact, multi-layer PCB assemblies for embedded controllers, edge computing, wireless modules, and IoT gateway devices."
    },
    {
      id: "led-lighting",
      name: "LED & Lighting",
      icon: "Lightbulb",
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=800&auto=format&fit=crop&q=80",
      description: "Metal-core and FR4 PCB assemblies for LED drivers, smart lighting controls, high-power illumination, and display modules."
    },
    {
      id: "renewable-energy",
      name: "Renewable Energy",
      icon: "Wind",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80",
      description: "PCB assemblies for solar inverters, charge controllers, battery management systems, and wind turbine monitoring electronics."
    }
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Industries We Serve</h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Delivering precision PCB assemblies and electronics manufacturing services for critical sectors worldwide.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Industrial Applications</h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6"></div>
            <p className="text-zinc-600 text-lg">
              From telecom infrastructure to medical devices, we assemble precision electronics that deliver reliability and performance across every application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {industriesData.map((ind, idx) => {
              // Dynamically resolve icon from Lucide React
              // @ts-ignore
              const IconComponent = Icons[ind.icon] || Icons.HelpCircle;
              
              return (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={ind.image} 
                      alt={ind.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                        <IconComponent size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{ind.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                      {ind.description}
                    </p>
                    <Link href="/contact">
                      <span className="text-primary font-semibold text-sm hover:underline cursor-pointer flex items-center gap-1.5">
                        Consult with an Engineer <Icons.ArrowRight size={14} />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industrial Quote CTA */}
      <section className="py-24 bg-zinc-50 border-t border-zinc-100 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-navy">Need a Specialized Electronics Assembly?</h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-2xl mx-auto">
            Our experienced engineers specialize in customizing PCB assemblies, SMT processes, and embedded systems to fit your exact specifications and industry standards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 text-lg shadow-xl shadow-primary/20">
                Request Custom Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-primary text-primary hover:bg-primary hover:text-white">
                Contact Technical Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
