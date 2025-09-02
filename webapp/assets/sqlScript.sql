
create DAtabase hotel;

USE HOTEL;

SHOW TABLES;
DESC EMPLOYEE;

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('male','female','other') NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    id_proof_type VARCHAR(50) NOT NULL,
    id_proof_number VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL
);

CREATE TABLE room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type ENUM('single','double','deluxe','suite','family') NOT NULL,
    floor_number INT NOT NULL,
    bed_type ENUM('single','double','king','twin') NOT NULL,
    max_occupancy INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    extra_bed_charges DECIMAL(10,2) DEFAULT 0,
    amenities VARCHAR(255),  -- store comma separated amenities like wifi,ac,tv
    current_status ENUM('available','occupied','maintenance','reserved') DEFAULT 'available',
    housekeeping_status ENUM('clean','dirty','in-progress') DEFAULT 'clean',
    maintenance_notes TEXT
);

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male','female','other') NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    permanent_address TEXT NOT NULL,
    current_address TEXT NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    employee_type ENUM('full-time','part-time','contract') NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    bank_name VARCHAR(50) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    pan_number VARCHAR(20) NOT NULL,
    govt_id_number VARCHAR(50) NOT NULL
);

CREATE TABLE driver (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_type ENUM('LMV','HMV','MCWG','MCWOG') NOT NULL,
    dl_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    issuing_authority VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male','female','other') NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    permanent_address TEXT NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    status ENUM('available','assigned') DEFAULT 'available'
);

CREATE TABLE booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in DATETIME NOT NULL,
    check_out DATETIME NOT NULL,
    number_of_guests INT NOT NULL,
    booking_source ENUM('online','walk-in','travel-agent') NOT NULL,
    payment_mode ENUM('cash','card','upi','online') NOT NULL,
    advance_paid DECIMAL(10,2) NOT NULL,
    total_bill DECIMAL(10,2) NOT NULL,
    status ENUM('checked_in','checked_out','cancelled') DEFAULT 'checked_in',
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (room_id) REFERENCES room(room_id)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- store hashed password, not plain text
    role ENUM('ADMIN', 'RECEPTIONIST') NOT NULL,
    employee_id INT,
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE
);




