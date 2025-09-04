-- Smart Video Analyzer Database Schema
-- MySQL/MariaDB Database Setup Script

-- Create database
CREATE DATABASE IF NOT EXISTS video_analyzer;
USE video_analyzer;

-- Create video_tests table
CREATE TABLE IF NOT EXISTS video_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_name VARCHAR(255) NOT NULL,
    startup_time DECIMAL(10, 3) NOT NULL COMMENT 'Time in seconds for video to start playing',
    buffering_count INT NOT NULL DEFAULT 0 COMMENT 'Number of buffering events during playback',
    buffering_duration DECIMAL(10, 3) NOT NULL DEFAULT 0 COMMENT 'Total buffering time in seconds',
    avg_resolution VARCHAR(50) NOT NULL DEFAULT 'Unknown' COMMENT 'Average video resolution (e.g., 1080p, 720p)',
    freeze_percent DECIMAL(5, 2) NOT NULL DEFAULT 0 COMMENT 'Percentage of video that appeared frozen',
    test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the test was performed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_video_name ON video_tests(video_name);
CREATE INDEX idx_test_date ON video_tests(test_date);
CREATE INDEX idx_startup_time ON video_tests(startup_time);

-- Insert sample data for testing
INSERT INTO video_tests (video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent) VALUES
('Sample Test Video 1', 2.34, 1, 1.5, '1080p', 0.8),
('Sample Test Video 2', 1.89, 0, 0.0, '720p', 0.0),
('Sample Test Video 3', 3.12, 2, 3.2, '1080p', 1.2);

-- Display table structure
DESCRIBE video_tests;

-- Show sample data
SELECT * FROM video_tests;
