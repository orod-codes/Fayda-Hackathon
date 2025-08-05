-- Create the Hakim AI Database and Tables (PostgreSQL)

-- Create enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE record_type AS ENUM ('allergy', 'condition', 'prescription', 'note');
CREATE TYPE message_role AS ENUM ('user', 'assistant');
CREATE TYPE booking_status AS ENUM ('confirmed', 'completed', 'canceled');

-- -----------------------------------------------------
-- Table Users: The central identity anchor linked to Fayda.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  fayda_id VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table Personal_Information: Stores static data from Fayda.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS personal_information (
  user_id INT NOT NULL,
  full_name VARCHAR(255) NULL,
  date_of_birth DATE NULL,
  gender VARCHAR(50) NULL,
  photo_url VARCHAR(2048) NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_personal_info_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Medical_Records: The collaborative health report.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL,
  record_type record_type NOT NULL,
  description TEXT NOT NULL,
  created_by_user_id INT NOT NULL,
  is_verified_by_doctor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_records_patient
    FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_medical_records_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Doctor_Availability_Rules: For doctors' recurring schedules.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_availability_rules (
  id SERIAL PRIMARY KEY,
  doctor_id INT NOT NULL,
  day_of_week INT NOT NULL, -- 0 for Sunday, 1 for Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CONSTRAINT fk_availability_rules_doctor
    FOREIGN KEY (doctor_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Bookings: Tracks confirmed appointments.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  booking_time TIMESTAMP NOT NULL,
  video_room_id VARCHAR(255),
  status booking_status DEFAULT 'confirmed',
  CONSTRAINT fk_bookings_patient
    FOREIGN KEY (patient_id) REFERENCES users (id),
  CONSTRAINT fk_bookings_doctor
    FOREIGN KEY (doctor_id) REFERENCES users (id)
);

-- -----------------------------------------------------
-- Table Chat_Sessions: Groups messages and holds AI-generated metadata.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  topic VARCHAR(255) NULL,
  summary_encrypted TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_sessions_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table Chat_Messages: Stores the encrypted conversation transcript.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL,
  role message_role NOT NULL,
  content_encrypted TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_messages_session
    FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Insert sample data for testing
-- -----------------------------------------------------

-- Sample Users with specific FANs
INSERT INTO users (fayda_id, role) VALUES
('3126894653473958', 'patient'),  -- Specific patient FAN
('6230247319356120', 'doctor'),   -- Specific doctor FAN
('FAYDA_PATIENT_002', 'patient'),
('FAYDA_DOCTOR_002', 'doctor');

-- Sample Personal Information
INSERT INTO personal_information (user_id, full_name, date_of_birth, gender, photo_url) VALUES
(1, 'Abebe Kebede', '1990-05-15', 'Male', 'https://example.com/photos/abebe.jpg'),
(2, 'Dr. Yohannes Tadesse', '1975-03-10', 'Male', 'https://example.com/photos/dr_yohannes.jpg'),
(3, 'Tigist Haile', '1985-08-22', 'Female', 'https://example.com/photos/tigist.jpg'),
(4, 'Dr. Bethlehem Alemu', '1980-12-05', 'Female', 'https://example.com/photos/dr_bethlehem.jpg');

-- Sample Medical Records
INSERT INTO medical_records (patient_id, record_type, description, created_by_user_id, is_verified_by_doctor) VALUES
(1, 'allergy', 'Peanut allergy', 1, FALSE),
(1, 'condition', 'Hypertension', 2, TRUE),
(1, 'prescription', 'Amlodipine 5mg daily', 2, TRUE),
(3, 'allergy', 'Penicillin allergy', 3, FALSE),
(3, 'condition', 'Diabetes Type 2', 4, TRUE),
(3, 'prescription', 'Metformin 500mg twice daily', 4, TRUE);

-- Sample Doctor Availability Rules
INSERT INTO doctor_availability_rules (doctor_id, day_of_week, start_time, end_time) VALUES
(2, 1, '09:00:00', '17:00:00'),  -- Monday
(2, 2, '09:00:00', '17:00:00'),  -- Tuesday
(2, 3, '09:00:00', '17:00:00'),  -- Wednesday
(2, 4, '09:00:00', '17:00:00'),  -- Thursday
(2, 5, '09:00:00', '17:00:00'),  -- Friday
(4, 1, '10:00:00', '18:00:00'),  -- Monday
(4, 2, '10:00:00', '18:00:00'),  -- Tuesday
(4, 3, '10:00:00', '18:00:00'),  -- Wednesday
(4, 4, '10:00:00', '18:00:00'),  -- Thursday
(4, 5, '10:00:00', '18:00:00');  -- Friday

-- Sample Bookings
INSERT INTO bookings (patient_id, doctor_id, booking_time, video_room_id, status) VALUES
(1, 2, '2024-01-15 10:00:00', 'room_001', 'confirmed'),
(3, 4, '2024-01-16 14:00:00', 'room_002', 'confirmed');

-- Sample Chat Sessions
INSERT INTO chat_sessions (user_id, topic, summary_encrypted) VALUES
(1, 'General health consultation', 'encrypted_summary_1'),
(1, 'Medication questions', 'encrypted_summary_2'),
(3, 'Dietary advice', 'encrypted_summary_3');
