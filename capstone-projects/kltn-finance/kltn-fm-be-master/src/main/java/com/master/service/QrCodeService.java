package com.master.service;

import com.master.constant.MasterConstant;
import com.master.dto.auth.QrCodeDto;
import com.master.exception.BadRequestException;
import com.master.utils.AESUtils;
import com.master.utils.Md5Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
public class QrCodeService {
    @Value("${qr.secret}")
    private String qrSecret;
    private final static Boolean ZIP_ENABLED = true;

    public String encryptAndZip(String tenantId, String username) {
        String md5Hash = getMd5Hash(username, MasterConstant.QR_CODE_PASSWORD, tenantId);
        String rawValue = String.join("|",
                tenantId,
                username,
                md5Hash,
                String.valueOf(new Date()));
        return AESUtils.encrypt(qrSecret, rawValue, ZIP_ENABLED);
    }

    public QrCodeDto decryptAndUnzip(String encryptedValue) {
        String decryptedValue = AESUtils.decrypt(qrSecret, encryptedValue, ZIP_ENABLED);
        if (decryptedValue == null) {
            throw new BadRequestException("Decrypt QR Code Failed");
        }
        String[] parts = decryptedValue.split("\\|");
        if (parts.length < 4) {
            throw new IllegalArgumentException("Invalid QR code data format");
        }
        QrCodeDto qrCodeDto = new QrCodeDto();
        qrCodeDto.setTenantId(parts[0]);
        qrCodeDto.setUsername(parts[1]);
        qrCodeDto.setMd5Hash(parts[2]);
        qrCodeDto.setCurrentTime(new Date(parts[3]));
        return qrCodeDto;
    }

    public String getMd5Hash(String username, String qrCodePassword, String tenantId) {
        return Md5Utils.hash(username + qrCodePassword + tenantId);
    }
}
