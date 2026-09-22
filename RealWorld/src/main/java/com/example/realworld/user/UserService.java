package com.example.realworld.user;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Locale;
@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse findById(Long id){
        User user = userMapper.findById(id);
        if(user==null){
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }

    public UserResponse register(CreateUserRequest request){
        String normalizedEmail = request.getEmail().toLowerCase(Locale.ROOT);
        String normalizedUsername = request.getUsername().trim();
        User existingUser = userMapper.findByEmail(normalizedEmail);
        if(existingUser != null){
            throw new IllegalStateException("Email already exists");
        }
        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordHash);

        int affectedRows = userMapper.insert(user);

        if(affectedRows != 1){
            throw new IllegalStateException("Failed to insert user");
        }
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
