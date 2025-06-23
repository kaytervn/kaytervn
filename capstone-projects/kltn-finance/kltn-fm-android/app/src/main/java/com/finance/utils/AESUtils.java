package com.finance.utils;

import static java.util.Base64.*;

import android.os.Build;
import android.util.Base64;

import java.nio.charset.StandardCharsets;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import timber.log.Timber;

public class AESUtils {
    public static String encrypt(String secretKey, String inputStr, boolean b)  {
        if (inputStr == null || secretKey == null) {
            throw new IllegalArgumentException("Input string and secret key must not be null");
        }

        // Validate key length (AES requires 16, 24, or 32 bytes)
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length != 16 && keyBytes.length != 24 && keyBytes.length != 32) {
            throw new IllegalArgumentException("Invalid key length: must be 16, 24, or 32 bytes");
        }

        try {
            // Initialize cipher with AES/ECB/PKCS5Padding to match CryptoJS
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

            // Encrypt the input
            byte[] inputBytes = inputStr.getBytes(StandardCharsets.UTF_8);
            byte[] encryptedBytes = cipher.doFinal(inputBytes);

            // Encode to Base64 without line breaks
            return Base64.encodeToString(encryptedBytes, Base64.NO_WRAP);
        } catch (Exception e) {
            Timber.e(e, "Encryption failed");
        }
        return secretKey;
    }


    public static String decrypt(String secretKey, String encryptedStr, boolean zipEnable) {
        if(encryptedStr == null){
            return null;
        }
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS7Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

            byte[] decodedBytes = Base64.decode(encryptedStr, Base64.DEFAULT);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
//            Timber.d(e);
        }
        return null;
    }
    public static String decrypt(String secretKey, String encryptedStr) {
        if(encryptedStr == null){
            return null;
        }
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS7Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

            byte[] decodedBytes = Base64.decode(encryptedStr, Base64.DEFAULT);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
//            Timber.d(e);
        }
        return null;
    }
    public static String decryptPadding5(String secretKey, String encryptedStr, boolean zipEnable) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

            byte[] decodedBytes = Base64.decode(encryptedStr, Base64.DEFAULT);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            Timber.d(e);
        }
        return null;
    }

    public SecretKey generateAESKey(int keysize) {
        try {
            if (Cipher.getMaxAllowedKeyLength("AES") < keysize) {
                // this may be an issue if unlimited crypto is not installed
                throw new InvalidParameterException("Key size of " + keysize + " not supported in this runtime");
            }
            final KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(keysize);
            return keyGen.generateKey();
        } catch (final NoSuchAlgorithmException e) {
            // AES functionality is a requirement for any Java SE runtime
            Timber.d(e);
            return null;
        }
    }

    public  SecretKey decodeBase64ToAESKey(final String encodedKey){
        try {
            // throws IllegalArgumentException - if src is not in valid Base64
            // scheme
            byte[] keyData = new byte[0];
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                keyData = getDecoder().decode(encodedKey);
            }
            final int keysize = keyData.length * Byte.SIZE;

            // this should be checked by a SecretKeyFactory, but that doesn't exist for AES
            switch (keysize) {
                case 128:
                case 192:
                case 256:
                    break;
                default:
                    throw new IllegalArgumentException("Invalid key size for AES: " + keysize);
            }
            if (Cipher.getMaxAllowedKeyLength("AES") < keysize) {
                // this may be an issue if unlimited crypto is not installed
                throw new IllegalArgumentException("Key size of " + keysize
                        + " not supported in this runtime");
            }

            // throws IllegalArgumentException - if key is empty
            return  new SecretKeySpec(keyData, "AES");
        } catch (final NoSuchAlgorithmException e) {
            // AES functionality is a requirement for any Java SE runtime
            Timber.d(e);
            return null;
        }
    }

    public  String encodeAESKeyToBase64(final SecretKey aesKey){
        if (!aesKey.getAlgorithm().equalsIgnoreCase("AES")) {
            throw new IllegalArgumentException("Not an AES key");
        }
        final byte[] keyData = aesKey.getEncoded();
        return Base64.encodeToString(keyData, Base64.DEFAULT);
    }

}
