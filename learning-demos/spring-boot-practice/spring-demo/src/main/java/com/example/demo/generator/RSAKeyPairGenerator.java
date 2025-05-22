package com.example.demo.generator;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RSAKeyPairGenerator {
    static String ALGORITHM = "RSA";
    static int KEY_SIZE = 2048;
    static String BASE_PATH = "src/main/resources/keystore/";

    public static void main(String[] args) throws Exception {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String resourcePath = BASE_PATH + "keyPair-" + timestamp + "/";

        KeyPair pair = generateKeyPair();
        String publicKey = encodeKey(pair.getPublic());
        String privateKey = encodeKey(pair.getPrivate());

        Files.createDirectories(Paths.get(resourcePath));
        writeKeyToFile(resourcePath, "public.key", publicKey);
        writeKeyToFile(resourcePath, "private.key", privateKey);

        System.out.println("Keys have been generated and saved in: " + resourcePath);
    }

    private static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance(ALGORITHM);
        keyGen.initialize(KEY_SIZE);
        return keyGen.generateKeyPair();
    }

    private static String encodeKey(Key key) {
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    private static void writeKeyToFile(String path, String fileName, String key) throws Exception {
        Files.write(Paths.get(path, fileName), key.getBytes());
    }
}