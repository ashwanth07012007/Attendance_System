package com.iot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScanNotificationDto {
    private String name;
    private String time;
    private String status;   // PRESENT, LATE, DUPLICATE, UNKNOWN
    private String message;
}
