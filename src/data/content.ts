import { z } from "zod";
import smtAssemblyImage from "@/assets/products/power-distribution-transformer.png";
import pcbAssemblyImage from "@/assets/products/dry-type-transformer.png";
import reflowSolderingImage from "@/assets/products/booster-transformer.png";
import waveSolderingImage from "@/assets/products/isolation-transformer.png";
import bgaAssemblyImage from "@/assets/products/special-type-transformer.png";
import cadCamImage from "@/assets/products/spm-fabrication.png";

import solderPasteImg from "@/assets/construction/core-construction.png";
import pickPlaceImg from "@/assets/construction/tank-fabrication.png";
import reflowOvenImg from "@/assets/construction/terminations.png";
import inspectionImg from "@/assets/construction/insulation.png";
import aoiImg from "@/assets/construction/accessories.png";
import waveLineImg from "@/assets/construction/windings.png";

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

export const companyInfo = {
  name: "S.B. TECHNOLOGIES",
  tagline: "Implementing Technology",
  established: 1995,
  certifications: ["IPC-A-610 Compliant"],
  phones: ["+91 98457 79326", "+91 73537 75422"],
  whatsapp: "+91 73537 75422",
  email: "info@sbtechindia.com",
  website: "www.sbtechindia.com",
  address: "#4, 9th Main, J.C. Industrial Estate, Kanakapura Main Road, Bangalore – 560062, Karnataka, India",
};

export const products = [
  {
    id: "smt-assembly",
    title: "SMT Assembly",
    description: "High-precision Surface Mount Technology assembly with 0603 chip placement capability.",
    detail: "Our SMT Assembly line is built around industry-leading YAMAHA automated pick-and-place machines capable of placing components as small as 0603 packages with exceptional accuracy and speed. From prototype runs to high-volume production, our SMT process delivers consistent solder joint quality, minimal defects, and rapid turnaround. Every board passes through our rigorous in-line inspection systems before leaving the floor.",
    image: smtAssemblyImage,
    gallery: [
      { url: solderPasteImg, caption: "Solder Paste Printing" },
      { url: pickPlaceImg, caption: "Pick & Place Operation" },
      { url: aoiImg, caption: "AOI Inspection" }
    ],
    features: [
      "0603 chip placement",
      "YAMAHA automated machines",
      "High-speed production",
      "In-line AOI inspection"
    ]
  },
  {
    id: "pcb-assembly",
    title: "PCB Assembly (Through-Hole & SMD)",
    description: "Complete PCB assembly services covering both through-hole insertion and surface mount device (SMD) technology for single and multi-layer boards.",
    detail: "S.B. Technologies offers end-to-end PCB assembly for through-hole, SMD, and mixed-technology boards. Our assembly process includes automated solder paste application, precision component placement, and selective or wave soldering for through-hole parts. We handle single-sided, double-sided, and multi-layer boards with equal precision, delivering fully assembled and tested PCBAs ready for integration.",
    image: pcbAssemblyImage,
    gallery: [
      { url: waveLineImg, caption: "Wave Soldering Line" },
      { url: reflowOvenImg, caption: "Reflow Oven Profile" }
    ],
    features: ["Through-Hole & SMD", "Multi-layer PCBs", "Mixed technology", "Fully tested assemblies"]
  },
  {
    id: "reflow-soldering",
    title: "Reflow Soldering",
    description: "Automated reflow soldering with precisely controlled thermal profiles for reliable solder joints on surface mount assemblies.",
    detail: "Our reflow soldering process utilizes multi-zone convection ovens with tightly controlled thermal profiles to ensure consistent, defect-free solder joints across every board. We optimize profiles for lead-free (RoHS) and leaded processes, handling a wide range of component packages from fine-pitch QFPs to large BGAs. Real-time thermal monitoring and nitrogen atmosphere capability ensure the highest joint reliability.",
    image: reflowSolderingImage,
    gallery: [
      { url: pickPlaceImg, caption: "Pre-Reflow Placement" },
      { url: inspectionImg, caption: "Post-Reflow Inspection" }
    ],
    features: ["Multi-zone convection ovens", "Lead-free & leaded profiles", "Nitrogen atmosphere capable", "Real-time thermal monitoring"]
  },
  {
    id: "wave-soldering",
    title: "Wave Soldering",
    description: "Precision wave soldering for through-hole components with controlled flux application and preheating for optimal joint quality.",
    detail: "Our wave soldering systems provide reliable, high-throughput soldering for through-hole and mixed-technology assemblies. With controlled flux spray, multi-stage preheating, and adjustable wave parameters, we achieve consistent barrel fill and fillet formation. Selective pallets allow us to protect SMD components during the wave process, enabling efficient mixed-technology production.",
    image: waveSolderingImage,
    gallery: [
      { url: solderPasteImg, caption: "Flux Application" },
      { url: waveLineImg, caption: "Wave Solder Machine" }
    ],
    features: ["High-throughput soldering", "Selective pallet capability", "Controlled flux application", "Mixed-technology support"]
  },
  {
    id: "bga-assembly",
    title: "BGA / Micro BGA / QFP / QFN Assembly",
    description: "Specialized assembly for advanced packages including Ball Grid Array (BGA), Micro BGA, QFP, QFN, and DFN components.",
    detail: "S.B. Technologies has deep expertise in assembling challenging advanced packages such as BGA, Micro BGA, QFP, QFN, and DFN. Our precise solder paste deposition, optimized reflow profiles, and X-ray inspection capabilities ensure void-free solder joints and reliable electrical connections. We work with customers on first-article builds to validate every process parameter before production ramp.",
    image: bgaAssemblyImage,
    gallery: [
      { url: reflowOvenImg, caption: "BGA Reflow Process" },
      { url: aoiImg, caption: "X-Ray Inspection" }
    ],
    features: ["BGA & Micro BGA", "QFP / QFN / DFN", "X-ray inspection", "First-article validation"]
  },
  {
    id: "pcb-cad-cam",
    title: "PCB CAD & CAM Design",
    description: "Professional PCB layout design and CAM services using OrCAD, PCAD, and PADS for schematic capture through to manufacturing output.",
    detail: "Our experienced PCB design team provides end-to-end CAD/CAM services from schematic capture to manufacturing-ready Gerber output. Using industry-standard tools including OrCAD, PCAD, and PADS, we deliver optimized layouts for signal integrity, thermal management, and manufacturability (DFM). Whether you need a simple 2-layer board or a complex multi-layer HDI design, our team ensures your PCB is production-ready.",
    image: cadCamImage,
    gallery: [
      { url: pickPlaceImg, caption: "Design to Assembly" },
      { url: inspectionImg, caption: "DFM Analysis" }
    ],
    features: ["OrCAD, PCAD, PADS", "Schematic to Gerber", "DFM analysis", "Multi-layer HDI capable"]
  }
];

