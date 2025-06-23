package com.tenant.multitenancy.master;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("multitenancy.master.datasource")
@Data
public class MasterDatabaseConfigProperties {
    private String url;
    private String username;
    private String password;
    private String driverClassName;
    private long connectionTimeout;
    private int maxPoolSize;
    private long idleTimeout;
    private int minIdle;
    private String poolName;
    private String dialect;
    private boolean showSql;
    private String ddlAuto;

    @Override
    public String toString() {
        return "MasterDatabaseConfigProperties{" +
                "url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", driverClassName='" + driverClassName + '\'' +
                ", connectionTimeout=" + connectionTimeout +
                ", maxPoolSize=" + maxPoolSize +
                ", idleTimeout=" + idleTimeout +
                ", minIdle=" + minIdle +
                ", poolName='" + poolName + '\'' +
                '}';
    }
}
