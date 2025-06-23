package com.finance.data;

import com.finance.constant.Constants;

import lombok.Getter;
import lombok.Setter;

public class SecretKey implements Runnable{
    private String key;
    private Long lastTimeGetKey;
    @Getter
    private static SecretKey instance = new SecretKey();
    private Boolean isRunning = false;

    @Setter
    @Getter
    private SecretKeyListener secretKeyListener;

    public interface SecretKeyListener {
        void validKey();
        void invalidKey();
    }

    public synchronized void setKey(String key) {
        this.key = key;
        if (!isRunning) {
            isRunning = true;
            new Thread(this).start();
        }
        lastTimeGetKey = System.currentTimeMillis();
        if (key != null) {
            secretKeyListener.validKey();
        }
    }

    public synchronized String getKey() {
        lastTimeGetKey = System.currentTimeMillis();
        return key;
    }


    @Override
    public void run() {
        synchronized (this) {
            while (isRunning) {
                try {
                    if (lastTimeGetKey != null && System.currentTimeMillis() - lastTimeGetKey > Constants.KEY_EXPIRE_TIME) {
                        lastTimeGetKey = null;
                        key = null;
                        isRunning = false;
                        secretKeyListener.invalidKey();
                    }
                    wait(150L);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
