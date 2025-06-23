package com.finance.utils;

import android.content.Context;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

import com.finance.constant.Constants;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.util.Locale;

public class NumberUtils {

    private NumberUtils(){
        //do not initial me
    }
    public static String custom_money(Double money) {
        if (money >= 0){
            Long custom_money = money.longValue();
            String custom_money_string = "";
            while (custom_money / 1000 != 0){
                Long temp =  custom_money % 1000;
                if (temp < 10){
                    custom_money_string = ",00" + String.valueOf(temp) + custom_money_string;
                } else if (temp < 100){
                    custom_money_string = ",0" + String.valueOf(temp) + custom_money_string;
                } else {
                    custom_money_string = "," + String.valueOf(temp) + custom_money_string;
                }
                custom_money = custom_money / 1000;
            }
            custom_money_string = String.valueOf(custom_money) + custom_money_string + Constants.MONEY_UNIT;
            return custom_money_string;
        } else {
            money = Math.abs(money);
            Long custom_money = money.longValue();
            String custom_money_string = "";
            while (custom_money / 1000 != 0){
                Long temp =  custom_money % 1000;
                if (temp < 10){
                    custom_money_string = ",00" + String.valueOf(temp) + custom_money_string;
                } else if (temp < 100){
                    custom_money_string = ",0" + String.valueOf(temp) + custom_money_string;
                } else {
                    custom_money_string = "," + String.valueOf(temp) + custom_money_string;
                }
                custom_money = custom_money / 1000;
            }
            custom_money_string = "-" + (custom_money) + custom_money_string + Constants.MONEY_UNIT;
            return custom_money_string;
        }
    }
    public static String custom_money_my_tran(Double money, Integer kind) {
        Long custom_money = money.longValue();
        String custom_money_string = "";
        while (custom_money / 1000 != 0){
            Long temp =  custom_money % 1000;
            if (temp < 10){
                custom_money_string = ",00" + String.valueOf(temp) + custom_money_string;
            } else if (temp < 100){
                custom_money_string = ",0" + String.valueOf(temp) + custom_money_string;
            } else {
                custom_money_string = "," + String.valueOf(temp) + custom_money_string;
            }
            custom_money = custom_money / 1000;
        }
        if (kind == 1){
            custom_money_string = (custom_money) + custom_money_string;
        } else {
            custom_money_string = "-" +(custom_money) + custom_money_string;
        }

        return custom_money_string;
    }

    public static String custom_money_debit(Double money, Integer kind) {
        Long custom_money = money.longValue();
        String custom_money_string = "";
        while (custom_money / 1000 != 0){
            Long temp =  custom_money % 1000;
            if (temp < 10){
                custom_money_string = ",00" + String.valueOf(temp) + custom_money_string;
            } else if (temp < 100){
                custom_money_string = ",0" + String.valueOf(temp) + custom_money_string;
            } else {
                custom_money_string = "," + String.valueOf(temp) + custom_money_string;
            }
            custom_money = custom_money / 1000;
        }
        custom_money_string = (custom_money) + custom_money_string;

        return custom_money_string;
    }
    public static String custom_money_debit(Double money) {
        Long custom_money = money.longValue();
        String custom_money_string = "";
        while (custom_money / 1000 != 0){
            Long temp =  custom_money % 1000;
            if (temp < 10){
                custom_money_string = ",00" + String.valueOf(temp) + custom_money_string;
            } else if (temp < 100){
                custom_money_string = ",0" + String.valueOf(temp) + custom_money_string;
            } else {
                custom_money_string = "," + String.valueOf(temp) + custom_money_string;
            }
            custom_money = custom_money / 1000;
        }
        custom_money_string = (custom_money) + custom_money_string;
        return custom_money_string;
    }
    public static String custom_money_not_currency(Double money) {
        Long custom_money = money.longValue();
        String custom_money_string = "";
        while (custom_money / 1000 != 0){
            Long temp =  custom_money % 1000;
            if (temp < 10){
                custom_money_string = ",00" + String.valueOf(temp) + custom_money_string;
            } else if (temp < 100){
                custom_money_string = ",0" + String.valueOf(temp) + custom_money_string;
            } else {
                custom_money_string = "," + String.valueOf(temp) + custom_money_string;
            }
            custom_money = custom_money / 1000;
        }
        custom_money_string = custom_money + custom_money_string;
        return custom_money_string;
    }

    public static String formatNumber(String input) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        long parsed;
        try {
            parsed = Long.parseLong(input.replace(",", ""));
        } catch (NumberFormatException e) {
            return input;
        }
        return NumberFormat.getNumberInstance(Locale.US).format(parsed);
    }
    public static String unFormatNumber(String formattedNumber) {
        if (formattedNumber == null || formattedNumber.isEmpty()) {
            return "";
        }
        return formattedNumber.replace(",", "");
    }

    public static String formatDoubleToCurrency(Double db)
    {
        if(db == null){
            db = 0.0;
        }
        //currency_ratio: 1000
        db = db/1000;

        DecimalFormatSymbols decimalFormatSymbols = new DecimalFormatSymbols();
        decimalFormatSymbols.setDecimalSeparator(Constants.DECIMAL_SEPARATOR.charAt(0));
        decimalFormatSymbols.setGroupingSeparator(Constants.GROUP_SEPARATOR.charAt(0));

        DecimalFormat decimalFormat = new DecimalFormat();
        decimalFormat.setDecimalFormatSymbols(decimalFormatSymbols);
        if(db >= 1){
            decimalFormat.setMaximumFractionDigits(3);
            decimalFormat.setMinimumFractionDigits(3);
        }else {
            db = db*1000;
            decimalFormat.setMaximumFractionDigits(0);
            decimalFormat.setMinimumFractionDigits(0);
        }
        return decimalFormat.format(db) +" "+ Constants.MONEY_UNIT;
    }

}
