package com.iot.repository;

import com.iot.entity.Attendance;
import com.iot.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentOrderByDateDescTimeDesc(Student student);

    List<Attendance> findByStudentAndDateBetweenOrderByDateDescTimeDesc(
            Student student, LocalDate from, LocalDate to);

    boolean existsByStudentAndDate(Student student, LocalDate date);

    @Query("SELECT DISTINCT a.date FROM Attendance a ORDER BY a.date")
    List<LocalDate> findAllDistinctDates();

    @Query("SELECT a.date, a.status, COUNT(a) FROM Attendance a " +
           "WHERE a.date >= :from GROUP BY a.date, a.status ORDER BY a.date")
    List<Object[]> countByDateAndStatusSince(@Param("from") LocalDate from);
}
