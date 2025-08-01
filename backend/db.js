const db = {
  users: {
    "FAYDA_ID_FOR_PATIENT_1": {
      role: "patient",
      allergies: ["Peanuts"],
      prescriptions: [],
      consultations: [],
      personalData: {
        name: "Test Patient",
        age: 30,
        gender: "Male",
        bloodType: "O+",
        emergencyContact: "+251911234567"
      }
    },
    "FAYDA_ID_FOR_PATIENT_2": {
      role: "patient",
      allergies: ["Aspirin", "Latex"],
      prescriptions: [
        {
          id: "1",
          prescription: "Paracetamol 500mg",
          medication: "Paracetamol",
          dosage: "500mg twice daily",
          instructions: "Take after meals",
          prescribedBy: "DR_DEMO_001",
          prescribedAt: "2024-01-15T10:30:00Z",
          status: "active"
        }
      ],
      consultations: [],
      personalData: {
        name: "Demo Patient 2",
        age: 45,
        gender: "Female",
        bloodType: "A-",
        emergencyContact: "+251922345678"
      }
    },
    "DR_DEMO_001": {
      role: "doctor",
      specialization: "General Medicine",
      licenseNumber: "MD-12345",
      hospital: "Tikur Anbessa Hospital",
      personalData: {
        name: "Dr. Abebe Kebede",
        email: "doctor@hakim-ai.et"
      }
    },
    "ADMIN_DEMO_001": {
      role: "hospital-admin",
      hospital: "Tikur Anbessa Hospital",
      permissions: ["manage_doctors", "view_reports", "manage_patients"],
      personalData: {
        name: "Hospital Administrator",
        email: "admin@tikuranbessa.et"
      }
    }
  },
  // Session store for demo purposes
  sessions: {},
  
  // Application metadata
  metadata: {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    totalUsers: 4
  }
};

export default db;
