package com.base.auth.jwt;

import com.base.auth.utils.ZipUtils;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;

@Slf4j
@Data
public class UserBaseJwt implements Serializable {
    public static final String DELIM = "\\|";
    public static final String EMPTY_STRING = "<>";
    private Long tokenId;

    private Long accountId = -1L;
    private Long storeId = -1L;
    private String kind = EMPTY_STRING;//token kind
    private String pemission = EMPTY_STRING;
    private Long deviceId = -1L;// id cua thiet bi, lưu ở table device để get firebase url..
    private Integer userKind = -1; //loại user là admin hay là gì
    private String username = EMPTY_STRING;// username hoac order code
    private Integer tabletKind = -1;
    private Long orderId = -1L;
    private Boolean isSuperAdmin = false;
    private String tenantId = EMPTY_STRING;





    public String toClaim(){
        if(deviceId == null){
            deviceId = -1L;
        }
        if(userKind == null){
            userKind = -1;
        }
        if(username == null){
            username = EMPTY_STRING;
        }
        if(tabletKind==null){
            tabletKind = -1;
        }
        if(orderId == null){
            orderId = -1L;
        }
        return ZipUtils.zipString(accountId+DELIM+ storeId +DELIM+kind+DELIM+pemission+DELIM+deviceId+DELIM+userKind+DELIM+username+DELIM+tabletKind+DELIM+orderId+DELIM+isSuperAdmin+DELIM+tenantId) ;
    }

    public static UserBaseJwt decode(String input){
        UserBaseJwt result = null;
        try {
            String[] items = ZipUtils.unzipString(input).split(DELIM,11);
            if(items.length >= 10){
                result = new UserBaseJwt();
                result.setAccountId(parserLong(items[0]));
                result.setStoreId(parserLong(items[1]));
                result.setKind(checkString(items[2]));
                result.setPemission(checkString(items[3]));
                result.setDeviceId(parserLong(items[4]));
                result.setUserKind(parserInt(items[5]));
                result.setUsername(checkString(items[6]));
                result.setTabletKind(parserInt(items[7]));
                result.setOrderId(parserLong(items[8]));
                result.setIsSuperAdmin(checkBoolean(items[9]));
                if(items.length > 10){
                    result.setTenantId(checkString(items[10]));
                }
            }
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
        return  result;
    }

    private static Long parserLong(String input){
        try{
            Long out = Long.parseLong(input);
            if(out > 0){
                return  out;
            }
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
        return null;
    }

    private static Integer parserInt(String input){
        try{
            Integer out = Integer.parseInt(input);
            if(out > 0){
                return  out;
            }
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
        return null;
    }

    private static String checkString(String input){
        if(!input.equals(EMPTY_STRING)){
            return  input;
        }
        return  null;
    }

    private static Boolean checkBoolean(String input){
        try{
            return Boolean.parseBoolean(input);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return false;
        }
    }
}
