package com.example.demo.generator;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HS256SecretKeyGenerator {
    static String ALGORITHM = "HmacSHA256";
    static String BASE_PATH = "src/main/resources/keystore/";

    public static void main(String[] args) throws NoSuchAlgorithmException, IOException {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String secretKey = generateHS256SecretKey();
        Files.write(Paths.get(BASE_PATH, "secretKey-" + timestamp), secretKey.getBytes());

        System.out.println("Secret key has been generated and saved in: " + BASE_PATH);
    }

    public static String generateHS256SecretKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);
        SecretKey secretKey = keyGen.generateKey();
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }
}
