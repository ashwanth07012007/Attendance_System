package com.iot.Service;

import com.iot.dto.*;
import com.iot.entity.*;
import com.iot.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RfidService {

    private final StudentRepository studentRepository;
    private final PresentedRepository presentedRepository;
    private final AttendanceRepository attendanceRepository;

    private volatile ScanNotificationDto lastScanNotification = null;
    private volatile long lastScanTimestamp = 0;

    private static final DateTimeFormatter DATE_FMT  = DateTimeFormatter.ofPattern("MMM dd, yyyy");
    private static final DateTimeFormatter TIME_FMT  = DateTimeFormatter.ofPattern("hh:mm a");
    private static final DateTimeFormatter CHART_FMT = DateTimeFormatter.ofPattern("MMM dd");

    public RfidService(StudentRepository studentRepository,
                       PresentedRepository presentedRepository,
                       AttendanceRepository attendanceRepository) {
        this.studentRepository  = studentRepository;
        this.presentedRepository = presentedRepository;
        this.attendanceRepository = attendanceRepository;
    }

    // ── RFID Scan ─────────────────────────────────────────────────────────────

    public PresentDto findNameById(String rfid) {
        Student student = studentRepository.findByRfid(rfid);

        if (student == null) {
            setLastNotification(new ScanNotificationDto("Unknown", now(), "UNKNOWN", "Unknown RFID scanned"));
            return new PresentDto(false, "RFID not registered");
        }

        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsByStudentAndDate(student, today)
                || presentedRepository.existsByNameAndDate(student.getName(), today)) {
            setLastNotification(new ScanNotificationDto(student.getName(), now(), "DUPLICATE", "Already marked present today"));
            return new PresentDto(true, "Already marked present");
        }

        LocalTime currentTime = LocalTime.now();
        boolean isLate = currentTime.isAfter(LocalTime.of(8, 30));
        AttendanceStatus status = isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;

        Presented p = new Presented();
        p.setName(student.getName());
        p.setTime(currentTime);
        p.setDate(today);
        p.setArrival(isLate ? "Late" : "Earlier");
        presentedRepository.save(p);

        Attendance a = new Attendance();
        a.setStudent(student);
        a.setDate(today);
        a.setTime(currentTime);
        a.setStatus(status);
        attendanceRepository.save(a);

        setLastNotification(new ScanNotificationDto(student.getName(), now(), status.name(), "Attendance marked: " + status.name()));
        return new PresentDto(true, "Attendance marked successfully");
    }

    // ── Register Student ──────────────────────────────────────────────────────

    public boolean registerRfid(UserDto dto) {
        if (dto.getRfid() == null || dto.getRfid().isBlank()) return false;
        if (studentRepository.existsByRfid(dto.getRfid())) return false;

        Student student = null;

        // Match by email first
        if (blankToNull(dto.getEmail()) != null) {
            student = studentRepository.findByEmail(dto.getEmail().trim());
        }
        // Match by studentId
        if (student == null && blankToNull(dto.getStudentId()) != null) {
            student = studentRepository.findByStudentId(dto.getStudentId().trim());
        }
        // New student
        if (student == null) {
            student = new Student();
        }

        student.setName(dto.getName());
        student.setRfid(dto.getRfid().trim());
        student.setEmail(blankToNull(dto.getEmail()));
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setSection(dto.getSection());

        String sid = blankToNull(dto.getStudentId());
        if (sid != null) {
            Student existing = studentRepository.findByStudentId(sid);
            if (existing == null || existing.getId().equals(student.getId())) {
                student.setStudentId(sid);
            }
        } else {
            student.setStudentId(null);
        }

        studentRepository.save(student);
        return true;
    }

    // ── Update Student ────────────────────────────────────────────────────────

    public boolean updateStudent(Long id, UserDto dto) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) return false;

        if (dto.getRfid() != null && !dto.getRfid().isBlank()
                && !dto.getRfid().equals(student.getRfid())) {
            if (studentRepository.existsByRfid(dto.getRfid())) return false;
        }

        if (blankToNull(dto.getName()) != null) student.setName(dto.getName());
        if (blankToNull(dto.getRfid()) != null) student.setRfid(dto.getRfid());
        student.setEmail(blankToNull(dto.getEmail()));
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setSection(dto.getSection());

        String sid = blankToNull(dto.getStudentId());
        if (sid != null) {
            Student existing = studentRepository.findByStudentId(sid);
            if (existing == null || existing.getId().equals(student.getId())) {
                student.setStudentId(sid);
            }
        } else {
            student.setStudentId(null);
        }

        studentRepository.save(student);
        return true;
    }

    // ── Delete Student ────────────────────────────────────────────────────────

    public boolean deleteStudent(Long id) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) return false;
        attendanceRepository.deleteAll(attendanceRepository.findByStudentOrderByDateDescTimeDesc(student));
        studentRepository.deleteById(id);
        return true;
    }

    // ── Get All Students ──────────────────────────────────────────────────────

    public List<UserDto> getAllusers() {
        return studentRepository.findAll().stream()
                .map(s -> new UserDto(s.getId(), s.getName(), s.getEmail(), s.getRfid(),
                        s.getStudentId(), s.getDepartment(), s.getYear(), s.getSection()))
                .collect(Collectors.toList());
    }

    // ── Present List ──────────────────────────────────────────────────────────

    public List<Presented> getAllPresent() {
        return presentedRepository.findByDateOrderByTimeDesc(LocalDate.now());
    }

    public List<Presented> getPresentByDateRange(LocalDate from, LocalDate to) {
        return presentedRepository.findByDateBetweenOrderByDateDescTimeDesc(from, to);
    }

    // ── My Attendance ─────────────────────────────────────────────────────────

    public AttendanceDto getMyAttendance(String email, LocalDate from, LocalDate to) {
        Student student = studentRepository.findByEmail(email);
        if (student == null) {
            return new AttendanceDto(0, 0, 0, 0.0, List.of());
        }

        List<LocalDate> allClassDays = attendanceRepository.findAllDistinctDates().stream()
                .filter(d -> !d.isBefore(from) && !d.isAfter(to))
                .collect(Collectors.toList());

        int totalClasses = allClassDays.size();

        List<Attendance> records = attendanceRepository
                .findByStudentAndDateBetweenOrderByDateDescTimeDesc(student, from, to);

        Set<LocalDate> presentDays = records.stream()
                .filter(r -> r.getStatus() == AttendanceStatus.PRESENT || r.getStatus() == AttendanceStatus.LATE)
                .map(Attendance::getDate)
                .collect(Collectors.toSet());

        int present = presentDays.size();
        int absent  = totalClasses - present;
        double percentage = totalClasses == 0 ? 0.0
                : Math.round((present * 100.0 / totalClasses) * 10.0) / 10.0;

        List<AttendanceDto.AttendanceRecordDto> history = records.stream()
                .map(r -> new AttendanceDto.AttendanceRecordDto(
                        r.getDate().format(DATE_FMT),
                        r.getTime().format(TIME_FMT),
                        r.getStatus().name()))
                .collect(Collectors.toList());

        return new AttendanceDto(totalClasses, present, absent, percentage, history);
    }

    // ── Dashboard Chart ───────────────────────────────────────────────────────

    public DashboardChartDto getChartData(int days) {
        LocalDate from = LocalDate.now().minusDays(days - 1);
        List<Object[]> rows = attendanceRepository.countByDateAndStatusSince(from);

        Map<LocalDate, long[]> map = new LinkedHashMap<>();
        for (int i = days - 1; i >= 0; i--) {
            map.put(LocalDate.now().minusDays(i), new long[]{0, 0});
        }

        for (Object[] row : rows) {
            LocalDate date = (LocalDate) row[0];
            AttendanceStatus status = (AttendanceStatus) row[1];
            long count = (long) row[2];
            if (map.containsKey(date)) {
                if (status == AttendanceStatus.PRESENT) map.get(date)[0] = count;
                else if (status == AttendanceStatus.LATE) map.get(date)[1] = count;
            }
        }

        List<DashboardChartDto.DayStats> daily = map.entrySet().stream()
                .map(e -> new DashboardChartDto.DayStats(
                        e.getKey().format(CHART_FMT), e.getValue()[0], e.getValue()[1]))
                .collect(Collectors.toList());

        return new DashboardChartDto(daily);
    }

    // ── CSV Export ────────────────────────────────────────────────────────────

    public String exportAttendanceCsv(LocalDate from, LocalDate to) {
        List<Presented> records = presentedRepository.findByDateBetweenOrderByDateDescTimeDesc(from, to);
        StringBuilder sb = new StringBuilder("Name,Date,Time,Status\n");
        for (Presented p : records) {
            sb.append(escape(p.getName())).append(",")
              .append(p.getDate()).append(",")
              .append(p.getTime().format(DateTimeFormatter.ofPattern("HH:mm:ss"))).append(",")
              .append(p.getArrival()).append("\n");
        }
        return sb.toString();
    }

    // ── Notifications ─────────────────────────────────────────────────────────

    public ScanNotificationDto getLastScanNotification(long since) {
        return lastScanTimestamp > since ? lastScanNotification : null;
    }

    public long getLastScanTimestamp() {
        return lastScanTimestamp;
    }

    private void setLastNotification(ScanNotificationDto notif) {
        this.lastScanNotification = notif;
        this.lastScanTimestamp = System.currentTimeMillis();
    }

    private String now() {
        return LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    private String blankToNull(String val) {
        return (val == null || val.isBlank()) ? null : val;
    }

    private String escape(String val) {
        if (val == null) return "";
        if (val.contains(",") || val.contains("\"")) return "\"" + val.replace("\"", "\"\"") + "\"";
        return val;
    }
}
