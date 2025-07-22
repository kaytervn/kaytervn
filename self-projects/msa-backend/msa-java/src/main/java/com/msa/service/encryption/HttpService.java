package com.msa.service.encryption;

import com.msa.config.filter.CachedBodyHttpServletRequest;
import com.msa.constant.SecurityConstant;
import com.msa.config.filter.dto.AuthHeaderDto;
import com.msa.jwt.AppJwt;
import com.msa.utils.ConvertUtils;
import com.msa.utils.DateUtils;
import com.msa.utils.MD5Utils;
import com.msa.utils.ZipUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class HttpService {
    private static final long REQUEST_VALIDITY = 120; // seconds
    @Autowired
    private EncryptionService encryptionService;
    @Value("${app.api-key}")
    private String apiSecretKey;
    @Value("${app.client-key}")
    private String clientKey;
    @Value("#{'${app.allowed-domains}'.split(',')}")
    private List<String> allowedDomains;

    private String decryptHeader(HttpServletRequest request, String header) {
        return encryptionService.clientDecrypt(request.getHeader(header));
    }

    public String extractBody(HttpServletRequest request) {
        try {
            if (!MediaType.APPLICATION_JSON.includes(MediaType.valueOf(request.getContentType()))) {
                return "";
            }
            CachedBodyHttpServletRequest wrappedRequest = new CachedBodyHttpServletRequest(request);
            return new String(wrappedRequest.getCachedBody(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "";
        }
    }

    private List<String> decodeFingerprint(String input) {
        try {
            String decoded = ZipUtils.unzipString(input);
            if (decoded == null) {
                return null;
            }
            return List.of(decoded.split("\\|", -1));
        } catch (Exception e) {
            return null;
        }
    }

    public AuthHeaderDto extractHeaders(HttpServletRequest request) {
        AuthHeaderDto dto = new AuthHeaderDto();
        dto.setApiKey(decryptHeader(request, SecurityConstant.HEADER_X_API_KEY));
        dto.setTimestamp(DateUtils.stringToDate(decryptHeader(request, SecurityConstant.HEADER_TIMESTAMP)));
        dto.setMessageSignature(decryptHeader(request, SecurityConstant.HEADER_MESSAGE_SIGNATURE));
        dto.setClientRequestId(decryptHeader(request, SecurityConstant.HEADER_CLIENT_REQUEST_ID));
        dto.setFingerprint(decodeFingerprint(decryptHeader(request, SecurityConstant.HEADER_X_FINGERPRINT)));
        dto.setOrigin(request.getHeader(SecurityConstant.HEADER_ORIGIN));
        dto.setReferer(request.getHeader(SecurityConstant.HEADER_REFERER));
        dto.setRequestBody(extractBody(request));
        return dto;
    }

    public boolean validateDomain(AuthHeaderDto headers) {
        try {
            String origin = headers.getOrigin();
            String referer = headers.getReferer();
            return allowedDomains.stream().anyMatch(domain ->
                    (StringUtils.isNotBlank(origin) && origin.startsWith(domain)) ||
                            (StringUtils.isNotBlank(referer) && referer.startsWith(domain))
            );
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateSignature(AuthHeaderDto headers, AppJwt jwt) {
        if (StringUtils.isBlank(headers.getMessageSignature())
                || StringUtils.isBlank(headers.getApiKey())
                || StringUtils.isBlank(headers.getClientRequestId())
                || headers.getFingerprint() == null || headers.getFingerprint().isEmpty()
                || headers.getTimestamp() == null) {
            return false;
        }
        try {
            String fingerSecret;
            if (jwt != null) {
                if (headers.getFingerprint().size() < 3) {
                    return false;
                }
                Long userId = ConvertUtils.parseLong(headers.getFingerprint().get(0), -1L);
                fingerSecret = headers.getFingerprint().get(1);
                String username = headers.getFingerprint().get(2);
                if (!jwt.getAccountId().equals(userId) || !jwt.getUsername().equals(username)) {
                    return false;
                }
            } else {
                fingerSecret = headers.getFingerprint().get(0);
            }
            if (!DateUtils.verifyTimestamp(headers.getTimestamp(), REQUEST_VALIDITY)) {
                return false;
            }
            String timestamp = headers.getTimestamp().toString();
            String systemApiKey = MD5Utils.hash(timestamp + apiSecretKey + fingerSecret);
            String systemSignature = MD5Utils.hash(timestamp + headers.getRequestBody() + headers.getClientRequestId() + clientKey);
            return systemApiKey.equals(headers.getApiKey())
                    && systemSignature.equals(headers.getMessageSignature());
        } catch (Exception e) {
            return false;
        }
    }
}
