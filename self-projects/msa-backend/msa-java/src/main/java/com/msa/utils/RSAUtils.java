package com.msa.utils;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.KeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Slf4j
public class RSAUtils {
    private static final String RSA_ALGORITHM = "RSA";
    private static final int KEY_SIZE = 512;

    public static String encrypt(String publicKeyStr, String data) {
        return performCipherOperation(publicKeyStr, data.getBytes(StandardCharsets.UTF_8), Cipher.ENCRYPT_MODE, true);
    }

    public static String decrypt(String privateKeyStr, String encryptedData) {
        return performCipherOperation(privateKeyStr, Base64.getDecoder().decode(encryptedData), Cipher.DECRYPT_MODE, false);
    }

    private static String performCipherOperation(String keyStr, byte[] inputData, int cipherMode, boolean isPublicKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance(RSA_ALGORITHM);
            KeySpec keySpec = isPublicKey ? new X509EncodedKeySpec(Base64.getDecoder().decode(keyStr))
                    : new PKCS8EncodedKeySpec(Base64.getDecoder().decode(keyStr));
            Key key = isPublicKey ? keyFactory.generatePublic(keySpec) : keyFactory.generatePrivate(keySpec);
            Cipher cipher = Cipher.getInstance(RSA_ALGORITHM);
            cipher.init(cipherMode, key);
            byte[] outputBytes = cipher.doFinal(inputData);
            return cipherMode == Cipher.ENCRYPT_MODE ? Base64.getEncoder().encodeToString(outputBytes)
                    : new String(outputBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error during {} operation: {}", cipherMode == Cipher.ENCRYPT_MODE ? "encryption" : "decryption", e.getMessage(), e);
            return null;
        }
    }

    public static KeyPair generateKeyPair() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
            keyPairGenerator.initialize(KEY_SIZE);
            return keyPairGenerator.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
            log.error("Error generating key pair: {}", e.getMessage(), e);
            return null;
        }
    }

    public static String keyToString(Key key) {
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }
}