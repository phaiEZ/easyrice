-- Create the database
CREATE DATABASE inspectiondb;

-- Use the created database
USE inspectiondb;

-- Create the 'inspections' table
CREATE TABLE inspections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inspection_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  create_date DATETIME NOT NULL,
  standard_id VARCHAR(255) NOT NULL,
  note TEXT,
  standard_name VARCHAR(255) NOT NULL,
  sampling_date DATETIME NOT NULL,
  sampling_point JSON,
  price DECIMAL(10, 2),
  image_link VARCHAR(255)
);

-- Create the 'inspectionstandarddata' table
CREATE TABLE inspectionstandarddata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inspection_id VARCHAR(255) NOT NULL,
  key_name VARCHAR(255) NOT NULL,
  min_length INT NOT NULL,
  max_length INT NOT NULL,
  shape JSON,
  name VARCHAR(255) NOT NULL,
  condition_min VARCHAR(50) NOT NULL,
  condition_max VARCHAR(50) NOT NULL,
  value DECIMAL(10, 2),
  FOREIGN KEY (inspection_id) REFERENCES inspections(inspection_id) ON DELETE CASCADE
);

-- Create the 'standards' table (if required)
CREATE TABLE standards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
