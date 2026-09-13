package com.iot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class AuthController {

    @GetMapping("/api/auth/me")
    public Object me(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList());
    }

    @GetMapping("/api/auth/profile")
    public ResponseEntity<Map<String, Object>> profile(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
            return ResponseEntity.status(401).build();
        }

        String email = oidcUser.getAttribute("email");
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("email", email);
        profile.put("picture", oidcUser.getAttribute("picture"));
        profile.put("role", isAdmin ? "ROLE_ADMIN" : "ROLE_USER");
        profile.put("name", oidcUser.getAttribute("name"));
        return ResponseEntity.ok(profile);
    }
}
