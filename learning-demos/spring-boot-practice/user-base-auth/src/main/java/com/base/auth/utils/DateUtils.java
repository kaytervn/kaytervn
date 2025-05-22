package com.base.auth.utils;


import lombok.extern.slf4j.Slf4j;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

@Slf4j
public class DateUtils {

	public static final String FORMAT_DATE = "dd/MM/yyyy HH:mm:ss";


	private DateUtils(){

	}

	public static Date convertToDateViaInstant(LocalDate dateToConvert) {
        return Date.from(dateToConvert.atStartOfDay()
          .atZone(ZoneId.systemDefault())
          .toInstant());
    }
	
	public static String formatDate(Date date) {
		SimpleDateFormat format = new SimpleDateFormat(FORMAT_DATE);
		return format.format(date);
	}

	public static String formatDate(Date date, String format ) {
		SimpleDateFormat fm  = new SimpleDateFormat(format);
		return fm.format(date);
	}
	public static Date converDate(String date, String format) {

		try {
			SimpleDateFormat fm = new SimpleDateFormat(format);
			return fm.parse(date);
		} catch (Exception e) {
			log.error(e.getMessage(),e);
		}
		return null;
	}
	
	public static Date converDate(String date) {
		
		try {
			SimpleDateFormat format = new SimpleDateFormat(FORMAT_DATE);
			return format.parse(date);
		} catch (Exception e) {
			log.error(e.getMessage(),e);
		}
		return null;
	}
	public static boolean isInRangeXMinutesAgo(Date date, int minutes) {
	    Instant instant = Instant.ofEpochMilli(date.getTime());
	    Instant minutesAgo = Instant.now().minus(Duration.ofMinutes(minutes));

	    try {
	        return minutesAgo.isBefore(instant);
	    } catch (Exception e) {
			log.error(e.getMessage(),e);
	    }
	    return false;
	}
	public static boolean isAtLeastXSecondsAgo(Date date, int seconds) {
	    Instant instant = Instant.ofEpochMilli(date.getTime());
	    Instant secondsAgo = Instant.now().minus(Duration.ofSeconds(seconds));

	    try {
	        return instant.isBefore(secondsAgo);
	    } catch (Exception e) {
			log.error(e.getMessage(),e);
	    }
	    return false;
	}

	public static Date startOfDay(Date date) {
		OffsetDateTime offsetDateTime = date.toInstant()
				.atOffset(ZoneOffset.UTC);
		OffsetDateTime reallyStartOfDay = offsetDateTime.withHour(0).withMinute(0).withSecond(0).withNano(000000000);

		return Date.from(reallyStartOfDay.toLocalDateTime().toInstant(ZoneOffset.UTC));

	}
	public static Date convertLocalDate2Date(LocalDate localDate){
		ZoneId defaultZoneId = ZoneId.systemDefault();
		return Date.from(localDate.atStartOfDay(defaultZoneId).toInstant());
	}

	public static LocalDate convertDate2LocalDate(Date date) {
		return date.toInstant()
				.atZone(ZoneId.systemDefault())
				.toLocalDate();
	}
	public static Date endOfDay(Date date) {
		OffsetDateTime offsetDateTime = date.toInstant()
				.atOffset(ZoneOffset.UTC);
		OffsetDateTime reallyEndOfDay = offsetDateTime.withHour(23).withMinute(59).withSecond(59).withNano(999999999);
		return Date.from(reallyEndOfDay.toLocalDateTime().toInstant(ZoneOffset.UTC));
	}


	//system time is UTC, return date utc, sourceDate -> utc
	public static Date startOfDayUTC(Date sourceDate, TimeZone timeZone) throws ParseException {
		SimpleDateFormat simpleDateFormatUtc = new SimpleDateFormat("dd.MM.yyyy");

		SimpleDateFormat targetTimezoneFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
		targetTimezoneFormat.setTimeZone(timeZone);

		//parser date utc truoc, vi tren he thong dang set gio utc
		String dateSource = simpleDateFormatUtc.format(sourceDate)+" 00:00:00";
		simpleDateFormatUtc.applyPattern("dd.MM.yyyy HH:mm:ss");


		Calendar calendar = new GregorianCalendar();
		calendar.setTime(targetTimezoneFormat.parse(dateSource));
		calendar.set(Calendar.MILLISECOND,0);

		String utc = simpleDateFormatUtc.format(calendar.getTime());

		return simpleDateFormatUtc.parse(utc);

	}

	//system time is UTC, return date utc, sourceDate -> utc
	public static Date endOfDayUTC(Date sourceDate, TimeZone timeZone) throws ParseException {
		SimpleDateFormat simpleDateFormatUtc = new SimpleDateFormat("dd.MM.yyyy");

		SimpleDateFormat targetTimezoneFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
		targetTimezoneFormat.setTimeZone(timeZone);

		//parser date utc truoc, vi tren he thong dang set gio utc
		String dateSource = simpleDateFormatUtc.format(sourceDate)+" 23:59:59";
		simpleDateFormatUtc.applyPattern("dd.MM.yyyy HH:mm:ss");


		Calendar calendar = new GregorianCalendar();
		calendar.setTime(targetTimezoneFormat.parse(dateSource));
		calendar.set(Calendar.MILLISECOND,0);

		String utc = simpleDateFormatUtc.format(calendar.getTime());

		return simpleDateFormatUtc.parse(utc);
	}

	//system time is UTC, return date is utc too
	public static Date getCurrentStoreDate(TimeZone timeZone) throws ParseException {
		Date utcDate = new Date();

		SimpleDateFormat targetTimezoneFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
		targetTimezoneFormat.setTimeZone(timeZone);
		String targetDate = targetTimezoneFormat.format(utcDate);

		SimpleDateFormat simpleDateFormatUtc = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
		return simpleDateFormatUtc.parse(targetDate);
	}


	public static String getOffset(TimeZone tz){
		Calendar cal = GregorianCalendar.getInstance(tz);
		int offsetInMillis = tz.getOffset(cal.getTimeInMillis());
		String offset = String.format("%02d:%02d", Math.abs(offsetInMillis / 3600000), Math.abs((offsetInMillis / 60000) % 60));
		offset = (offsetInMillis >= 0 ? "+" : "-") + offset;
		return offset;
	}

	//system is UTC, convert from utc to
	public static Date convertToUtc(Date source, TimeZone oldTimeZone) throws ParseException {
		SimpleDateFormat simpleDateFormatUtc = new SimpleDateFormat(FORMAT_DATE);

		SimpleDateFormat oldTimezoneFormat = new SimpleDateFormat(FORMAT_DATE);
		String date = oldTimezoneFormat.format(source);
		oldTimezoneFormat.setTimeZone(oldTimeZone);

		Calendar calendar = new GregorianCalendar();
		calendar.setTime(oldTimezoneFormat.parse(date));

		String utc = simpleDateFormatUtc.format(calendar.getTime());

		return simpleDateFormatUtc.parse(utc);
	}
}
