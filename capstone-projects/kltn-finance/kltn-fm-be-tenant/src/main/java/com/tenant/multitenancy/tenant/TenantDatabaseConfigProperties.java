package com.tenant.multitenancy.tenant;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("multitenancy.tenant.datasource")
@Data
public class TenantDatabaseConfigProperties {
    private long connectionTimeout;
    private int maxPoolSize;
    private long idleTimeout;
    private int minIdle;
    private String dialect;
    private boolean showSql;
    private String ddlAuto;
    private String url;
    private String username;
    private String password;
    private String driverClassName;
}
