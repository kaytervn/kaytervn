package com.finance.utils;

import android.annotation.SuppressLint;

import com.finance.constant.Constants;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import timber.log.Timber;

public class DateUtils {
    public static String getMonthYear(String date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        String monthYear = "";
        try {
            Date date2 = dateFormat.parse(date);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date2);

            int month = calendar.get(Calendar.MONTH) + 1; // Adding 1 because Calendar.MONTH is zero-based
            int year = calendar.get(Calendar.YEAR);
            monthYear = month + "/" + year;

        }catch (ParseException e) {
            throw new RuntimeException(e);
        }
        return monthYear;
    }
    public static String getDayMonthYear(String date) {
        if (date == null || date.isEmpty()) {
            return "";
        }
        SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        String daymonthYear = "";
        try {
            Date date2 = dateFormat.parse(date);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date2);
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            int month = calendar.get(Calendar.MONTH) + 1; // Adding 1 because Calendar.MONTH is zero-based
            int year = calendar.get(Calendar.YEAR);
            daymonthYear = String.format("%02d/%02d/%04d", day, month, year);

        }catch (ParseException e) {
            Timber.d(e);
            throw new RuntimeException(e);
        }
        return daymonthYear;
    }
    public static String getMonth(String date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        String monthResult = "";
        try {
            Date date2 = dateFormat.parse(date);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date2);

            int month = calendar.get(Calendar.MONTH) + 1; // Adding 1 because Calendar.MONTH is zero-based
            monthResult = String.valueOf(month);

        }catch (ParseException e) {
            throw new RuntimeException(e);
        }
        return monthResult;
    }

    public static String convertFromUTCToDefault(String dateString){

        if(dateString == null){
            return "";
        }
        SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        inputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        SimpleDateFormat outputFormat = new SimpleDateFormat(Constants.DATE_TIME_FORMAT);
        outputFormat.setTimeZone(TimeZone.getDefault());
        Date date = null;
        try {
            date = inputFormat.parse(dateString);
        } catch (ParseException e) {
            Timber.d(e);
        }
        return outputFormat.format(date);
    }
    public static String convertFromDefaultToUTC(String dateString) {

        if (dateString == null) {
            return "";
        }
        SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        inputFormat.setTimeZone(TimeZone.getDefault());
        SimpleDateFormat outputFormat = new SimpleDateFormat(Constants.DATE_TIME_FORMAT);
        outputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date date = null;
        try {
            date = inputFormat.parse(dateString);
        } catch (ParseException e) {
            Timber.d(e);
        }
        return outputFormat.format(date);
    }

    public static String convertFromDefaultToUTCApi(String dateString) {

        if (dateString == null) {
            return "";
        }
        SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        inputFormat.setTimeZone(TimeZone.getDefault());
        SimpleDateFormat outputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        outputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date date = null;
        try {
            date = inputFormat.parse(dateString);
        } catch (ParseException e) {
            Timber.d(e);
        }
        return outputFormat.format(date);
    }

    public static String convertFromUTCToDefaultApi(String dateString){

        if(dateString == null || dateString.isEmpty()){
            return "";
        }
        SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        inputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        SimpleDateFormat outputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        outputFormat.setTimeZone(TimeZone.getDefault());
        Date date = null;
        try {
            date = inputFormat.parse(dateString);
        } catch (ParseException e) {
            Timber.d(e);
        }
        return outputFormat.format(date);
    }



    public static String dateFormat(String dateString){
        if(dateString == null){
            return "";
        }
        SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATE_FORMAT_FROM_API);
        inputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        SimpleDateFormat outputFormat = new SimpleDateFormat(Constants.DATE_TIME_FORMAT);
        outputFormat.setTimeZone(TimeZone.getDefault());
        Date date = null;
        try {
            date = inputFormat.parse(dateString);
        } catch (ParseException e) {
            Timber.d(e);
        }
        return outputFormat.format(date);
    }

    @SuppressLint("DefaultLocale")
    public static String getCurrentDateTime(){
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);
        int second = calendar.get(Calendar.SECOND);

        return String.format("%02d-%02d-%02d_%02d-%02d-%02d",hour, minute, second, day, month + 1, year );
    }

    public static String formatDateTimeMessage(String inputDateTime) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.getDefault());
            Date date = inputFormat.parse(inputDateTime);

            SimpleDateFormat outputFormat = new SimpleDateFormat("HH:mm dd/MM/yyyy", Locale.getDefault());
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return inputDateTime;
        }
    }

}
