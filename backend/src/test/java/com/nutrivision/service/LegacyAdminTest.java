package com.nutrivision.service;

import com.nutrivision.config.DataInitializer;
import com.nutrivision.entity.*;
import com.nutrivision.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class LegacyAdminTest {
    @Test void publishedCredentialIsDisabledButChangedPasswordIsPreserved() {
        var roles = mock(RoleRepository.class);
        var users = mock(UserRepository.class);
        var encoder = mock(PasswordEncoder.class);
        when(roles.findByRoleName(any())).thenReturn(Optional.of(new Role(RoleName.ROLE_USER, "user")));
        var legacy = new User("admin@nutrivision.ai", "old-hash", "Admin");
        when(users.findByEmail("admin@nutrivision.ai")).thenReturn(Optional.of(legacy));
        when(encoder.matches("Admin@NutriVision2026", "old-hash")).thenReturn(true);
        var initializer = new DataInitializer(roles, users, encoder);
        initializer.run();
        assertFalse(legacy.getIsActive());
        var changed = new User("admin@nutrivision.ai", "private-hash", "Admin");
        when(users.findByEmail("admin@nutrivision.ai")).thenReturn(Optional.of(changed));
        initializer.run();
        assertTrue(changed.getIsActive());
        verify(users, never()).save(changed);
    }
}
