package com.example.realworld.user;

public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }
    public User getUserById(Long id){
        return  userService.getUserById(id);
    }
    public User register(
            CreateUserRequest request
    ) {
        return userService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );
    }
}
