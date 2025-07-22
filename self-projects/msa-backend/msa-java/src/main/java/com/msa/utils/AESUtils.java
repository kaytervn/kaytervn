package com.msa.utils;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Slf4j
public final class AESUtils {
    private static final String AES_ALGORITHM = "AES";
    private static final boolean ZIP_ENABLED = false;

    public static String encrypt(String secretKey, String inputStr) {
        try {
            Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), AES_ALGORITHM));
            byte[] outputBytes = cipher.doFinal(inputStr.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(ZIP_ENABLED ? zip(outputBytes) : outputBytes);
        } catch (Exception ex) {
            return null;
        }
    }

    public static String decrypt(String secretKey, String encryptedStr) {
        try {
            Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), AES_ALGORITHM));
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedStr.getBytes(StandardCharsets.UTF_8));
            byte[] decryptedBytes = cipher.doFinal(ZIP_ENABLED ? unzip(decodedBytes) : decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return null;
        }
    }

    private static byte[] zip(byte[] input) throws Exception {
        Deflater deflater = new Deflater();
        deflater.setInput(input);
        deflater.finish();
        byte[] output = new byte[input.length];
        int compressedSize = deflater.deflate(output);
        deflater.end();
        return java.util.Arrays.copyOf(output, compressedSize);
    }

    private static byte[] unzip(byte[] input) throws Exception {
        Inflater inflater = new Inflater();
        inflater.setInput(input);
        byte[] output = new byte[input.length * 2];
        int uncompressedSize = inflater.inflate(output);
        inflater.end();
        return java.util.Arrays.copyOf(output, uncompressedSize);
    }

    public static SecretKey generateAESKey(int keysize) {
        try {
            if (Cipher.getMaxAllowedKeyLength(AES_ALGORITHM) < keysize) {
                throw new InvalidParameterException("Key size of " + keysize + " not supported in this runtime");
            }
            KeyGenerator keyGen = KeyGenerator.getInstance(AES_ALGORITHM);
            keyGen.init(keysize);
            return keyGen.generateKey();
        } catch (NoSuchAlgorithmException e) {
            log.error("AES key generation failed", e);
            return null;
        }
    }

    public static SecretKey decodeBase64ToAESKey(String encodedKey) {
        byte[] keyData = Base64.getDecoder().decode(encodedKey);
        return new SecretKeySpec(keyData, AES_ALGORITHM);
    }

    public static String encodeAESKeyToBase64(SecretKey aesKey) {
        return Base64.getEncoder().encodeToString(aesKey.getEncoded());
    }
}