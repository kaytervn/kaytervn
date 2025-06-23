package com.tenant.utils;

import java.text.DecimalFormat;

public class ConvertUtils {

    private ConvertUtils(){
    }

    public static Long convertStringToLong(String input){
        try {
            return  Long.parseLong(input);
        }catch (Exception e){
            return  Long.valueOf(0);
        }
    }

    public static int convertToCent(double b){
        int i=(int)(b);
        double k = b-(double)i;
        if(k>0.5 && k<1){
            i+=1;
        }
        return i;
    }

    public static String convertDoubleToString(Double value) {
        DecimalFormat decimalFormat = new DecimalFormat("#");
        decimalFormat.setMaximumFractionDigits(0);
        return decimalFormat.format(value);
    }
}
