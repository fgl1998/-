package com.example.realworld.user.service;

import com.example.realworld.security.JwtService;
import com.example.realworld.user.dto.*;
import com.example.realworld.user.entity.User;
import com.example.realworld.user.exception.InvalidCredentialsException;
import com.example.realworld.user.exception.UserNotFoundException;
import com.example.realworld.user.mapper.UserMapper;
import com.example.realworld.user.exception.UserAlreadyExistsException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Locale;
import java.util.Map;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder,JwtService jwtService) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
//            throw new IllegalStateException("Email already exists");
            throw new UserAlreadyExistsException();
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

    public LoginResponse login(LoginRequest request){
        String username = request.getUsername();
        String password = request.getPassword();

        User existingUser = userMapper.findByUsername(username);
//        Map<String, Object> existingUser = userMapper.findByUsername(username);
        if(existingUser==null){
            throw new InvalidCredentialsException();
        }

        Boolean passwordMatch = passwordEncoder.matches(password, existingUser.getPasswordHash());

        if(!passwordMatch){
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(existingUser.getId(),existingUser.getUsername());

        return new LoginResponse(
                token,
                new UserResponse(
                        existingUser.getId(),
                        existingUser.getUsername(),
                        existingUser.getEmail()
                )
        );
    }

    public void updateUser(UpdateUserRequest request) {
        String password = request.getPassword();
        User user = new User();
        user.setEmail(request.getEmail());
        user.setBio(request.getBio());
        user.setImage(request.getImage());
        user.setId(request.getId());
        if (password != null) {
            String passwordHash = passwordEncoder.encode(password);
            user.setPasswordHash(passwordHash);
        }
        userMapper.update(user);
    }
}
