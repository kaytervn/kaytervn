package com.tenant.multitenancy.tenant;

import com.tenant.dto.ApiMessageDto;
import com.tenant.multitenancy.constant.TenantConstant;
import com.tenant.multitenancy.dto.DbConfigDto;
import com.tenant.multitenancy.feign.FeignDbConfigAuthService;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.cache.RemovalListener;
import com.zaxxer.hikari.HikariDataSource;
import liquibase.exception.LiquibaseException;
import liquibase.integration.spring.SpringLiquibase;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.engine.jdbc.connections.spi.AbstractDataSourceBasedMultiTenantConnectionProviderImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.util.Collections;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Getter
@Setter
@Component
@Slf4j
public class DataSourceBasedMultiTenantConnectionProviderImpl extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl implements ResourceLoaderAware {
    private static final long serialVersionUID = 1L;
    private LoadingCache<String, DataSource> dataSourcesMtApp;
    @Autowired
    TenantDatabaseConfigProperties configProperties;
    @Autowired
    private FeignDbConfigAuthService dbConfigAuthService;
    @Value("${multitenancy.datasource-cache.maximumSize}")
    private Long maximumSize;
    @Value("${multitenancy.datasource-cache.expireAfterAccess}")
    private Integer expireAfterAccess;
    @Autowired
    @Qualifier("tenantLiquibaseProperties")
    private LiquibaseProperties liquibaseProperties;
    @Value("${master.api-key}")
    private String apiSecretKey;
    private ResourceLoader resourceLoader;

    @PostConstruct
    private void createCache() { //phương thức createCache có tác dụng tạo và cấu hình một cache để lưu trữ và quản lý các nguồn dữ liệu (DataSource)
        dataSourcesMtApp = CacheBuilder.newBuilder()
                .maximumSize(maximumSize)
                .expireAfterAccess(expireAfterAccess, TimeUnit.MINUTES)
                .removalListener((RemovalListener<String, DataSource>) removal -> {
                    // when call cache will check tenants that 10 minutes not used will be removed
                    HikariDataSource ds = (HikariDataSource) removal.getValue();
                    ds.close(); // tear down properly
                    log.info("Closed datasource: {}", ds.getPoolName());
                })
                .build(new CacheLoader<String, DataSource>() {
                    public DataSource load(String key) {
                        log.info("====> load tenant has key: " + key);
                        ApiMessageDto<DbConfigDto> tenant = dbConfigAuthService.getByName(key, apiSecretKey);
                        if (tenant == null || !tenant.getResult() || tenant.getData() == null) {
                            throw new RuntimeException("No such tenant: " + key);
                        }
                        return createAndConfigureDataSource(tenant.getData(), false);
                    }
                });
    }

    @Override
    protected DataSource selectAnyDataSource() { //đoạn mã này có nhiệm vụ chọn một nguồn dữ liệu (DataSource) từ danh sách các tenants. Nếu danh sách rỗng, nó sẽ tạo một nguồn dữ liệu mặc định và sau đó trả về nguồn dữ liệu đầu tiên từ danh sách (nếu có).
        if (dataSourcesMtApp.asMap().isEmpty()) {
            DbConfigDto tenant = new DbConfigDto();
            tenant.setUsername(configProperties.getUsername());
            tenant.setPassword(configProperties.getPassword());
            tenant.setDriverClassName(configProperties.getDriverClassName());
            tenant.setUrl(configProperties.getUrl());
            tenant.setName(TenantConstant.DEFAULT_TENANT_ID);
            dataSourcesMtApp.asMap().put(tenant.getName(), createAndConfigureDataSource(tenant, true));
        }
        log.info("selectAnyDataSource() method call...Total tenants:" + dataSourcesMtApp.asMap().size());
        return dataSourcesMtApp.asMap().values().iterator().next();
    }

