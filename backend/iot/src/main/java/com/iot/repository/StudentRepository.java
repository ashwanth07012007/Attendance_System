package com.iot.repository;

import com.iot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRfid(String rfid);

    Student findByRfid(String rfid);

    Student findByStudentId(String studentId);

    Student findByEmail(String email);
}
