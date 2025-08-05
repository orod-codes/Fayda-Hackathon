import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery, executeTransaction } from '../database/connection.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample users
    const users = [
      {
        id: 'PATIENT_001',
        email: 'patient@example.com',
        phone_number: '+251911234567',
        password: 'password123',
        full_name: 'Abebe Kebede',
        role: 'patient',
        date_of_birth: '1990-05-15',
        gender: 'male',
        blood_type: 'O+',
        emergency_contact_name: 'Kebede Abebe',
        emergency_contact_phone: '+251922345678',
        emergency_contact_relationship: 'Father'
      },
      {
        id: 'PATIENT_002',
        email: 'patient2@example.com',
        phone_number: '+251912345678',
        password: 'password123',
        full_name: 'Aster Tsegaye',
        role: 'patient',
        date_of_birth: '1985-08-22',
        gender: 'female',
        blood_type: 'A+',
        emergency_contact_name: 'Tsegaye Aster',
        emergency_contact_phone: '+251923456789',
        emergency_contact_relationship: 'Husband'
      },
      {
        id: 'DOCTOR_001',
        email: 'doctor@example.com',
        phone_number: '+251913456789',
        password: 'password123',
        full_name: 'Dr. Yohannes Haile',
        role: 'doctor',
        date_of_birth: '1980-03-10',
        gender: 'male'
      },
      {
        id: 'HOSPITAL_ADMIN_001',
        email: 'admin@hospital.com',
        phone_number: '+251914567890',
        password: 'password123',
        full_name: 'Admin User',
        role: 'hospital_admin',
        date_of_birth: '1975-12-05',
        gender: 'male'
      },
      {
        id: 'SUPER_ADMIN_001',
        email: 'superadmin@hakim.com',
        phone_number: '+251915678901',
        password: 'password123',
        full_name: 'Super Admin',
        role: 'super_admin',
        date_of_birth: '1970-01-01',
        gender: 'male'
      }
    ];

    // Create sample hospitals
    const hospitals = [
      {
        id: 'HOSP_001',
        name: 'Tikur Anbessa Specialized Hospital',
        address: 'Addis Ababa, Ethiopia',
        phone: '+251111234567',
        email: 'info@tash.edu.et',
        website: 'https://tash.edu.et',
        type: 'public',
        capacity: 500,
        specialties: 'General Medicine, Surgery, Pediatrics, Obstetrics'
      },
      {
        id: 'HOSP_002',
        name: 'Bethel Teaching Hospital',
        address: 'Addis Ababa, Ethiopia',
        phone: '+251111345678',
        email: 'info@bethel.edu.et',
        website: 'https://bethel.edu.et',
        type: 'private',
        capacity: 300,
        specialties: 'Cardiology, Neurology, Oncology'
      }
    ];

    for (const user of users) {
      // Hash password
      const passwordHash = await bcrypt.hash(user.password, 12);

      // Check if user already exists
      const existingUser = await executeQuery(
        'SELECT id FROM users WHERE email = ? OR phone_number = ?',
        [user.email, user.phone_number]
      );

      if (existingUser.length > 0) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        continue;
      }

      const queries = [
        {
          query: `INSERT INTO users (id, role, email, phone_number, password_hash, full_name, date_of_birth, gender) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          params: [user.id, user.role, user.email, user.phone_number, passwordHash, user.full_name, user.date_of_birth, user.gender]
        }
      ];

      // Create role-specific profiles
      if (user.role === 'patient') {
        queries.push({
          query: `INSERT INTO patients (user_id, blood_type, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship) 
                  VALUES (?, ?, ?, ?, ?)`,
          params: [user.id, user.blood_type, user.emergency_contact_name, user.emergency_contact_phone, user.emergency_contact_relationship]
        });
      } else if (user.role === 'doctor') {
        queries.push({
          query: `INSERT INTO doctors (user_id, specialization, license_number, experience_years) 
                  VALUES (?, ?, ?, ?)`,
          params: [user.id, 'General Medicine', `LIC_${user.id}`, 5]
        });
      } else if (user.role === 'hospital_admin') {
        queries.push({
          query: `INSERT INTO hospital_admins (user_id, hospital_id, department, position) 
                  VALUES (?, ?, ?, ?)`,
          params: [user.id, 'HOSP_001', 'Administration', 'Hospital Administrator']
        });
      }

      await executeTransaction(queries);
      console.log(`✅ Created ${user.role} user: ${user.email}`);
    }

    // Create hospitals
    for (const hospital of hospitals) {
      const existingHospital = await executeQuery(
        'SELECT id FROM hospitals WHERE id = ?',
        [hospital.id]
      );

      if (existingHospital.length > 0) {
        console.log(`⚠️  Hospital ${hospital.name} already exists, skipping...`);
        continue;
      }

      await executeQuery(
        `INSERT INTO hospitals (id, name, address, phone, email, website, type, capacity, specialties) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [hospital.id, hospital.name, hospital.address, hospital.phone, hospital.email, hospital.website, hospital.type, hospital.capacity, hospital.specialties]
      );

      console.log(`✅ Created hospital: ${hospital.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Patient: patient@example.com / password123');
    console.log('Doctor: doctor@example.com / password123');
    console.log('Hospital Admin: admin@hospital.com / password123');
    console.log('Super Admin: superadmin@hakim.com / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run the seeding
seedData(); 