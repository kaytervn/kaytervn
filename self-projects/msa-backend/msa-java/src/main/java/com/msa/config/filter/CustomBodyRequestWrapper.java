package com.msa.config.filter;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class CustomBodyRequestWrapper extends HttpServletRequestWrapper {
    private final byte[] newBody;

    public CustomBodyRequestWrapper(HttpServletRequest request, String newBodyJson) {
        super(request);
        this.newBody = newBodyJson.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public ServletInputStream getInputStream() {
        ByteArrayInputStream bais = new ByteArrayInputStream(this.newBody);
        return new DelegatingServletInputStream(bais);
    }

    @Override
    public BufferedReader getReader() {
        return new BufferedReader(new InputStreamReader(this.getInputStream()));
    }
}

