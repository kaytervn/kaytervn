package com.msa.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.msa.constant.AppConstant;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class JSONUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        DateFormat df = new SimpleDateFormat(AppConstant.DATE_TIME_FORMAT);
        objectMapper.setDateFormat(df);
    }

    public static String enhanceDataToJson(String jsonString, String fieldName, Object fieldValue) {
        try {
            JsonNode root = objectMapper.readTree(jsonString == null || jsonString.isEmpty() ? "{}" : jsonString);
            if (root.isObject()) {
                ((ObjectNode) root).putPOJO(fieldName, fieldValue);
                return objectMapper.writeValueAsString(root);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonString;
    }

    public static <T> T getDataObject(String json, String fieldPath, Class<T> returnType) {
        try {
            JsonNode node = objectMapper.readTree(json);
            for (String key : fieldPath.split("\\.")) {
                if (node == null || !node.has(key)) return null;
                node = node.get(key);
            }
            return objectMapper.convertValue(node, returnType);
        } catch (Exception e) {
            return null;
        }
    }

    public static String convertObjectToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }

    public static String getDataByKey(String json, String fieldPath) {
        String result = getDataObject(json, fieldPath, String.class);
        if (result == null) {
            throw new IllegalArgumentException("Invalid or missing field: " + fieldPath);
        }
        return result;
    }
}
