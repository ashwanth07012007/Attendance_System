package com.iot.controller;

import com.iot.Service.RfidService;
import com.iot.dto.AttendanceDto;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final RfidService rfidService;

    public AttendanceController(RfidService rfidService) {
        this.rfidService = rfidService;
    }

    @GetMapping("/my")
    public AttendanceDto getMyAttendance(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        String email = oidcUser.getAttribute("email");

        LocalDate start = from != null ? from : LocalDate.of(2000, 1, 1);
        LocalDate end   = to   != null ? to   : LocalDate.now();

        return rfidService.getMyAttendance(email, start, end);
    }
}
