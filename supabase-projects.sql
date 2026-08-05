-- ============================================================
-- S.B. Technologies - Projects Table Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Projects table
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

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

-- Authenticated write
DROP POLICY IF EXISTS "Admin insert projects" ON projects;
CREATE POLICY "Admin insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Admin update projects" ON projects;
CREATE POLICY "Admin update projects" ON projects FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin delete projects" ON projects;
CREATE POLICY "Admin delete projects" ON projects FOR DELETE TO authenticated USING (true);

-- Anon write (for direct-login admin)
DROP POLICY IF EXISTS "Anon insert projects" ON projects;
CREATE POLICY "Anon insert projects" ON projects FOR INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Anon update projects" ON projects;
CREATE POLICY "Anon update projects" ON projects FOR UPDATE TO anon USING (true);
DROP POLICY IF EXISTS "Anon delete projects" ON projects;
CREATE POLICY "Anon delete projects" ON projects FOR DELETE TO anon USING (true);

-- Storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public read project images" ON storage.objects;
CREATE POLICY "Public read project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Auth upload project images" ON storage.objects;
CREATE POLICY "Auth upload project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Auth update project images" ON storage.objects;
CREATE POLICY "Auth update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Auth delete project images" ON storage.objects;
CREATE POLICY "Auth delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Anon upload project images" ON storage.objects;
CREATE POLICY "Anon upload project images" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Anon update project images" ON storage.objects;
CREATE POLICY "Anon update project images" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'project-images');
DROP POLICY IF EXISTS "Anon delete project images" ON storage.objects;
CREATE POLICY "Anon delete project images" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'project-images');

-- Ensure update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
