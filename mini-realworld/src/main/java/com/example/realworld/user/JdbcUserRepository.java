package com.example.realworld.user;

import java.sql.*;

public class JdbcUserRepository implements UserRepository {
    private final Connection connection;

    public JdbcUserRepository(Connection connection) {
        this.connection = connection;
    }

    @Override
    public User findById(Long id) {
        String sql = """
                SELECT id, username, email, password_hash
                FROM users
                WHERE id = ?
                LIMIT 1
                """;

        try (
                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {
            statement.setLong(1, id);

            try (
                    ResultSet resultSet =
                            statement.executeQuery()
            ) {
                if (!resultSet.next()) {
                    return null;
                }

                return new User(
                        resultSet.getLong("id"),
                        resultSet.getString("username"),
                        resultSet.getString("email"),
                        resultSet.getString("password_hash")
                );
            }

        } catch (SQLException e) {
            throw new RuntimeException("查询用户失败", e);
        }
    }

    @Override
    public User findByEmail(String email) {
        String sql = """
                SELECT id, username, email, password_hash
                FROM users
                WHERE email = ?
                LIMIT 1
                """;
        try (
                PreparedStatement statement =
                        connection.prepareStatement(sql)
        ) {
            statement.setString(1, email);
            try(
                    ResultSet resultSet =
                            statement.executeQuery()
                    ){
                if (!resultSet.next()) {
                    return null;
                }

                return mapUser(resultSet);
            }
        } catch (SQLException e) {
            throw new RuntimeException(
                    "根据邮箱查询用户失败",
                    e
            );
        }
    }

    @Override
    public Long create(
            String username,
            String email,
            String passwordHash
    ) {
        String sql = """
                INSERT INTO users (
                    username,
                    email,
                    password_hash
                )
                VALUES (?, ?, ?)
                """;

        try (
                PreparedStatement statement =
                        connection.prepareStatement(
                                sql,
                                Statement.RETURN_GENERATED_KEYS
                        )
        ) {
            statement.setString(1, username);
            statement.setString(2, email);
            statement.setString(3, passwordHash);

            int affectedRows =
                    statement.executeUpdate();

            if (affectedRows != 1) {
                throw new RuntimeException(
                        "创建用户失败"
                );
            }

            try (
                    ResultSet generatedKeys =
                            statement.getGeneratedKeys()
            ) {
                if (!generatedKeys.next()) {
                    throw new RuntimeException(
                            "没有获取到用户 ID"
                    );
                }

                return generatedKeys.getLong(1);
            }

        } catch (
                SQLIntegrityConstraintViolationException e
        ) {
            throw new UserAlreadyExistsException();

        } catch (SQLException e) {
            throw new RuntimeException(
                    "创建用户失败",
                    e
            );
        }
    }

    private User mapUser(ResultSet resultSet)
            throws SQLException {

        return new User(
                resultSet.getLong("id"),
                resultSet.getString("username"),
                resultSet.getString("email"),
                resultSet.getString("password_hash")
        );
    }


}
