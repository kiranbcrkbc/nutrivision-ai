package com.nutrivision.service;

import com.nutrivision.dto.request.LoginRequest;
import com.nutrivision.dto.request.RegisterRequest;
import com.nutrivision.dto.response.AuthResponse;
import com.nutrivision.dto.response.UserDto;
import com.nutrivision.entity.Role;
import com.nutrivision.entity.RoleName;
import com.nutrivision.entity.User;
import com.nutrivision.entity.UserProfile;
import com.nutrivision.mapper.UserMapper;
import com.nutrivision.repository.RoleRepository;
import com.nutrivision.repository.UserRepository;
import com.nutrivision.security.CustomUserDetails;
import com.nutrivision.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.userMapper = userMapper;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email address already exists.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        Role userRole = roleRepository.findByRoleName(RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_USER, "Standard user role")));

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim()
        );
        user.setRoles(Set.of(userRole));

        // Create default empty profile
        UserProfile profile = new UserProfile(user);
        user.setUserProfile(profile);

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = tokenProvider.generateTokenFromUserDetails(userDetails);
        UserDto userDto = userMapper.toDto(savedUser);

        return new AuthResponse(token, tokenProvider.getExpirationTimeMs(), userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new IllegalStateException("Your account has been deactivated. Please contact support.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = tokenProvider.generateTokenFromUserDetails(userDetails);
        UserDto userDto = userMapper.toDto(user);

        return new AuthResponse(token, tokenProvider.getExpirationTimeMs(), userDto);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return userMapper.toDto(user);
    }
}
