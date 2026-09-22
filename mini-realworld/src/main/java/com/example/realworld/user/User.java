package com.example.realworld.user;

public class User {
    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    public String myid;

    public User(
            Long id,
            String username,
            String email,
            String passwordHash
    ){
        this.id=id;
        this.username=username;
        this.email=email;
        this.passwordHash=passwordHash;
        this.myid="22222";
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + passwordHash + '\'' +
                '}';
    }
}
