package com.iot.Config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {
        // DB save is handled in CustomOidcUserService — no duplicate save here
        String host = request.getHeader("X-Forwarded-Host");
        if (host == null || host.isBlank()) host = request.getServerName();
        response.sendRedirect("http://" + host + ":5173/dashboard");
    }
}
