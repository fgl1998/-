package com.example.realworld.user;

import com.example.realworld.common.PasswordUtil;

import java.util.Locale;

public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    public User getUserById(Long id){
        User user = userRepository.findById(id);
        if(user==null){
//            throw new RuntimeException("用户不存在");
            throw new UserNotFoundException();
        }
        return user;
    }
    public User register(
            String username,
            String email,
            String password
    ) {
        String normalizedUsername =
                username.trim();

        String normalizedEmail =
                email.trim()
                        .toLowerCase(Locale.ROOT);

        User existingUser =
                userRepository.findByEmail(
                        normalizedEmail
                );

        if (existingUser != null) {
            throw new UserAlreadyExistsException();
        }

        String passwordHash =
                PasswordUtil.hash(password);

        Long userId =
                userRepository.create(
                        normalizedUsername,
                        normalizedEmail,
                        passwordHash
                );

        User createdUser =
                userRepository.findById(userId);

        if (createdUser == null) {
            throw new RuntimeException(
                    "用户创建成功，但查询创建结果失败"
            );
        }

        return createdUser;
    }
}
