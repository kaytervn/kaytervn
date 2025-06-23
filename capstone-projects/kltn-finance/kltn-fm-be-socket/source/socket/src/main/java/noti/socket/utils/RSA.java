package noti.socket.utils;

import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import javax.crypto.Cipher;

/**
 * Created by Mac on 3/30/18.
 */
public class RSA {
    //https://gist.github.com/dmydlarz

    public static KeyPair buildKeyPair() throws NoSuchAlgorithmException {
        final int keySize = 2048;
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(keySize);
        return keyPairGenerator.genKeyPair();
    }

    public static byte[] encrypt(PrivateKey privateKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);

        return cipher.doFinal(message.getBytes());
    }

    public static byte[] encrypt(PublicKey publicKey, String message) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);

        return cipher.doFinal(message.getBytes());
    }

    public static byte[] decrypt(PublicKey publicKey, byte [] encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, publicKey);

        return cipher.doFinal(encrypted);
    }

    public static byte[] decrypt(PrivateKey privateKey, byte [] encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);

        return cipher.doFinal(encrypted);
    }

    public static PublicKey getPublicKey(byte[] encodedKey) throws Exception
    {
        KeyFactory factory = KeyFactory.getInstance("RSA");
        X509EncodedKeySpec encodedKeySpec = new X509EncodedKeySpec(encodedKey);
        return factory.generatePublic(encodedKeySpec);
    }

    public static byte[] getPrivateFromString(String pkcs8Pem){

        pkcs8Pem = pkcs8Pem.replace("-----BEGIN PRIVATE KEY-----", "");
        pkcs8Pem = pkcs8Pem.replace("-----END PRIVATE KEY-----", "");
        pkcs8Pem = pkcs8Pem.replaceAll("\\s+","");
        // Base64 decode the result
        return Base64.getDecoder().decode(pkcs8Pem);

    }
    public static PrivateKey getPrivateKey(byte[] encodedKey) throws Exception
    {

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encodedKey);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(keySpec);
    }


    public static void main(String [] args) throws Exception {
        // generate public and private keys
        KeyPair keyPair = buildKeyPair();

        PublicKey pubKey = keyPair.getPublic();
        PrivateKey privateKey = keyPair.getPrivate();


        System.out.println("public key ======> "+ Base64.getEncoder().encodeToString(pubKey.getEncoded()));
        System.out.println("private key ======> "+ Base64.getEncoder().encodeToString(privateKey.getEncoded()));

        // encrypt the message
        //byte [] encrypted = encrypt(privateKey, "This is a message");
        //byte [] encrypted = encrypt(getPrivateKey(privateKey.getEncoded()), "This is a secret message");
        //System.out.println(new String(encrypted));  // <<encrypted message>>
        byte [] encrypted = encrypt(pubKey, "This is a message");

        // decrypt the message
        //byte[] secret = decrypt(pubKey, encrypted);
        //byte[] secret = decrypt(getPublicKey(pubKey.getEncoded()), encrypted);
        byte[] secret = decrypt(privateKey, encrypted);
        System.out.println(new String(secret));     // This is a message
    }
}
