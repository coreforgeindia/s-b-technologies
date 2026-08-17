-- ============================================================
-- S.B. Technologies - Complete Master Database Setup
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  applications TEXT[] NOT NULL DEFAULT '{}',
  gallery JSONB NOT NULL DEFAULT '[]',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  industries TEXT[] NOT NULL DEFAULT '{}',
  icon TEXT NOT NULL DEFAULT 'Settings',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Products',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Company profile (single-row table)
CREATE TABLE IF NOT EXISTS company_profile (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL DEFAULT 'S.B. TECHNOLOGIES',
  tagline TEXT NOT NULL DEFAULT 'Implementing Technology',
  established INT NOT NULL DEFAULT 1995,
  certifications TEXT[] NOT NULL DEFAULT '{}',
  phones TEXT[] NOT NULL DEFAULT '{}',
  email TEXT NOT NULL DEFAULT '',
  website TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  map_link TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Enable Row Level Security (RLS) & Define Policies
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read gallery" ON gallery_items;
CREATE POLICY "Public read gallery" ON gallery_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read profile" ON company_profile;
CREATE POLICY "Public read profile" ON company_profile FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

-- Authenticated users (admin) full write access
DROP POLICY IF EXISTS "Admin insert products" ON products;
CREATE POLICY "Admin insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admin update products" ON products;
CREATE POLICY "Admin update products" ON products FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin delete products" ON products;
CREATE POLICY "Admin delete products" ON products FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin insert services" ON services;
CREATE POLICY "Admin insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admin update services" ON services;
CREATE POLICY "Admin update services" ON services FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin delete services" ON services;
CREATE POLICY "Admin delete services" ON services FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin insert gallery" ON gallery_items;
CREATE POLICY "Admin insert gallery" ON gallery_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admin update gallery" ON gallery_items;
CREATE POLICY "Admin update gallery" ON gallery_items FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin delete gallery" ON gallery_items;
CREATE POLICY "Admin delete gallery" ON gallery_items FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin update profile" ON company_profile;
CREATE POLICY "Admin update profile" ON company_profile FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin insert profile" ON company_profile;
CREATE POLICY "Admin insert profile" ON company_profile FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin insert logs" ON activity_logs;
CREATE POLICY "Admin insert logs" ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read logs" ON activity_logs;
CREATE POLICY "Admin read logs" ON activity_logs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin insert projects" ON projects;
CREATE POLICY "Admin insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admin update projects" ON projects;
CREATE POLICY "Admin update projects" ON projects FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin delete projects" ON projects;
CREATE POLICY "Admin delete projects" ON projects FOR DELETE TO authenticated USING (true);

-- Anon access for direct-login admin
DROP POLICY IF EXISTS "Anon insert products" ON products;
CREATE POLICY "Anon insert products" ON products FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon update products" ON products;
CREATE POLICY "Anon update products" ON products FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Anon delete products" ON products;
CREATE POLICY "Anon delete products" ON products FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Anon insert services" ON services;
CREATE POLICY "Anon insert services" ON services FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon update services" ON services;
CREATE POLICY "Anon update services" ON services FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Anon delete services" ON services;
CREATE POLICY "Anon delete services" ON services FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Anon insert gallery" ON gallery_items;
CREATE POLICY "Anon insert gallery" ON gallery_items FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon update gallery" ON gallery_items;
CREATE POLICY "Anon update gallery" ON gallery_items FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Anon delete gallery" ON gallery_items;
CREATE POLICY "Anon delete gallery" ON gallery_items FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "Anon update profile" ON company_profile;
CREATE POLICY "Anon update profile" ON company_profile FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Anon insert profile" ON company_profile;
CREATE POLICY "Anon insert profile" ON company_profile FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert logs" ON activity_logs;
CREATE POLICY "Anon insert logs" ON activity_logs FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon read logs" ON activity_logs;
CREATE POLICY "Anon read logs" ON activity_logs FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon insert projects" ON projects;
CREATE POLICY "Anon insert projects" ON projects FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon update projects" ON projects;
CREATE POLICY "Anon update projects" ON projects FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Anon delete projects" ON projects;
CREATE POLICY "Anon delete projects" ON projects FOR DELETE TO anon USING (true);

-- ============================================================
-- Storage Buckets & Policies
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Public read gallery images" ON storage.objects;
CREATE POLICY "Public read gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
CREATE POLICY "Public read project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Auth upload product images" ON storage.objects;
CREATE POLICY "Auth upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Auth update product images" ON storage.objects;
CREATE POLICY "Auth update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Auth delete product images" ON storage.objects;
CREATE POLICY "Auth delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Auth upload gallery images" ON storage.objects;
CREATE POLICY "Auth upload gallery images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery-images');
DROP POLICY IF EXISTS "Auth update gallery images" ON storage.objects;
CREATE POLICY "Auth update gallery images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery-images');
DROP POLICY IF EXISTS "Auth delete gallery images" ON storage.objects;
CREATE POLICY "Auth delete gallery images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery-images');

DROP POLICY IF EXISTS "Auth upload project images" ON storage.objects;
CREATE POLICY "Auth upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Auth update project images" ON storage.objects;
CREATE POLICY "Auth update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Auth delete project images" ON storage.objects;
CREATE POLICY "Auth delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Anon upload product images" ON storage.objects;
CREATE POLICY "Anon upload product images" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Anon upload gallery images" ON storage.objects;
CREATE POLICY "Anon upload gallery images" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'gallery-images');
DROP POLICY IF EXISTS "Anon upload project images" ON storage.objects;
CREATE POLICY "Anon upload project images" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Anon update product images" ON storage.objects;
CREATE POLICY "Anon update product images" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Anon update gallery images" ON storage.objects;
CREATE POLICY "Anon update gallery images" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'gallery-images');
DROP POLICY IF EXISTS "Anon update project images" ON storage.objects;
CREATE POLICY "Anon update project images" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Anon delete product images" ON storage.objects;
CREATE POLICY "Anon delete product images" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Anon delete gallery images" ON storage.objects;
CREATE POLICY "Anon delete gallery images" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'gallery-images');
DROP POLICY IF EXISTS "Anon delete project images" ON storage.objects;
CREATE POLICY "Anon delete project images" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'project-images');

