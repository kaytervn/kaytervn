package com.tenant.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class JSONUtils {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String enhanceDataToJson(String jsonString, String fieldName, Object fieldValue) {
        try {
            if (jsonString == null || jsonString.isEmpty()) {
                jsonString = "{}";
            }
            JsonNode rootNode = objectMapper.readTree(jsonString);

            if (rootNode instanceof ObjectNode) {
                ObjectNode objectNode = (ObjectNode) rootNode;
                objectNode.putPOJO(fieldName, fieldValue);

                return objectMapper.writeValueAsString(objectNode);
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return jsonString;
    }

    //public static
    public static <T> T getDataObject(String json, String field, Class<T> returnType) throws Exception{
        ObjectMapper mapper = getMapper();
        JsonNode node = mapper.readValue(json, JsonNode.class);
        String[] fields = field.split("\\.");

        JsonNode lastNode = node;
        for(int i =0; i< fields.length; i++){
            if(checkField(lastNode,fields[i])){
                if(i == fields.length-1){
                    return mapper.convertValue(lastNode.get(fields[i]),returnType);
                }else{
                    lastNode = lastNode.get(fields[i]);
                }
            }
        }
        return null;
    }

    private static boolean checkField(JsonNode node, String field){
        return node.has(field);
    }

    public static ObjectMapper getMapper(){
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        objectMapper.setDateFormat(df);

        return objectMapper;
    }

    public static String convertObjectToJson(Object object) {
        try {
            return getMapper().writeValueAsString(object);
        }catch (JsonProcessingException e) {
            e.printStackTrace();
            return "{}";
        }
    }

    public static String getDataByKey(String jsonName, String field) {
        try {
            return JSONUtils.getDataObject(jsonName, field, String.class);
        } catch (Exception err) {
            throw new IllegalArgumentException("Invalid JSON Format: " + err.getMessage());
        }
    }
}
