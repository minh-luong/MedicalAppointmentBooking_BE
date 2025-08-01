CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) NOT NULL UNIQUE, -- Link to Firebase Authentication
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE,
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    date_of_birth DATE,
    address TEXT,
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

CREATE TABLE fcm_token (
    user_id INT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
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
    status VARCHAR(40) DEFAULT 'pending', -- pending, confirmed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
);
