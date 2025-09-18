CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) NOT NULL UNIQUE, -- Link to Firebase Authentication
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE,
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    date_of_birth DATE,
    address TEXT,
    fcm_token VARCHAR(255),
    role VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clinics (
    clinic_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    address TEXT,
    latitude DOUBLE,
    longitude DOUBLE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE specialties (
   specialty_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(200),
   description TEXT,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    doctor_id INT PRIMARY KEY,
    clinic_id INT NOT NULL,
    specialty_id INT NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id),
    FOREIGN KEY (clinic_id) REFERENCES clinics(clinic_id),
    FOREIGN KEY (specialty_id) REFERENCES specialties(specialty_id)
);

CREATE TABLE login_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(512) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_time DATETIME NOT NULL,
    symptoms TEXT,
    status VARCHAR(40) DEFAULT 'pending', -- pending, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);

CREATE TABLE medication_reminders (
    reminder_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    times_per_day INT NOT NULL,
    reminder_time VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE treatment_histories (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., appointment, medication, doctor_message
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