    @Override
    protected DataSource selectDataSource(String tenantIdentifier) {
        // load tenant in cache first
        // if not found in cache will load from database then put to cache through function createCache()
        System.out.println("get datasource by tenant: " + tenantIdentifier);
        log.info("Total cached tenants: " + dataSourcesMtApp.asMap().size());
        try {
            return this.dataSourcesMtApp.get(tenantIdentifier);
        } catch (ExecutionException ex) {
            throw new RuntimeException("Failed to load DataSource for tenant: " + tenantIdentifier);
        }
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    private DataSource createAndConfigureDataSource(DbConfigDto dbConfig, boolean isBootstrap) {
        HikariDataSource ds = new HikariDataSource();
        ds.setUsername(dbConfig.getUsername());
        ds.setPassword(dbConfig.getPassword());
        ds.setJdbcUrl(dbConfig.getUrl());
        ds.setDriverClassName(dbConfig.getDriverClassName());
        // HikariCP settings - could come from the master_tenant table but
        // hardcoded here for brevity
        // Maximum waiting time for a connection from the pool
        ds.setConnectionTimeout(configProperties.getConnectionTimeout());
        // Minimum number of idle connections in the pool
        ds.setMinimumIdle(configProperties.getMinIdle());
        // Maximum number of actual connection in the pool
        ds.setMaximumPoolSize(dbConfig.getMaxConnection() != null ? dbConfig.getMaxConnection() : configProperties.getMaxPoolSize());
        // Maximum time that a connection is allowed to sit idle in the pool
        ds.setIdleTimeout(configProperties.getIdleTimeout());
        ds.setConnectionTimeout(configProperties.getConnectionTimeout());
        // Setting up a pool name for each tenant datasource
        String tenantConnectionPoolName = dbConfig.getName() + "-connection-pool";
        ds.setPoolName(tenantConnectionPoolName);
        log.info("Configured datasource:" + dbConfig.getName() + ". Connection pool name:" + tenantConnectionPoolName);
        if (!isBootstrap) {
            runLiquibase(ds, parseDatabaseNameFromConnectionString(dbConfig.getUrl()));
        }
        return ds;
    }

    private String parseDatabaseNameFromConnectionString(String url) {
        String cleanString = url.substring("jdbc:mysql://".length(), url.indexOf("?"));
        return cleanString.substring(cleanString.indexOf("/") + 1);
    }

    private void runLiquibase(DataSource dataSource, String schema) {
        SpringLiquibase liquibase = getSpringLiquibase(dataSource, schema);
        try {
            liquibase.afterPropertiesSet();
        } catch (LiquibaseException e) {
            e.printStackTrace();
        }
    }

    protected SpringLiquibase getSpringLiquibase(DataSource dataSource, String schema) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setResourceLoader(getResourceLoader());
        liquibase.setDataSource(dataSource);
        liquibase.setDefaultSchema(schema);
        if (liquibaseProperties.getParameters() != null) {
            liquibaseProperties.getParameters().put("schema", schema);
            liquibase.setChangeLogParameters(liquibaseProperties.getParameters());
        } else {
            liquibase.setChangeLogParameters(Collections.singletonMap("schema", schema));
        }
        liquibase.setChangeLog(liquibaseProperties.getChangeLog());
        liquibase.setContexts(liquibaseProperties.getContexts());
        liquibase.setLiquibaseSchema(liquibaseProperties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(liquibaseProperties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogTable(liquibaseProperties.getDatabaseChangeLogTable());
        liquibase.setDatabaseChangeLogLockTable(liquibaseProperties.getDatabaseChangeLogLockTable());
        liquibase.setDropFirst(liquibaseProperties.isDropFirst());
        liquibase.setShouldRun(liquibaseProperties.isEnabled());
        liquibase.setLabels(liquibaseProperties.getLabels());
        liquibase.setRollbackFile(liquibaseProperties.getRollbackFile());
        liquibase.setTestRollbackOnUpdate(liquibaseProperties.isTestRollbackOnUpdate());
        return liquibase;
    }
}
