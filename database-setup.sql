-- Create doctors table if it doesn't exist
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  profile_photo TEXT,
  phone TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  languages TEXT[],
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
  license_number TEXT,
  years_of_experience INTEGER,
  role TEXT DEFAULT 'doctor' CHECK (role IN ('doctor', 'admin'))
);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow doctors to read their own data
CREATE POLICY "Doctors can read own data" ON doctors
  FOR SELECT USING (auth.email() = email);

-- Create policy to allow authenticated users to read doctor data (for appointments)
CREATE POLICY "Authenticated users can read doctor data" ON doctors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert demo doctor accounts
INSERT INTO doctors (
  email,
  first_name,
  last_name,
  specialization,
  profile_photo,
  phone,
  bio,
  verified,
  languages,
  availability_status,
  license_number,
  years_of_experience,
  role
) VALUES 
(
  'dr.smith@example.com',
  'John',
  'Smith',
  'General Medicine',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
  '+1234567890',
  'Experienced general practitioner with 15 years of experience.',
  true,
  ARRAY['English', 'Spanish'],
  'available',
  'MD123456',
  15,
  'doctor'
),
(
  'dr.johnson@example.com',
  'Sarah',
  'Johnson',
  'Emergency Medicine',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
  '+1234567891',
  'Emergency medicine specialist available 24/7.',
  true,
  ARRAY['English', 'French'],
  'available',
  'MD789012',
  12,
  'doctor'
),
(
  'admin@example.com',
  'System',
  'Administrator',
  'Administration',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  '+1234567892',
  'System administrator with full access to the platform.',
  true,
  ARRAY['English'],
  'available',
  'ADMIN001',
  5,
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Create auth users for the doctors (these need to be created in Supabase Auth)
-- Note: You'll need to create these users in the Supabase Auth dashboard or via API
-- with the following emails and set their passwords:
-- 1. dr.smith@example.com (password: doctor123)
-- 2. dr.johnson@example.com (password: doctor123)  
-- 3. admin@example.com (password: admin123)