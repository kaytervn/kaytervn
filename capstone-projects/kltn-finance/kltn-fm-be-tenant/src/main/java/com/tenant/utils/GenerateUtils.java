package com.tenant.utils;

import org.apache.commons.lang.RandomStringUtils;

/***
 *  Tao 2 secrect key: Dung ham generateRandomString() tao 2 key: 1 key cho keyService, 1 key cho transaction
 *  Tao 1 key pair: public key va private RSAUtils.generateKeyPair()
 *  Dung public key encrypt 2 secrect key,  RSAUtils.encrypt()
 *
 */

public class GenerateUtils {
    public static String generateRandomString(int length) {
        return RandomStringUtils.randomAlphanumeric(length).toLowerCase();
    }
}
