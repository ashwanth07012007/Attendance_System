package com.iot.repository;

import com.iot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

// Kept for backward compatibility — delegates to StudentRepository
public interface RegisterRfidRepo extends JpaRepository<Student, Long> {

    boolean existsByRfid(String rfid);

    Student findByRfid(String rfid);
}
