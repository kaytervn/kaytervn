package com.master.service;

import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MasterOTPService {
    public static final int TWO_HOUR = 2 * 60 * 60 * 1000;
    private final SecureRandom secureRandom;
    private List<Integer> numberRand = new ArrayList<>();

    private Map<String, Long> storeOrderSttForCheck = new ConcurrentHashMap<>();

    public MasterOTPService() throws NoSuchAlgorithmException {
        secureRandom = SecureRandom.getInstance("SHA1PRNG");
        for (int i = 0; i < 10; i++) {
            numberRand.add(i);
        }
    }

    public synchronized String generate(int maxLength) {
        final StringBuilder otp = new StringBuilder(maxLength);
        for (int i = 0; i < maxLength; i++) {
            otp.append(secureRandom.nextInt(9));
        }
        return otp.toString();
    }

    public synchronized String orderStt(Long idStore) {
        //delelete key has valule > 2hour
        Set<String> keys = storeOrderSttForCheck.keySet();
        Iterator<String> iterator = keys.iterator();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Long value = storeOrderSttForCheck.get(key);
            if ((System.currentTimeMillis() - value) >= TWO_HOUR) {
                storeOrderSttForCheck.remove(key);
            }
        }
        StringBuilder builder = new StringBuilder();
        secureRandom.setSeed(idStore);
        while (true) {
            Collections.shuffle(numberRand);
            for (int i = 0; i < 4; i++) {
                builder.append(numberRand.get(secureRandom.nextInt(9)));
            }
            String stt = builder.toString();
            if (!storeOrderSttForCheck.containsKey(stt)) {
                storeOrderSttForCheck.put(stt, System.currentTimeMillis());
                break;
            }
        }
        return builder.toString();
    }
}
