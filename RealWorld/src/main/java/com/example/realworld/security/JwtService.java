package com.example.realworld.security;

import com.example.realworld.common.exception.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /**
     * 登录成功后生成 Token。
     */
    public String generateToken(
            Long userId,
            String username
    ) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                // subject 通常存用户唯一标识
                .subject(String.valueOf(userId))

                // 可以放一些非敏感信息
                .claim("username", username)

                // 签发时间
                .issuedAt(new Date(now))

                // 过期时间
                .expiration(new Date(now + expirationMs))

                // 使用密钥签名
                .signWith(secretKey)

                // 生成最终字符串
                .compact();
    }

    /**
     * 验证 Token 并取出 userId。
     */
    public Long getUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.valueOf(claims.getSubject());

        } catch (JwtException |
                 IllegalArgumentException exception) {
            /*
             * JwtException：
             * Token 格式错误、签名错误、无法解析等。
             *
             * IllegalArgumentException：
             * Token 为空、userId 无法转成 Long 等。
             */
            throw new UnauthorizedException(
                    "登录凭证无效，请重新登录"
            );
        }
    }
}