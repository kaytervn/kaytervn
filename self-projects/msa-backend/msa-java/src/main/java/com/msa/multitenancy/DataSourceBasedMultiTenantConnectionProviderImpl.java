package com.msa.multitenancy;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.cache.RemovalListener;
import com.msa.mapper.DbConfigMapper;
import com.msa.multitenancy.master.MasterDatabaseConfigProperties;
import com.msa.multitenancy.tenant.TenantService;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.master.model.DbConfig;
import com.msa.storage.master.repository.DbConfigRepository;
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
import org.springframework.lang.NonNull;
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
    private LoadingCache<String, DataSource> dataSourcesMtApp;
    @Autowired
    private MasterDatabaseConfigProperties configProperties;
    @Value("${multitenancy.datasource-cache.maximumSize}")
    private Long maximumSize;
    @Value("${multitenancy.datasource-cache.expireAfterAccess}")
    private Integer expireAfterAccess;
    @Autowired
    @Qualifier("tenantLiquibaseProperties")
    private LiquibaseProperties liquibaseProperties;
    private ResourceLoader resourceLoader;
    @Autowired
    private DbConfigRepository dbConfigRepository;
    @Autowired
    private DbConfigMapper dbConfigMapper;
    @Autowired
    private EncryptionService encryptionService;
    @Autowired
    private TenantService tenantService;

    @PostConstruct
    private void createCache() {
        dataSourcesMtApp = CacheBuilder.newBuilder()
                .maximumSize(maximumSize)
                .expireAfterAccess(expireAfterAccess, TimeUnit.MINUTES)
                .removalListener((RemovalListener<String, DataSource>) removal -> {
                    HikariDataSource ds = (HikariDataSource) removal.getValue();
                    ds.close();
                    log.warn("Closed datasource: {}", ds.getPoolName());
                })
                .build(new CacheLoader<>() {
                    @Override
                    public DataSource load(@NonNull String key) {
                        log.warn("Loading tenant: {}", key);
                        DbConfig dbConfig = dbConfigRepository.findFirstByUsername(key).orElse(null);
                        if (dbConfig == null) {
                            throw new RuntimeException("No such tenant: " + key);
                        }
                        return createAndConfigureDataSource(dbConfig);
                    }
                });
    }

    @Override
    protected DataSource selectAnyDataSource() {
        if (dataSourcesMtApp.asMap().isEmpty()) {
            return null;
        }
        log.warn("selectAnyDataSource() called. Total tenants: {}", dataSourcesMtApp.size());
        return dataSourcesMtApp.asMap().values().iterator().next();
    }

    @Override
    protected DataSource selectDataSource(String tenantIdentifier) {
        log.warn("Getting datasource for tenant: {}", tenantIdentifier);
        try {
            return dataSourcesMtApp.get(tenantIdentifier);
        } catch (ExecutionException e) {
            throw new RuntimeException("Failed to load DataSource for tenant: " + tenantIdentifier, e);
        }
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    private DataSource createAndConfigureDataSource(DbConfig dbConfig) {
        HikariDataSource ds = new HikariDataSource();
        ds.setUsername(dbConfig.getUsername());
        ds.setPassword(encryptionService.serverDecrypt(dbConfig.getPassword()));
        ds.setJdbcUrl(dbConfig.getUrl());
        ds.setDriverClassName(configProperties.getDriverClassName());
        ds.setConnectionTimeout(configProperties.getConnectionTimeout());
        ds.setMinimumIdle(configProperties.getMinIdle());
        ds.setMaximumPoolSize(configProperties.getMaxPoolSize());
        ds.setIdleTimeout(configProperties.getIdleTimeout());
        ds.setPoolName(dbConfig.getUsername() + "-connection-pool");
        log.warn("Configured datasource for pool name: {}", ds.getPoolName());
        runLiquibase(ds, parseDatabaseNameFromUrl(dbConfig.getUrl()));
        return ds;
    }

    private String parseDatabaseNameFromUrl(String url) {
        return tenantService.parseDatabaseNameFromConnectionString(url);
    }

    private void runLiquibase(DataSource dataSource, String schema) {
        SpringLiquibase liquibase = getSpringLiquibase(dataSource, schema);
        try {
            liquibase.afterPropertiesSet();
        } catch (LiquibaseException e) {
            log.error("Error running Liquibase for schema: {}", schema, e);
        }
    }

    private SpringLiquibase getSpringLiquibase(DataSource dataSource, String schema) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setResourceLoader(resourceLoader);
        liquibase.setDataSource(dataSource);
        liquibase.setDefaultSchema(schema);
        liquibase.setChangeLogParameters(liquibaseProperties.getParameters() != null ? liquibaseProperties.getParameters() : Collections.singletonMap("schema", schema));
        liquibase.setChangeLog(liquibaseProperties.getChangeLog());
        liquibase.setContexts(liquibaseProperties.getContexts());
        liquibase.setLiquibaseSchema(liquibaseProperties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(liquibaseProperties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogTable(liquibaseProperties.getDatabaseChangeLogTable());
        liquibase.setDatabaseChangeLogLockTable(liquibaseProperties.getDatabaseChangeLogLockTable());
        liquibase.setDropFirst(liquibaseProperties.isDropFirst());
        liquibase.setShouldRun(liquibaseProperties.isEnabled());
        liquibase.setRollbackFile(liquibaseProperties.getRollbackFile());
        liquibase.setTestRollbackOnUpdate(liquibaseProperties.isTestRollbackOnUpdate());
        return liquibase;
    }
}
