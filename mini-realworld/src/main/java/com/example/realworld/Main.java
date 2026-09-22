package com.example.realworld;

import com.example.realworld.user.*;
import com.example.realworld.common.AppException;
import com.example.realworld.user.UserHttpHandler;
import com.example.realworld.user.UserHttpHandler3;
import com.sun.net.httpserver.HttpServer;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Scanner;
import java.net.InetSocketAddress;
import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        System.out.println("Mini RealWorld 启动成功");
        String url = "jdbc:mysql://localhost:3306/realworld";
        String databaseUsername = "root";
        String databasePassword = "123456Aa!";
        HttpServer server = null;

        try (
                Connection connection = DriverManager.getConnection(
                        url,
                        databaseUsername,
                        databasePassword
                );
                Scanner scanner = new Scanner(System.in)
        ) {
            UserRepository userRepository=new JdbcUserRepository(connection);
            UserService userService=new UserService(userRepository);
            UserController userController=new UserController(userService);
            UserHttpHandler3 userHttpHandler3 = new UserHttpHandler3(userController);
            server = HttpServer.create(
                    new InetSocketAddress(8080),
                    0
            );
            server.createContext(
                    "/api/users",
                    exchange -> userHttpHandler3.getById(exchange)
            );
            server.createContext(
                    "/api/users/register",
                    userHttpHandler3::register
            );

            server.start();

            System.out.println(
                    "HTTP 服务启动成功"
            );

            System.out.println(
                    "访问：http://localhost:8080/api/users?id=16"
            );

            System.out.println(
                    "按回车键停止服务"
            );

            scanner.nextLine();



//            Long id=160L;
//            User user=userController.getUserById(id);
//
//            System.out.println(user);



        } catch (AppException e) {
            System.out.println("业务异常");
            System.out.println("HTTP 状态码：" + e.getHttpStatus());
            System.out.println("业务错误码：" + e.getCode());
            System.out.println("错误信息：" + e.getMessage());
        } catch (SQLException e) {
            System.out.println("数据库查询失败：" + e.getMessage());
            e.printStackTrace();
        } catch (RuntimeException e) {
            System.out.println("未知程序异常：" + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println(
                    "HTTP 服务启动失败：" + e.getMessage()
            );
            e.printStackTrace();

        }
    }
}