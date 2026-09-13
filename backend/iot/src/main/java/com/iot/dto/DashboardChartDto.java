package com.iot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardChartDto {
    private List<DayStats> daily;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayStats {
        private String date;
        private long present;
        private long late;
    }
}
