package com.example.demo.service;

import com.example.demo.configuration.locale.MessageUtil;
import com.example.demo.dto.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtService {

    static final boolean IS_RSA = true;
    static final Duration TOKEN_VALIDITY = Duration.ofHours(1);

    @Value("${jwt.signerKey}")
    String signerKey;

    @Value("${jwt.privateKey}")
    String privateKeyString;

    @Value("${jwt.publicKey}")
    String publicKeyString;

    PrivateKey privateKey;
    PublicKey publicKey;
    SecretKey secretKey;

    @PostConstruct
    public void init() throws Exception {
        if (IS_RSA) {
            privateKey = getPrivateKey();
            publicKey = getPublicKey();
        } else {
            secretKey = getSecretKey();
        }
    }

    public String generateToken(UserDetails user) {
        return generateToken(new HashMap<>(), user);
    }

    String generateToken(Map<String, Object> claims, UserDetails user) {
        Instant now = Instant.now();
        JwtBuilder jwtBuilder = Jwts.builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(TOKEN_VALIDITY)));

        if (IS_RSA) {
            jwtBuilder.signWith(privateKey, Jwts.SIG.RS256);
        } else {
            jwtBuilder.signWith(secretKey, Jwts.SIG.HS256);
        }

        return jwtBuilder.compact();
    }

    private PrivateKey getPrivateKey() throws Exception {
        byte[] decodedKey = Base64.getDecoder().decode(privateKeyString);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
        return KeyFactory.getInstance("RSA").generatePrivate(keySpec);
    }

    private PublicKey getPublicKey() throws Exception {
        byte[] decodedKey = Base64.getDecoder().decode(publicKeyString);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decodedKey);
        return KeyFactory.getInstance("RSA").generatePublic(keySpec);
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(signerKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(Date.from(Instant.now()));
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        return claimResolver.apply(extractAllClaims(token));
    }

    public Claims extractAllClaims(String token) {
        JwtParserBuilder parser = Jwts.parser();

        if (IS_RSA) {
            parser.verifyWith(publicKey);
        } else {
            parser.verifyWith(secretKey);
        }

        return parser.build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public void exceptionResponse(HttpServletResponse response, String messageCode) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .message(MessageUtil.getMessage(messageCode))
                .reasonPhrase(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .status(HttpStatus.UNAUTHORIZED.value())
                .build();
        ObjectMapper objectMapper = new ObjectMapper();
        response.getOutputStream().write(objectMapper.writeValueAsBytes(apiResponse));
        response.flushBuffer();
    }
}
