package com.tenant;

import com.tenant.utils.GenerateUtils;
import com.tenant.utils.RSAUtils;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import javax.annotation.PostConstruct;
import java.security.KeyPair;
import java.util.Date;
import java.util.TimeZone;

@SpringBootApplication
@EnableAsync
@EnableFeignClients
@EnableScheduling
@EnableAspectJAutoProxy
public class Application {

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        System.out.println("Spring boot application running in UTC timezone :" + new Date());
    }

    public static void main(String[] args) {
        //initSystemKey();
        SpringApplication.run(Application.class, args);
    }


    public static void initSystemKey(){
        KeyPair keyPair = RSAUtils.generateKeyPair();
        String pub = RSAUtils.keyToString(keyPair.getPublic());
        String priv = RSAUtils.keyToString(keyPair.getPrivate());

        String keyService = GenerateUtils.generateRandomString(16);
        keyService = RSAUtils.encrypt(pub,keyService);

        String keyKeyService = GenerateUtils.generateRandomString(16);
        keyKeyService = RSAUtils.encrypt(pub,keyKeyService);

        System.out.println("pub: "+pub);
        System.out.println("Private: "+priv);
        System.out.println("keyService: "+keyService);
        System.out.println("keyKeyService: "+keyKeyService);
    }
}