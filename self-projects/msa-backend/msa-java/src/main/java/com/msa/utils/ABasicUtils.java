package com.msa.utils;

import lombok.extern.slf4j.Slf4j;

import java.net.URL;

@Slf4j
public class ABasicUtils {
    public static boolean isValidUrl(String url) {
        try {
            new URL(url);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