-- ============================================================
-- Triggers for updated_at
-- ============================================================
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON gallery_items;
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profile_updated_at ON company_profile;
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON company_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Seed Data - Products
-- ============================================================
INSERT INTO products (id, title, description, detail, image_url, features, applications, gallery, sort_order) VALUES
(
  'smt-assembly',
  'SMT Assembly',
  'High-precision Surface Mount Technology assembly with 0603 chip placement capability using advanced JUKI pick-and-place machines.',
  'Our SMT Assembly line is built around industry-leading JUKI automated pick-and-place machines capable of placing components as small as 0201 and 0402 packages with exceptional accuracy and speed. From prototype runs to high-volume production, our SMT process delivers consistent solder joint quality, minimal defects, and rapid turnaround. Every board passes through our rigorous in-line inspection systems before leaving the floor.',
  '',
  ARRAY['0201/0402 chip placement', 'JUKI automated machines', 'High-speed production', 'In-line AOI inspection'],
  ARRAY['Telecom Infrastructure', 'Consumer Electronics', 'IoT Devices', 'Automotive ECUs'],
  '[{"url":"","caption":"Solder Paste Printing"},{"url":"","caption":"Pick & Place Operation"},{"url":"","caption":"AOI Inspection"}]'::jsonb,
  1
),
(
  'pcb-assembly',
  'PCB Assembly (Through-Hole & SMD)',
  'Complete PCB assembly services covering both through-hole insertion and surface mount device (SMD) technology for single and multi-layer boards.',
  'S.B. Technologies offers end-to-end PCB assembly for through-hole, SMD, and mixed-technology boards. Our assembly process includes automated solder paste application, precision component placement, and selective or wave soldering for through-hole parts. We handle single-sided, double-sided, and multi-layer boards with equal precision, delivering fully assembled and tested PCBAs ready for integration.',
  '',
  ARRAY['Through-Hole & SMD', 'Multi-layer PCBs', 'Mixed technology', 'Fully tested assemblies'],
  ARRAY['Industrial Controllers', 'Medical Devices', 'Power Electronics', 'LED Lighting'],
  '[{"url":"","caption":"Wave Soldering Line"},{"url":"","caption":"Reflow Oven Profile"}]'::jsonb,
  2
),
(
  'reflow-soldering',
  'Reflow Soldering',
  'Automated reflow soldering with precisely controlled thermal profiles for reliable solder joints on surface mount assemblies.',
  'Our reflow soldering process utilizes multi-zone convection ovens with tightly controlled thermal profiles to ensure consistent, defect-free solder joints across every board. We optimize profiles for lead-free (RoHS) and leaded processes, handling a wide range of component packages from fine-pitch QFPs to large BGAs. Real-time thermal monitoring and nitrogen atmosphere capability ensure the highest joint reliability.',
  '',
  ARRAY['Multi-zone convection ovens', 'Lead-free & leaded profiles', 'Nitrogen atmosphere capable', 'Real-time thermal monitoring'],
  ARRAY['BGA/QFN Boards', 'Multi-layer PCBs', 'Fine-Pitch Assemblies', 'RoHS Compliance'],
  '[{"url":"","caption":"Pre-Reflow Placement"},{"url":"","caption":"Post-Reflow Inspection"}]'::jsonb,
  3
),
(
  'wave-soldering',
  'Wave Soldering',
  'Precision wave soldering for through-hole components with controlled flux application and preheating for optimal joint quality.',
  'Our wave soldering systems provide reliable, high-throughput soldering for through-hole and mixed-technology assemblies. With controlled flux spray, multi-stage preheating, and adjustable wave parameters, we achieve consistent barrel fill and fillet formation. Selective pallets allow us to protect SMD components during the wave process, enabling efficient mixed-technology production.',
  '',
  ARRAY['High-throughput soldering', 'Selective pallet capability', 'Controlled flux application', 'Mixed-technology support'],
  ARRAY['Through-Hole Boards', 'Mixed-Technology PCBs', 'Power Supply Modules', 'Connector-Heavy Assemblies'],
  '[{"url":"","caption":"Flux Application"},{"url":"","caption":"Wave Solder Machine"}]'::jsonb,
  4
),
(
  'bga-assembly',
  'BGA / Micro BGA / QFP / QFN Assembly',
  'Specialized assembly for advanced packages including Ball Grid Array (BGA), Micro BGA, QFP, QFN, and DFN components.',
  'S.B. Technologies has deep expertise in assembling challenging advanced packages such as BGA, Micro BGA, QFP, QFN, and DFN. Our precise solder paste deposition, optimized reflow profiles, and X-ray inspection capabilities ensure void-free solder joints and reliable electrical connections. We work with customers on first-article builds to validate every process parameter before production ramp.',
  '',
  ARRAY['BGA & Micro BGA', 'QFP / QFN / DFN', 'X-ray inspection', 'First-article validation'],
  ARRAY['FPGA/SoC Boards', 'High-Speed Digital', 'RF/Wireless Modules', 'Server/Networking'],
  '[{"url":"","caption":"BGA Reflow Process"},{"url":"","caption":"X-Ray Inspection"}]'::jsonb,
  5
),
(
  'pcb-cad-cam',
  'PCB CAD & CAM Design',
  'Professional PCB layout design and CAM services using OrCAD, PCAD, and PADS for schematic capture through to manufacturing output.',
  'Our experienced PCB design team provides end-to-end CAD/CAM services from schematic capture to manufacturing-ready Gerber output. Using industry-standard tools including OrCAD, PCAD, and PADS, we deliver optimized layouts for signal integrity, thermal management, and manufacturability (DFM). Whether you need a simple 2-layer board or a complex multi-layer HDI design, our team ensures your PCB is production-ready.',
  '',
  ARRAY['OrCAD, PCAD, PADS', 'Schematic to Gerber', 'DFM analysis', 'Multi-layer HDI capable'],
  ARRAY['Schematic Capture', 'Multi-Layer Layout', 'HDI Design', 'DFM Analysis'],
  '[{"url":"","caption":"Design to Assembly"},{"url":"","caption":"DFM Analysis"}]'::jsonb,
  6
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed Data - Services
-- ============================================================
INSERT INTO services (id, title, description, benefits, industries, icon, sort_order) VALUES
(
  'rework-prototype',
  'Rework & Prototype Development',
  'Rapid-turn prototype assembly with 3–5 day turnaround for first-article boards. Our skilled rework technicians handle BGA reballing, component replacement, and modification work for engineering validation and small-batch production.',
  ARRAY['3–5 day prototype turns', 'BGA reballing & rework', 'Engineering validation', 'Small-batch production'],
  ARRAY['R&D Labs', 'Startups', 'OEMs'],
  'Settings',
  1
),
(
  'embedded-system',
  'Embedded System Development',
  'End-to-end embedded system development from schematic design through PCB layout, assembly, firmware development, and system integration. We support ARM, PIC, AVR, and FPGA-based designs for IoT, industrial, and consumer applications.',
  ARRAY['Full-stack embedded design', 'Firmware development', 'System integration', 'Multi-platform support'],
  ARRAY['IoT', 'Industrial Automation', 'Consumer Electronics'],
  'Factory',
  2
),
(
  'pick-place',
  'Automated Pick & Place',
  'High-speed automated component placement using JUKI pick-and-place machines capable of handling 0201 to large QFP packages. Our flexible SMT lines support both high-mix/low-volume and high-volume production with quick changeover.',
  ARRAY['0201 to large QFP range', 'High-speed placement', 'Quick changeover', 'Flexible production volumes'],
  ARRAY['Telecom', 'Automotive', 'Medical'],
  'Layers',
  3
),
(
  'turnkey-ems',
  'Turnkey EMS & Box-Build',
  'Complete turnkey electronics manufacturing from BOM sourcing and component procurement through assembly, testing, conformal coating, and final box-build integration. We manage the entire supply chain so you can focus on your product.',
  ARRAY['BOM sourcing & procurement', 'Full supply chain management', 'Conformal coating', 'Box-build assembly'],
  ARRAY['OEMs', 'System Integrators', 'Product Companies'],
  'Wrench',
  4
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed Data - Gallery Items
-- ============================================================
INSERT INTO gallery_items (id, title, category, image_url, sort_order) VALUES
('g1', 'SMT Assembly Line', 'Products', '', 1),
('g2', 'PCB Assembly Station', 'Products', '', 2),
('g3', 'Multi-Layer PCB Board', 'Products', '', 3),
('g4', 'Reflow Soldering Oven', 'Products', '', 4),
('g5', 'Wave Soldering System', 'Products', '', 5),
('g6', 'BGA / QFP Assembly', 'Products', '', 6),
('g7', 'PCB CAD Design', 'Manufacturing', '', 7),
('g8', 'Product Range Overview', 'Products', '', 8),
('g9', 'Solder Paste Printing', 'Manufacturing', '', 9),
('g10', 'Pick & Place Operation', 'Manufacturing', '', 10),
('g11', 'Reflow Profile Setup', 'Manufacturing', '', 11),
('g12', 'AOI Inspection', 'Manufacturing', '', 12),
('g13', 'X-Ray Inspection', 'Manufacturing', '', 13),
('g14', 'Component Storage & Handling', 'Manufacturing', '', 14)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed Data - Company Profile
-- ============================================================
INSERT INTO company_profile (id, name, tagline, established, certifications, phones, email, website, address, map_link) VALUES
(
  'main',
  'S.B. TECHNOLOGIES',
  'Implementing Technology',
  1995,
  ARRAY['IPC-A-610 Compliant'],
  ARRAY['+91 98457 79326', '+91 73537 75422'],
  'info@sbtechindia.com',
  'www.sbtechindia.com',
  '#4, 9th Main, J.C. Industrial Estate, Kanakapura Main Road, Bangalore – 560062, Karnataka, India',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6!2d77.56!3d12.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzEyLjAiTiA3N8KwMzMnMzYuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Seed Data - Projects
-- ============================================================
INSERT INTO projects (id, name, description, location, industry, technologies, image_url, sort_order) VALUES
('p1', 'Telecom Base Station Controller', 'Complete PCB assembly of multi-layer controller boards for 4G/5G base stations, including BGA placement, reflow soldering, ICT, and conformal coating.', 'Bangalore, Karnataka', 'Telecommunications', ARRAY['SMT Assembly', 'BGA Placement', 'Conformal Coating'], '', 1),
('p2', 'Industrial PLC Module Assembly', 'Through-hole and SMD mixed-technology assembly of PLC I/O modules for a leading automation equipment manufacturer, with full functional testing.', 'Chennai, Tamil Nadu', 'Industrial Controls', ARRAY['Mixed Technology', 'Wave Soldering', 'Functional Testing'], '', 2),
('p3', 'Patient Monitor Electronics', 'IPC Class 3 assembly of patient vital-sign monitor PCBAs with fine-pitch QFP and BGA components, including X-ray inspection and full traceability.', 'Pune, Maharashtra', 'Medical Devices', ARRAY['IPC Class 3', 'QFP/BGA Assembly', 'X-Ray Inspection'], '', 3),
('p4', 'Automotive ECU Prototype', 'Rapid prototyping and first-article assembly of automotive ECU boards with high-speed signal routing, thermal management, and automotive-grade components.', 'Bangalore, Karnataka', 'Automotive', ARRAY['Prototype Assembly', 'DFM Review', 'Automotive Grade'], '', 4),
('p5', 'IoT Gateway Board Production', 'High-volume SMT assembly of compact 6-layer IoT gateway boards with WiFi/BLE modules, micro-BGA, and firmware programming.', 'Hyderabad, Telangana', 'IoT & Embedded Systems', ARRAY['High-Volume SMT', 'Micro BGA', 'Firmware Flashing'], '', 5),
('p6', 'Solar Inverter Power Board', 'Heavy-copper PCB assembly of 3-phase solar inverter power stages with high-current SMD MOSFETs, gate drivers, and thermal interface materials.', 'Bangalore, Karnataka', 'Renewable Energy', ARRAY['Heavy-Copper PCB', 'Power Electronics', 'Selective Soldering'], '', 6)
ON CONFLICT (id) DO NOTHING;
