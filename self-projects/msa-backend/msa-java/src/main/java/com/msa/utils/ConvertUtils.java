package com.msa.utils;

import java.text.NumberFormat;

public class ConvertUtils {
    public static int convertToCent(double amount) {
        return (int) Math.round(amount);
    }

    public static Long convertStringToLong(String input) {
        try {
            return Long.parseLong(input);
        } catch (NumberFormatException e) {
            return 0L;
        }
    }

    public static String convertDoubleToString(Double value) {
        NumberFormat numberFormat = NumberFormat.getInstance();
        numberFormat.setMaximumFractionDigits(0);
        return numberFormat.format(value);
    }

    public static Integer parseInt(Object value, Integer defaultVal) {
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (Exception e) {
            return defaultVal;
        }
    }

    public static Long parseLong(Object value, Long defaultVal) {
        try {
            return Long.parseLong(String.valueOf(value));
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
