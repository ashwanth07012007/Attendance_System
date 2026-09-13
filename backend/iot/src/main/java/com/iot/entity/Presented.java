package com.iot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "presented")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Presented {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private String arrival;

    @Column(nullable = false)
    private LocalDate date;
}