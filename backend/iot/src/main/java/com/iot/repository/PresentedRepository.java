package com.iot.repository;

import com.iot.entity.Presented;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PresentedRepository extends JpaRepository<Presented, Long> {

    boolean existsByNameAndDate(String name, LocalDate date);

    List<Presented> findByDateOrderByTimeDesc(LocalDate date);

    List<Presented> findByDateBetweenOrderByDateDescTimeDesc(LocalDate from, LocalDate to);
}
