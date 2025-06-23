package com.finance.data.model.api.response.chat;


import android.os.Build;

import com.finance.data.model.api.ApiModelUtils;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private String avatar;
    private String createdDate;
    private Long id;
    private Long kind;
    private MessageResponse lastMessage;
    private String modifiedDate;
    private String name;
    private String otherAvatar;
    private String otherFullName;
    private AccountChatResponse owner;
    private Boolean isOwner;
    private String settings;
    private Integer status;
    private Integer totalMembers;
    private Integer totalUnreadMessages;
    private String lastLogin;

    public String getCreatedDate() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
                LocalDateTime inputDateTime = LocalDateTime.parse(createdDate, formatter);
                LocalDate inputDate = inputDateTime.toLocalDate();
                LocalDate today = LocalDate.now();
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                if (inputDate.equals(today)) {
                    return inputDateTime.format(timeFormatter);
                } else {
                    return inputDateTime.format(dateFormatter);
                }
            } else {
                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss", Locale.getDefault());
                Date inputDate = formatter.parse(createdDate);
                if (inputDate == null) {
                    return "Invalid date format";
                }
                Calendar inputCal = Calendar.getInstance();
                inputCal.setTime(inputDate);
                int inputYear = inputCal.get(Calendar.YEAR);
                int inputMonth = inputCal.get(Calendar.MONTH);
                int inputDay = inputCal.get(Calendar.DAY_OF_MONTH);
                Calendar todayCal = Calendar.getInstance();
                int todayYear = todayCal.get(Calendar.YEAR);
                int todayMonth = todayCal.get(Calendar.MONTH);
                int todayDay = todayCal.get(Calendar.DAY_OF_MONTH);
                if (inputYear == todayYear && inputMonth == todayMonth && inputDay == todayDay) {
                    SimpleDateFormat timeFormatter = new SimpleDateFormat("HH:mm:ss", Locale.getDefault());
                    return timeFormatter.format(inputDate);
                } else {
                    SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
                    return dateFormatter.format(inputDate);
                }
            }
        } catch (Exception e) {
            return "Invalid date format";
        }
    }

    public SettingChat getSettingChat() {
        if (settings == null || settings.isEmpty()) {
            return new SettingChat();
        }
        try {
            return ApiModelUtils.fromJson(settings, SettingChat.class);
        } catch (Exception e) {
            return new SettingChat();
        }
    }
}
