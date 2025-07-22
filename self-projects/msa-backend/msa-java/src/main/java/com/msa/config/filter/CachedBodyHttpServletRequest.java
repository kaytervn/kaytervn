package com.msa.config.filter;

import com.msa.constant.SecurityConstant;
import com.msa.service.encryption.EncryptionService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StreamUtils;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;

@Getter
public class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {
    private final EncryptionService encryptionService;
    private final byte[] cachedBody;

    public CachedBodyHttpServletRequest(HttpServletRequest request, EncryptionService encryptionService) throws IOException {
        super(request);
        InputStream requestInputStream = request.getInputStream();
        this.cachedBody = StreamUtils.copyToByteArray(requestInputStream);
        this.encryptionService = encryptionService;
    }

    @Override
    public ServletInputStream getInputStream() {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.cachedBody);
        return new DelegatingServletInputStream(byteArrayInputStream);
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(this.getInputStream()));
    }

    @Override
    public String getHeader(String name) {
        String header = super.getHeader(name);
        if (SecurityConstant.HEADER_AUTHORIZATION.equalsIgnoreCase(name)) {
            return encryptionService.clientDecrypt(header);
        }
        return header;
    }
}

