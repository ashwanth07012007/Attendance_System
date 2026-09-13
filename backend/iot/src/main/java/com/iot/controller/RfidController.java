package com.iot.controller;

import com.iot.Service.RfidService;
import com.iot.dto.*;
import com.iot.entity.Presented;
import com.iot.entity.RFidEntity;
import com.iot.exception.RfidAlreadyRegisteredException;
import com.iot.exception.RfidNotRegisteredException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/rfid")
public class RfidController {

    private final RfidService rfidService;

    public RfidController(RfidService rfidService) {
        this.rfidService = rfidService;
    }

    @PostMapping("/find")
    public PresentDto findNameById(@RequestBody RFidEntity request) {
        return rfidService.findNameById(request.getRfid());
    }

    @GetMapping("/all")
    public List<UserDto> getAllusers() {
        return rfidService.getAllusers();
    }

    // Today's present list (default) or date-range filtered
    @GetMapping("/allPresent")
    public List<Presented> getAllPresent(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from != null && to != null) {
            return rfidService.getPresentByDateRange(from, to);
        }
        return rfidService.getAllPresent();
    }

    @PostMapping("/registerRfid")
    public ResponseEntity<String> registerRfid(@RequestBody UserDto dto) {
        boolean result = rfidService.registerRfid(dto);
        if (!result) return ResponseEntity.status(HttpStatus.CONFLICT).body("RFID already registered");
        return ResponseEntity.ok("Student registered successfully");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody UserDto dto) {
        boolean updated = rfidService.updateStudent(id, dto);
        if (!updated) return ResponseEntity.badRequest().body("Student not found or RFID already taken");
        return ResponseEntity.ok(true);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        boolean deleted = rfidService.deleteStudent(id);
        if (!deleted) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(true);
    }

    @GetMapping("/lastScan")
    public ResponseEntity<ScanNotificationDto> getLastScan(
            @RequestParam(defaultValue = "0") long since) {
        ScanNotificationDto notif = rfidService.getLastScanNotification(since);
        if (notif == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(notif);
    }

    @GetMapping("/lastScanTimestamp")
    public long getLastScanTimestamp() {
        return rfidService.getLastScanTimestamp();
    }

    // Dashboard chart data — last N days (default 7)
    @GetMapping("/chart")
    public DashboardChartDto getChartData(
            @RequestParam(defaultValue = "7") int days) {
        return rfidService.getChartData(days);
    }

    // CSV export
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate start = from != null ? from : LocalDate.now().minusDays(30);
        LocalDate end   = to   != null ? to   : LocalDate.now();
        String csv = rfidService.exportAttendanceCsv(start, end);
        byte[] bytes = csv.getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"attendance.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @ExceptionHandler(RfidAlreadyRegisteredException.class)
    public ResponseEntity<String> handleRfidAlreadyRegistered(RfidAlreadyRegisteredException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(RfidNotRegisteredException.class)
    public ResponseEntity<String> handleRfidNotRegistered(RfidNotRegisteredException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
