package com.tenant.service;

import com.tenant.dto.account.QrCodeDto;
import com.tenant.exception.BadRequestException;
import com.tenant.utils.AESUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
public class QrCodeService {
    @Value("${qr.secret}")
    private String qrSecret;

    public String encryptAndZip(String clientId) {
        String rawValue = String.join("|",
                clientId,
                String.valueOf(new Date()));
        return AESUtils.encrypt(qrSecret, rawValue, true);
    }

    public QrCodeDto decryptAndUnzip(String encryptedValue) {
        String decryptedValue = AESUtils.decrypt(qrSecret, encryptedValue, true);
        if (decryptedValue == null) {
            throw new BadRequestException("Decrypt QR Code Failed");
        }
        String[] parts = decryptedValue.split("\\|");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid QR code data format");
        }
        QrCodeDto qrCodeDto = new QrCodeDto();
        qrCodeDto.setClientId(parts[0]);
        qrCodeDto.setCurrentTime(new Date(parts[1]));
        return qrCodeDto;
    }
}
