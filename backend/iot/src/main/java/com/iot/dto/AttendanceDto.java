package com.iot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {
    private int totalClasses;
    private int present;
    private int absent;
    private double percentage;
    private List<AttendanceRecordDto> history;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttendanceRecordDto {
        private String date;
        private String time;
        private String status;
    }
}
