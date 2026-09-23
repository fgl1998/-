package com.example.realworld.user.controller;

import com.example.realworld.common.Result;
import com.example.realworld.user.dto.CreateUserRequest;
import com.example.realworld.user.dto.LoginRequest;
import com.example.realworld.user.dto.LoginResponse;
import com.example.realworld.user.dto.UserResponse;
import com.example.realworld.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public Result<UserResponse> findById(@PathVariable Long id){
//        @PathVariable 会把 URL 中的 1 转成：Long id = 1L;
        UserResponse user = userService.findById(id);
        if(user==null){
            return Result.error(404, "用户不存在");
        }
        return Result.success(user);
    }

    @PostMapping("/register")
    public Result<UserResponse> register(@Valid @RequestBody CreateUserRequest request){
        UserResponse user = userService.register(request);
        return Result.success(user);
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = userService.login(request);
        return Result.success(response);
    }
}
