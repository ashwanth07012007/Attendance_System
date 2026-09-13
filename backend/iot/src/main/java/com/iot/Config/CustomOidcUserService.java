package com.iot.Config;

import com.iot.entity.Role;
import com.iot.entity.User;
import com.iot.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomOidcUserService extends OidcUserService {

    private static final String ADMIN_EMAIL = "ashwanth.s2024ece@sece.ac.in";

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {

        OidcUser googleUser = super.loadUser(userRequest);

        String email   = googleUser.getAttribute("email");
        String name    = googleUser.getAttribute("name");
        String picture = googleUser.getAttribute("picture");

        if (email == null) throw new OAuth2AuthenticationException("Email not provided by Google");

        boolean isAdmin = email.equalsIgnoreCase(ADMIN_EMAIL);

        if (!isAdmin) {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setProvider("google");
            }
            user.setName(name);
            user.setPicture(picture);
            user.setRole(Role.ROLE_USER);
            userRepository.save(user);
        }

        Set<GrantedAuthority> authorities = new HashSet<>(googleUser.getAuthorities());
        authorities.add(new SimpleGrantedAuthority(isAdmin ? Role.ROLE_ADMIN.name() : Role.ROLE_USER.name()));

        return new DefaultOidcUser(authorities, googleUser.getIdToken(), googleUser.getUserInfo());
    }
}