export const galleryItems = [
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

export const keyStrengths = [
  {
    title: "IPC-Certified Processes",
    description: "All assembly processes comply with IPC-A-610 workmanship standards for electronics assemblies."
  },
  {
    title: "Global Client Base",
    description: "Serving clients across the globe with consistent quality and on-time delivery since 1995."
  },
  {
    title: "Advanced Equipment",
    description: "State-of-the-art PHILIPS pick-and-place, multi-zone reflow ovens, and DEK Printing systems."
  },
  {
    title: "Design-for-Manufacturing",
    description: "In-house PCB CAD/CAM team provides DFM review and layout optimization before production begins."
  }
];

export const qualityStandards = [
  {
    title: "IPC-A-610 Compliance",
    description: "All assemblies inspected per IPC-A-610 Class 2 and Class 3 acceptability standards."
  },
  {
    title: "Solder Paste & Flux",
    description: "RoHS-compliant lead-free and leaded solder pastes from qualified suppliers, with controlled storage and application."
  },
  {
    title: "Component Handling",
    description: "Moisture-sensitive device (MSD) management per IPC/JEDEC J-STD-033, with baking and dry-pack storage protocols."
  },
  {
    title: "Inspection Systems",
    description: "Digital & Optical Inspection systems with High Skill work force ensures Final and Pre delivery inspection trouble free."
  },
  {
    title: "Process Control",
    description: "Statistical Process Control (SPC) on solder paste volume, reflow profiles, and wave solder parameters for zero-defect manufacturing."
  }
];

export const tests = [
  "In-Circuit Test (ICT)",
  "Flying Probe Test",
  "Functional Testing (FCT)",
  "Automated Optical Inspection (AOI)"
];

export const accessories = [
  "Solder Paste Stencils (laser-cut)",
  "Custom Reflow Profiles",
  "Selective Soldering Pallets",
  "Anti-Static Packaging (ESD-safe)",
  "Conformal Coating Application",
  "Wire Harness Integration",
  "Box-Build & Enclosure Assembly",
  "Programming & Firmware Flashing",
  "Labeling & Serialization",
  "Full Traceability Documentation",
  "Incoming Component Inspection"
];

export const testimonials = [
  {
    id: 1,
    quote: "S.B. Technologies has been our go-to EMS partner for over a decade. Their SMT assembly quality and turnaround times are consistently excellent.",
    author: "R&D Director",
    company: "Industrial Electronics Firm"
  },
  {
    id: 2,
    quote: "The PCB CAD/CAM design team at SBT caught critical DFM issues before production, saving us significant time and cost. Outstanding technical competence.",
    author: "Product Engineering Manager",
    company: "Telecom Equipment Manufacturer"
  }
];

export const industries = [
  { id: "telecom", name: "Telecommunications", icon: "Radio", description: "High-reliability PCB assemblies for telecom infrastructure, base stations, and networking equipment." },
  { id: "industrial-controls", name: "Industrial Controls", icon: "Settings2", description: "Ruggedized electronics assemblies for PLCs, drives, sensors, and factory automation systems." },
  { id: "medical-devices", name: "Medical Devices", icon: "HeartPulse", description: "IPC Class 3 assemblies for patient monitors, diagnostic instruments, and medical imaging electronics." },
  { id: "automotive", name: "Automotive", icon: "Car", description: "Automotive-grade PCB assemblies for ECUs, infotainment, ADAS, and EV charging systems." },
  { id: "consumer-electronics", name: "Consumer Electronics", icon: "Smartphone", description: "High-volume SMT assembly for IoT devices, wearables, smart home products, and consumer gadgets." },
  { id: "aerospace-defense", name: "Aerospace & Defense", icon: "Shield", description: "Mission-critical assemblies with full traceability for avionics, satellite, and defense electronics." },
  { id: "power-electronics", name: "Power Electronics", icon: "Zap", description: "Heavy-copper PCB assemblies for power converters, inverters, UPS systems, and motor drives." },
  { id: "iot-embedded", name: "IoT & Embedded Systems", icon: "Cpu", description: "Compact, multi-layer PCB assemblies for embedded controllers, edge computing, and IoT gateways." },
  { id: "led-lighting", name: "LED & Lighting", icon: "Lightbulb", description: "Metal-core and FR4 PCB assemblies for LED drivers, smart lighting, and high-power illumination modules." },
  { id: "renewable-energy", name: "Renewable Energy", icon: "Wind", description: "PCB assemblies for solar inverters, charge controllers, battery management systems, and wind turbine electronics." }
];

export const stats = [
  { value: 29, suffix: "+", label: "Years Experience" },
  { value: 1000, suffix: "+", label: "Projects Delivered" },
  { value: 200, suffix: "+", label: "Global Clients" },
  { value: 15, suffix: "+", label: "Countries Served" },
  { value: 10, suffix: "+", label: "Industries Served" }
];

export const projects = [
  { id: "p1", name: "Telecom Base Station Controller", location: "Bangalore, Karnataka", industry: "Telecommunications", description: "Complete PCB assembly of multi-layer controller boards for 4G/5G base stations, including BGA placement, reflow soldering, ICT, and conformal coating.", technologies: ["SMT Assembly", "BGA Placement", "Conformal Coating"] },
  { id: "p2", name: "Industrial PLC Module Assembly", location: "Chennai, Tamil Nadu", industry: "Industrial Controls", description: "Through-hole and SMD mixed-technology assembly of PLC I/O modules for a leading automation equipment manufacturer, with full functional testing.", technologies: ["Mixed Technology", "Wave Soldering", "Functional Testing"] },
  { id: "p3", name: "Patient Monitor Electronics", location: "Pune, Maharashtra", industry: "Medical Devices", description: "IPC Class 3 assembly of patient vital-sign monitor PCBAs with fine-pitch QFP and BGA components, including X-ray inspection and full traceability.", technologies: ["IPC Class 3", "QFP/BGA Assembly", "X-Ray Inspection"] },
  { id: "p4", name: "Automotive ECU Prototype", location: "Bangalore, Karnataka", industry: "Automotive", description: "Rapid prototyping and first-article assembly of automotive ECU boards with high-speed signal routing, thermal management, and automotive-grade components.", technologies: ["Prototype Assembly", "DFM Review", "Automotive Grade"] },
  { id: "p5", name: "IoT Gateway Board Production", location: "Hyderabad, Telangana", industry: "IoT & Embedded Systems", description: "High-volume SMT assembly of compact 6-layer IoT gateway boards with WiFi/BLE modules, micro-BGA, and firmware programming.", technologies: ["High-Volume SMT", "Micro BGA", "Firmware Flashing"] },
  { id: "p6", name: "Solar Inverter Power Board", location: "Bangalore, Karnataka", industry: "Renewable Energy", description: "Heavy-copper PCB assembly of 3-phase solar inverter power stages with high-current SMD MOSFETs, gate drivers, and thermal interface materials.", technologies: ["Heavy-Copper PCB", "Power Electronics", "Selective Soldering"] }
];

export const faqs = [
  { category: "Services", question: "What SMT component sizes can you handle?", answer: "Our YAMAHA pick-and-place machines can place components as small as 0603 packages, and we routinely handle 0805 and larger passives, as well as fine-pitch ICs down to 0.4mm pitch." },
  { category: "Services", question: "Do you handle both through-hole and SMD assembly?", answer: "Yes. We offer complete through-hole, SMD, and mixed-technology PCB assembly. Our wave soldering and selective soldering capabilities handle through-hole components, while our SMT line handles surface mount devices." },
  { category: "Services", question: "What PCB design tools do you support?", answer: "Our in-house CAD/CAM team works with OrCAD, PCAD, PADS, and Altium Designer. We accept design files in all standard formats including ODB++, Gerber RS-274X, and IPC-2581." },
  { category: "Quality", question: "What quality standards do you follow?", answer: "All our assemblies are manufactured and inspected per IPC-A-610 Class 2 and Class 3 standards. We employ AOI, X-ray, ICT, and functional testing to ensure zero-defect delivery." },
  { category: "Quality", question: "Do you offer RoHS/lead-free assembly?", answer: "Yes. We are fully RoHS compliant and offer both lead-free (SAC305) and leaded assembly processes. Our reflow and wave soldering equipment supports both chemistries with dedicated profiles." },
  { category: "Quality", question: "How do you handle moisture-sensitive components?", answer: "We follow IPC/JEDEC J-STD-033 for MSD management. Components are stored in nitrogen dry cabinets, and we maintain baking ovens for moisture removal prior to reflow." },
  { category: "Capabilities", question: "Can you assemble BGA and Micro BGA packages?", answer: "Yes. We have extensive experience with BGA, Micro BGA, QFP, QFN, and DFN packages. Our X-ray inspection system verifies solder joint integrity beneath BGA components." },
  { category: "Capabilities", question: "Do you support prototype and low-volume runs?", answer: "Absolutely. We offer rapid-turn prototype assembly with typical turnaround of 3–5 working days. We also handle medium and high-volume production with dedicated SMT lines." },
  { category: "Ordering", question: "What is your typical lead time?", answer: "Prototype orders typically ship in 3–5 working days. Production orders depend on volume and component availability, typically 2–4 weeks. Contact us for a precise timeline based on your BOM and quantities." },
  { category: "Ordering", question: "How do I request a quotation?", answer: "Send us your Gerber files, BOM (Bill of Materials), and assembly drawings via the Contact page or email us at info@sbtechindia.com. Include quantity, any special requirements, and desired delivery date." }
];

export const resources = [
  { id: "company-profile", title: "Company Profile", description: "Full company overview including capabilities, equipment list, certifications, and key contact details for S.B. Technologies.", type: "Company Profile", fileSize: "2.1 MB" },
  { id: "capability-brochure", title: "Capabilities Brochure", description: "Detailed brochure covering our SMT assembly, PCB assembly, soldering, and CAD/CAM design service offerings.", type: "Brochure", fileSize: "3.8 MB" },
  { id: "equipment-list", title: "Equipment & Machine List", description: "Complete listing of our YAMAHA pick-and-place machines, reflow ovens, wave soldering systems, AOI, and X-ray inspection equipment.", type: "Technical Datasheet", fileSize: "1.4 MB" },
  { id: "ipc-compliance", title: "IPC-A-610 Compliance Statement", description: "Our compliance statement and workmanship standards documentation for IPC-A-610 Class 2 and Class 3 assemblies.", type: "Certificate", fileSize: "0.5 MB" },
  { id: "dfm-guidelines", title: "DFM Design Guidelines", description: "Design-for-Manufacturing guidelines for PCB designers to optimize their layouts for our SMT and through-hole assembly processes.", type: "Technical Datasheet", fileSize: "2.3 MB" },
  { id: "rohs-declaration", title: "RoHS Compliance Declaration", description: "Our RoHS compliance declaration and lead-free process capability documentation for environmental compliance.", type: "Certificate", fileSize: "0.3 MB" }
];
