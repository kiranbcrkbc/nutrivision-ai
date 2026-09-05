package com.nutrivision.service;

import com.nutrivision.dto.request.UpdateProfileRequest;
import com.nutrivision.dto.response.UserDto;
import com.nutrivision.dto.response.UserProfileDto;
import com.nutrivision.entity.User;
import com.nutrivision.entity.UserProfile;
import com.nutrivision.mapper.UserMapper;
import com.nutrivision.repository.UserProfileRepository;
import com.nutrivision.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile(user);
        }

        return userMapper.toProfileDto(profile);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile(user);
            user.setUserProfile(profile);
        }

        if (request.getPhone() != null) profile.setPhone(request.getPhone().trim());
        if (request.getAge() != null) profile.setAge(request.getAge());
        if (request.getGender() != null) profile.setGender(request.getGender().trim());
        if (request.getDietaryPreference() != null) profile.setDietaryPreference(request.getDietaryPreference().trim());
        if (request.getPreferredLanguage() != null) profile.setPreferredLanguage(request.getPreferredLanguage().trim());
        if (request.getCity() != null) profile.setCity(request.getCity().trim());
        if (request.getCountry() != null) profile.setCountry(request.getCountry().trim());

        userProfileRepository.save(profile);
        User savedUser = userRepository.save(user);

        return userMapper.toDto(savedUser);
    }
}
