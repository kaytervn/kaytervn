package noti.socket.utils;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidParameterException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Created by mac on 6/22/16.
 */
public class AESUtils {
    //private static final String secretKey = "cututusethayema1";
    private static final String secretKey = "cututusethayema1cututusethayema1";
    public static void main(String...args)throws Exception{

        // create new key
//        SecretKey secretKey = KeyGenerator.getInstance("AES").generateKey();
//        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
//        System.out.println(encodedKey);
//        byte[] decodedKey = Base64.getDecoder().decode(encodedKey);
//        SecretKey originalKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
        String da = encrypt("Ngon rồi mà ta");
        System.out.println(da);
        System.out.println(decrypt(da));

    }

    public static  String encrypt(String inputFile) {
        return encrypt(secretKey, inputFile);
    }


    public static String decrypt(String input) {
        return decrypt(secretKey,input);
    }

    public static int getMaxLengAESKey(){
        try{
            //Security.setProperty("crypto.policy", "unlimited");
            int length = Cipher.getMaxAllowedKeyLength("AES");
            return length;
        }catch (Exception e){
            return 0;
        }

    }

    private static String encrypt(String encodekey, String inputStr) {
        try {
            Cipher cipher = Cipher.getInstance("AES");

            SecretKeySpec secretKeySpec = new SecretKeySpec(encodekey.getBytes("UTF-8"), "AES");

            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

            byte[] inputBytes = inputStr.getBytes("UTF-8");
            byte[] outputBytes = cipher.doFinal(inputBytes);

            return Base64.getEncoder().encodeToString(outputBytes);

        } catch (Exception  ex) {
            ex.printStackTrace();
        }
        return null;
    }


    private static String decrypt(String encodekey, String encrptedStr) {
        try {

            System.out.println("Max key lenght: "+getMaxLengAESKey());

            Cipher cipher = Cipher.getInstance("AES");
            SecretKeySpec secretKeySpec = new SecretKeySpec(encodekey.getBytes("UTF-8"), "AES");

            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            // decode with base64 to get bytes

            byte[] dec = Base64.getDecoder().decode(encrptedStr.getBytes("UTF-8"));
            byte[] utf8 = cipher.doFinal(dec);

            // create new string based on the specified charset
            return new String(utf8, "UTF8");

        } catch (Exception e) {

            e.printStackTrace();

        }
        return null;
    }


    private  SecretKey generateAESKey(int keysize)
            throws InvalidParameterException {
        try {
            if (Cipher.getMaxAllowedKeyLength("AES") < keysize) {
                // this may be an issue if unlimited crypto is not installed
                throw new InvalidParameterException("Key size of " + keysize
                        + " not supported in this runtime");
            }

            final KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(keysize);
            return keyGen.generateKey();
        } catch (final NoSuchAlgorithmException e) {
            // AES functionality is a requirement for any Java SE runtime
            throw new IllegalStateException(
                    "AES should always be present in a Java SE runtime", e);
        }
    }

    private  SecretKey decodeBase64ToAESKey(final String encodedKey)
            throws IllegalArgumentException {
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
            final SecretKeySpec aesKey = new SecretKeySpec(keyData, "AES");
            return aesKey;
        } catch (final NoSuchAlgorithmException e) {
            // AES functionality is a requirement for any Java SE runtime
            throw new IllegalStateException(
                    "AES should always be present in a Java SE runtime", e);
        }
    }

    private  String encodeAESKeyToBase64(final SecretKey aesKey)
            throws IllegalArgumentException {
        if (!aesKey.getAlgorithm().equalsIgnoreCase("AES")) {
            throw new IllegalArgumentException("Not an AES key");
        }

        final byte[] keyData = aesKey.getEncoded();
        final String encodedKey = Base64.getEncoder().encodeToString(keyData);
        return encodedKey;
    }


}
