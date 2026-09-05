package com.nutrivision.mapper;

import com.nutrivision.dto.response.UserDto;
import com.nutrivision.dto.response.UserProfileDto;
import com.nutrivision.entity.Role;
import com.nutrivision.entity.User;
import com.nutrivision.entity.UserProfile;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) return null;

        Set<String> roles = user.getRoles() != null
                ? user.getRoles().stream().map(r -> r.getRoleName().name()).collect(Collectors.toSet())
                : Collections.emptySet();

        UserProfileDto profileDto = toProfileDto(user.getUserProfile());

        return new UserDto(
                user.getUserId(),
                user.getEmail(),
                user.getFullName(),
                user.getIsActive(),
                roles,
                profileDto,
                user.getCreatedAt()
        );
    }

    public UserProfileDto toProfileDto(UserProfile profile) {
        if (profile == null) return null;

        return new UserProfileDto(
                profile.getPhone(),
                profile.getAge(),
                profile.getGender(),
                profile.getDietaryPreference(),
                profile.getPreferredLanguage(),
                profile.getCity(),
                profile.getCountry()
        );
    }
}
