package com.msa.service;

import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class OTPService {
    private static final int TWO_HOURS = 2 * 60 * 60 * 1000;
    private final SecureRandom secureRandom;
    private final List<Integer> numberRand;
    private final Map<String, Long> storeOrderSttForCheck = new ConcurrentHashMap<>();

    public OTPService() throws NoSuchAlgorithmException {
        secureRandom = SecureRandom.getInstance("SHA1PRNG");
        numberRand = IntStream.range(0, 10).boxed().collect(Collectors.toList());
    }

    public synchronized String generate(int maxLength) {
        return secureRandom.ints(maxLength, 0, 10)
                .mapToObj(String::valueOf)
                .collect(Collectors.joining());
    }

    public synchronized String orderStt(Long idStore) {
        cleanupExpiredEntries();
        secureRandom.setSeed(idStore);
        String stt;
        do {
            Collections.shuffle(numberRand);
            stt = secureRandom.ints(4, 0, numberRand.size())
                    .mapToObj(numberRand::get)
                    .map(String::valueOf)
                    .collect(Collectors.joining());
        } while (storeOrderSttForCheck.putIfAbsent(stt, System.currentTimeMillis()) != null);
        return stt;
    }

    private void cleanupExpiredEntries() {
        long currentTime = System.currentTimeMillis();
        storeOrderSttForCheck.entrySet().removeIf(entry -> (currentTime - entry.getValue()) >= TWO_HOURS);
    }
}
