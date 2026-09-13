package com.iot.security;

import com.iot.Config.CustomOidcUserService;
import com.iot.Config.OAuth2SuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOidcUserService customOidcUserService;

    public SecurityConfig(OAuth2SuccessHandler oAuth2SuccessHandler,
                          CustomOidcUserService customOidcUserService) {
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.customOidcUserService = customOidcUserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login/**", "/oauth2/**", "/favicon.ico", "/.well-known/**").permitAll()
                .requestMatchers("/api/rfid/find").permitAll()
                .requestMatchers(
                    "/api/auth/me",
                    "/api/auth/profile",
                    "/api/rfid/all",
                    "/api/rfid/allPresent",
                    "/api/rfid/lastScan",
                    "/api/rfid/lastScanTimestamp",
                    "/api/rfid/chart",
                    "/api/rfid/export/csv",
                    "/api/attendance/my"
                ).authenticated()
                .requestMatchers(
                    "/api/rfid/registerRfid",
                    "/api/rfid/update/**",
                    "/api/rfid/delete/**"
                ).hasAuthority("ROLE_ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(u -> u.oidcUserService(customOidcUserService))
                .successHandler(oAuth2SuccessHandler)
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
            );

        return http.build();
    }
}
