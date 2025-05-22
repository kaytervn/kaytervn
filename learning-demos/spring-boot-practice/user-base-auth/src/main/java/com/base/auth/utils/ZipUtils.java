package com.base.auth.utils;

import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

@Slf4j
public class ZipUtils {

    private ZipUtils(){

    }
    public static String zipString(String input){
        try {
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            Deflater deflater = new Deflater();
            DeflaterOutputStream zip = new DeflaterOutputStream(stream, deflater);
            zip.write(input.getBytes(StandardCharsets.UTF_8));
            zip.close();
            deflater.end();
            byte[] outDeflater = stream.toByteArray();
            return Base64.getEncoder().encodeToString(outDeflater);
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
        return null;

    }

    public static String unzipString(String input){
        try {
            byte[] dec = Base64.getDecoder().decode(input.getBytes(StandardCharsets.UTF_8));
            ByteArrayInputStream var2 = new ByteArrayInputStream(dec);
            InflaterInputStream var3 = new InflaterInputStream(var2, new Inflater());
            return new String(var3.readAllBytes(), StandardCharsets.UTF_8);
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }

        return null;
    }
}
