package com.master.utils;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

@Slf4j
public class AESUtils {
    public static String encrypt(String secretKey, String inputStr, boolean zipEnable) {
        try {
            if (inputStr == null) {
                return null;
            }
            Cipher cipher = Cipher.getInstance("AES");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            byte[] inputBytes = inputStr.getBytes(StandardCharsets.UTF_8);
            byte[] outputBytes = cipher.doFinal(inputBytes);

            if(zipEnable){
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                Deflater deflater = new Deflater();
                DeflaterOutputStream zip = new DeflaterOutputStream(stream, deflater);
                zip.write(outputBytes);
                zip.close();
                deflater.end();
                byte[] outDeflater = stream.toByteArray();
                return Base64.getEncoder().encodeToString(outDeflater);
            }else{
                return Base64.getEncoder().encodeToString(outputBytes);
            }
        } catch (Exception  ex) {
            log.error(ex.getMessage(),ex);
        }
        return null;
    }

    public static String decrypt(String secretKey, String encrptedStr, boolean zipEnable) {
        try {
            if (encrptedStr == null) {
                return null;
            }
            Cipher cipher = Cipher.getInstance("AES");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

            if(zipEnable){
                byte[] dec = Base64.getDecoder().decode(encrptedStr.getBytes(StandardCharsets.UTF_8));
                ByteArrayInputStream var2 = new ByteArrayInputStream(dec);
                InflaterInputStream var3 = new InflaterInputStream(var2, new Inflater());
                byte[] utf8 = cipher.doFinal(var3.readAllBytes());
                return new String(utf8, StandardCharsets.UTF_8);
            }else{
                byte[] dec = Base64.getDecoder().decode(encrptedStr.getBytes(StandardCharsets.UTF_8));
                byte[] utf8 = cipher.doFinal(dec);
                // create new string based on the specified charset
                return new String(utf8, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        return null;
    }

    public  SecretKey generateAESKey(int keysize) {
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
            log.error(e.getMessage(),e);
            return null;
        }
    }

    public  SecretKey decodeBase64ToAESKey(final String encodedKey){
        try {
            // throws IllegalArgumentException - if src is not in valid Base64
            // scheme
            final byte[] keyData = Base64.getDecoder().decode(encodedKey);
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
            log.error(e.getMessage(),e);
            return null;
        }
    }

    public  String encodeAESKeyToBase64(final SecretKey aesKey){
        if (!aesKey.getAlgorithm().equalsIgnoreCase("AES")) {
            throw new IllegalArgumentException("Not an AES key");
        }
        final byte[] keyData = aesKey.getEncoded();
        return Base64.getEncoder().encodeToString(keyData);
    }
}