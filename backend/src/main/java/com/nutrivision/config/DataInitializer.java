package com.nutrivision.config;

import com.nutrivision.entity.Role;
import com.nutrivision.entity.RoleName;
import com.nutrivision.entity.User;
import com.nutrivision.entity.UserProfile;
import com.nutrivision.repository.RoleRepository;
import com.nutrivision.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap.email:admin@nutrivision.ai}")
    private String adminEmail;

    @Value("${app.admin.bootstrap.password:}")
    private String adminPassword;

    @Value("${app.admin.bootstrap.enabled:false}")
    private boolean bootstrapEnabled;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initializeRoles();
        if (bootstrapEnabled) {
            if (adminPassword == null || adminPassword.length() < 16) {
                throw new IllegalStateException("Admin bootstrap requires an explicit strong password of at least 16 characters.");
            }
            initializeAdminUser();
        }
    }

    private void initializeRoles() {
        if (roleRepository.findByRoleName(RoleName.ROLE_USER).isEmpty()) {
            roleRepository.save(new Role(RoleName.ROLE_USER, "Standard registered user with assessment and nutrition tracking access"));
            logger.info("Initialized default role: ROLE_USER");
        }

        if (roleRepository.findByRoleName(RoleName.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(RoleName.ROLE_ADMIN, "System administrator with administrative access"));
            logger.info("Initialized default role: ROLE_ADMIN");
        }
    }

    private void initializeAdminUser() {
        String cleanEmail = adminEmail.toLowerCase().trim();
        if (!userRepository.existsByEmail(cleanEmail)) {
            Role adminRole = roleRepository.findByRoleName(RoleName.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_ADMIN, "Administrator role")));
            Role userRole = roleRepository.findByRoleName(RoleName.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_USER, "Standard user role")));

            User admin = new User(
                    cleanEmail,
                    passwordEncoder.encode(adminPassword),
                    "NutriVision System Administrator"
            );
            admin.setRoles(Set.of(adminRole, userRole));

            UserProfile profile = new UserProfile(admin);
            profile.setDietaryPreference("ANY");
            profile.setPreferredLanguage("en");
            profile.setCity("Administrative Center");
            admin.setUserProfile(profile);

            userRepository.save(admin);
            logger.info("Successfully bootstrapped initial administrator account: {}", cleanEmail);
        }
    }
}
