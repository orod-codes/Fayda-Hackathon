-- Create the Hakim AI Database and Tables (SQLite)

-- Create enum types using simple text columns

-- -----------------------------------------------------
-- Table Hospitals: Hospital management
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  license_number TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER,
  FOREIGN KEY (approved_by) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Users: The central identity anchor linked to Fayda.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fayda_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK(role IN ('patient', 'doctor', 'hospital_admin', 'super_admin')),
  hospital_id INTEGER,
  license_number TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER,
  FOREIGN KEY (hospital_id) REFERENCES hospitals (id),
  FOREIGN KEY (approved_by) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Personal_Information: Stores static data from Fayda.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS personal_information (
  user_id INTEGER NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  photo_url TEXT,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Medical_Records: The collaborative health report.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  record_type TEXT NOT NULL CHECK(record_type IN ('allergy', 'condition', 'prescription', 'note')),
  description TEXT NOT NULL,
  created_by_user_id INTEGER NOT NULL,
  is_verified_by_doctor BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Doctor_Availability_Rules: For doctors' recurring schedules.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_availability_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0 for Sunday, 1 for Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (doctor_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Bookings: Tracks confirmed appointments.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  hospital_id INTEGER,
  booking_time TIMESTAMP NOT NULL,
  appointment_type TEXT DEFAULT 'video' CHECK(appointment_type IN ('video', 'phone', 'in_person')),
  video_room_id TEXT,
  phone_number TEXT,
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'completed', 'canceled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users (id),
  FOREIGN KEY (doctor_id) REFERENCES users (id),
  FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
);

-- -----------------------------------------------------
-- Table Patient_Documents: Store patient uploaded documents
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS patient_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  document_type TEXT CHECK(document_type IN ('lab_result', 'prescription', 'image', 'report', 'other')),
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed BOOLEAN DEFAULT 0,
  extracted_text TEXT,
  FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Medication_Reminders: Medication reminder system
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS medication_reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  times_per_day INTEGER DEFAULT 1,
  reminder_times TEXT, -- JSON array of times
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT 1,
  prescribed_by INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (prescribed_by) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Medication_Logs: Track medication taking
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS medication_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reminder_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  taken_time TIMESTAMP,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'taken', 'missed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reminder_id) REFERENCES medication_reminders (id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Consultation_Reports: Enhanced consultation reports
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS consultation_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  consultation_date TIMESTAMP NOT NULL,
  chief_complaint TEXT,
  symptoms TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  prescriptions TEXT,
  follow_up_instructions TEXT,
  audio_transcript TEXT,
  ai_summary TEXT,
  doctor_notes TEXT,
  vital_signs TEXT, -- JSON format
  is_finalized BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings (id),
  FOREIGN KEY (patient_id) REFERENCES users (id),
  FOREIGN KEY (doctor_id) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Patient_Forms: Patient intake and health forms
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS patient_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  form_type TEXT NOT NULL CHECK(form_type IN ('intake', 'health_assessment', 'symptoms', 'follow_up')),
  form_data TEXT NOT NULL, -- JSON format
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INTEGER,
  reviewed_at TIMESTAMP,
  status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted', 'reviewed', 'processed')),
  FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Chat_Sessions: Groups messages and holds AI-generated metadata.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  topic TEXT,
  summary_encrypted TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Chat_Messages: Stores the encrypted conversation transcript.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  content_encrypted TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Insert sample data for testing
-- -----------------------------------------------------

-- Sample Hospital
INSERT OR IGNORE INTO hospitals (name, address, phone, email, license_number, status) VALUES
('Tikur Anbessa Specialized Hospital', 'Addis Ababa, Ethiopia', '+251111234567', 'info@tikuranbessa.edu.et', 'HOSP-001', 'approved');

-- Sample Users with specific FANs
INSERT OR IGNORE INTO users (fayda_id, role, hospital_id, status) VALUES
('3126894653473958', 'patient', NULL, 'approved'),  -- Specific patient FAN
('6230247319356120', 'doctor', 1, 'approved'),   -- Specific doctor FAN
('FAYDA_PATIENT_002', 'patient', NULL, 'approved'),
('FAYDA_DOCTOR_002', 'doctor', 1, 'approved');

-- Sample Personal Information
INSERT OR IGNORE INTO personal_information (user_id, full_name, date_of_birth, gender, photo_url) VALUES
(1, 'Abebe Kebede', '1990-05-15', 'Male', 'https://example.com/photos/abebe.jpg'),
(2, 'Dr. Yohannes Tadesse', '1975-03-10', 'Male', 'https://example.com/photos/dr_yohannes.jpg'),
(3, 'Tigist Haile', '1985-08-22', 'Female', 'https://example.com/photos/tigist.jpg'),
(4, 'Dr. Bethlehem Alemu', '1980-12-05', 'Female', 'https://example.com/photos/dr_bethlehem.jpg');

-- Sample Medical Records
INSERT OR IGNORE INTO medical_records (patient_id, record_type, description, created_by_user_id, is_verified_by_doctor) VALUES
(1, 'allergy', 'Peanut allergy', 1, 0),
(1, 'condition', 'Hypertension', 2, 1),
(1, 'prescription', 'Amlodipine 5mg daily', 2, 1),
(3, 'allergy', 'Penicillin allergy', 3, 0),
(3, 'condition', 'Diabetes Type 2', 4, 1),
(3, 'prescription', 'Metformin 500mg twice daily', 4, 1);

-- Sample Doctor Availability Rules
INSERT OR IGNORE INTO doctor_availability_rules (doctor_id, day_of_week, start_time, end_time) VALUES
(2, 1, '09:00', '17:00'),  -- Monday
(2, 2, '09:00', '17:00'),  -- Tuesday
(2, 3, '09:00', '17:00'),  -- Wednesday
(2, 4, '09:00', '17:00'),  -- Thursday
(2, 5, '09:00', '17:00'),  -- Friday
(4, 1, '10:00', '18:00'),  -- Monday
(4, 2, '10:00', '18:00'),  -- Tuesday
(4, 3, '10:00', '18:00'),  -- Wednesday
(4, 4, '10:00', '18:00'),  -- Thursday
(4, 5, '10:00', '18:00');  -- Friday

-- Sample Bookings
INSERT OR IGNORE INTO bookings (patient_id, doctor_id, booking_time, video_room_id, status) VALUES
(1, 2, '2024-01-15 10:00:00', 'room_001', 'confirmed'),
(3, 4, '2024-01-16 14:00:00', 'room_002', 'confirmed');

-- Sample Chat Sessions
INSERT OR IGNORE INTO chat_sessions (user_id, topic, summary_encrypted) VALUES
(1, 'General health consultation', 'encrypted_summary_1'),
(1, 'Medication questions', 'encrypted_summary_2'),
(3, 'Dietary advice', 'encrypted_summary_3');

