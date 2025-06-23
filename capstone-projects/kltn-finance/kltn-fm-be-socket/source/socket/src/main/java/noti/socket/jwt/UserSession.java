package noti.socket.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.Data;
import noti.socket.constant.NotiConstant;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.Logger;
import noti.socket.utils.SocketService;

@Data
public class UserSession {
    private static final Logger LOG = org.apache.logging.log4j.LogManager.getLogger(UserSession.class);
    private Long id;
    private Integer kind;
    private String tenantName;
    private String sessionId;
    private String grantType;
    private String username;

    public static UserSession fromToken(String token) {
        String publicKey = SocketService.getInstance().getStringResource("server.public.key");
        try {
            //System.out.println("==========> JWT secrect key: "+secretKey);
            Algorithm algorithm = Algorithm.HMAC256(publicKey);
            JWTVerifier verifier = JWT.require(algorithm)
                    .acceptLeeway(1) //1 sec for nbf and iat
                    .acceptExpiresAt(5) //5 secs for exp
                    .build();
            DecodedJWT decodedJWT = verifier.verify(token);
            Long userId = decodedJWT.getClaim("user_id").asLong();
            Integer userKind = decodedJWT.getClaim("user_kind").asInt();
            String tenantName = decodedJWT.getClaim("tenant_name").asString();
            String grantType = decodedJWT.getClaim("grant_type").asString();
            String username = decodedJWT.getClaim("username").asString();
            String sessionId = decodedJWT.getClaim("session_id").asString();
            if (userId == null
                    || userKind == null
                    || (!NotiConstant.GRANT_TYPE_PASSWORD.equals(grantType)
                    && StringUtils.isBlank(tenantName))
                    || StringUtils.isBlank(grantType)
                    || StringUtils.isBlank(username)
                    || StringUtils.isBlank(sessionId)
            ) {
                return null;
            }
            UserSession userSession = new UserSession();
            userSession.setId(userId);
            userSession.setKind(userKind);
            userSession.setUsername(username);
            userSession.setTenantName(tenantName);
            userSession.setGrantType(grantType);
            userSession.setSessionId(sessionId);
            return userSession;
        } catch (Exception e) {
            LOG.error("RSA key: " + publicKey);
            LOG.error("verifierJWT>>" + e.getMessage());
            return null;
        }
    }
}
