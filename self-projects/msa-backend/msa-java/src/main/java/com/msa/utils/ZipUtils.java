package com.msa.utils;

import lombok.extern.slf4j.Slf4j;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

@Slf4j
public class ZipUtils {
    public static String zipString(String input) {
        try (ByteArrayOutputStream stream = new ByteArrayOutputStream();
             DeflaterOutputStream zip = new DeflaterOutputStream(stream, new Deflater())) {
            zip.write(input.getBytes(StandardCharsets.UTF_8));
            zip.finish();
            return Base64.getEncoder().encodeToString(stream.toByteArray());
        } catch (IOException e) {
            log.error("Error compressing string", e);
            return null;
        }
    }

    public static String unzipString(String input) {
        try (ByteArrayInputStream inputStream = new ByteArrayInputStream(Base64.getDecoder().decode(input));
             InflaterInputStream inflaterInputStream = new InflaterInputStream(inputStream, new Inflater())) {
            return new String(inflaterInputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error unzipping string", e);
            return null;
        }
    }
}
