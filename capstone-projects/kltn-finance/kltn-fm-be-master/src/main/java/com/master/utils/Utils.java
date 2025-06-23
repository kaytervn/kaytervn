package com.master.utils;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.Random;

@Slf4j
public class Utils {
    private static SecretKeySpec secretKey;
    private static byte[] key;

    public static void setKey() {
        MessageDigest sha = null;
        try {
            key = "kpE8wG5jEX".getBytes("UTF-8");
            sha = MessageDigest.getInstance("SHA-1");
            key = sha.digest(key);
            key = Arrays.copyOf(key, 16);
            secretKey = new SecretKeySpec(key, "AES");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    public static String encrypt(String strToEncrypt) {
        try {
            setKey();
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return Base64.getUrlEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String decrypt(String strToDecrypt) {
        try {
            strToDecrypt = strToDecrypt.replace("/", "_").replaceAll("\\+", "-");
            setKey();
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return new String(cipher.doFinal(Base64.getUrlDecoder().decode(strToDecrypt)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String generateRandomString(String prefix) throws NoSuchAlgorithmException {
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddhhmmssssss");
        Date date = new Date();
        String result = format.format(date);
        Random random = SecureRandom.getInstanceStrong();
        result += random.nextInt(9);
        if (prefix == null) {
            return result;
        } else {
            return prefix + "-" + result;
        }
    }

    public static String generateRandomStringSS(String prefix) throws NoSuchAlgorithmException {
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddhhmmss");
        Date date = new Date();
        String result = format.format(date);
        Random random = SecureRandom.getInstanceStrong();
        result += random.nextInt(9);
        if (prefix == null) {
            return result;
        } else {
            return prefix + "-" + result;
        }
    }

    public static void main(String[] args) throws NoSuchAlgorithmException {
        final String secretKey = "kpE8wG5jEX";
    }
}
