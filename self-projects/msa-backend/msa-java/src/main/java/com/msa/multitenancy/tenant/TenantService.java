package com.msa.multitenancy.tenant;

import com.msa.constant.ErrorCode;
import com.msa.exception.BadRequestException;
import com.msa.multitenancy.master.MasterDatabaseConfigProperties;
import com.msa.service.encryption.EncryptionService;
import com.msa.storage.master.model.DbConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@Slf4j
@Service
public class TenantService {
    @Autowired
    private MasterDatabaseConfigProperties databaseConfigProperties;
    @Autowired
    private EncryptionService encryptionService;

    public String parseDatabaseNameFromConnectionString(String url) {
        String cleanString = url.substring("jdbc:mysql://".length(), url.indexOf("?"));
        return cleanString.substring(cleanString.indexOf("/") + 1);
    }

    public String getRootJdbcPrefixUrl() {
        String jdbcUrl = databaseConfigProperties.getUrl();
        int prefixEnd = jdbcUrl.indexOf("/", "jdbc:mysql://".length());
        if (prefixEnd == -1) {
            throw new IllegalArgumentException("Cannot find database name in JDBC URL");
        }
        return jdbcUrl.substring(0, prefixEnd);
    }

    public DataSource getRootDatasource() {
        HikariDataSource ds = new HikariDataSource();
        ds.setUsername(databaseConfigProperties.getUsername());
        ds.setPassword(databaseConfigProperties.getPassword());
        ds.setJdbcUrl(getRootJdbcPrefixUrl());
        ds.setDriverClassName(databaseConfigProperties.getDriverClassName());
        return ds;
    }

    public String getDbConfigUrl(String prefix, String schema) {
        return prefix + "/" + schema + "?sessionVariables=sql_require_primary_key=0&useUnicode=yes&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull";
    }

    public void createTenantDatabase(DbConfig dbConfig) {
        if (dbConfig != null) {
            String databaseName = parseDatabaseNameFromConnectionString(dbConfig.getUrl());
            DataSource dataSource = getRootDatasource();
            try (
                    Connection connection = dataSource.getConnection();
                    Statement statement = connection.createStatement();
            ) {
                String password = encryptionService.serverDecrypt(dbConfig.getPassword());
                statement.execute("CREATE DATABASE `" + databaseName + "` CHARACTER SET utf8mb4;");
                try {
                    statement.execute("CREATE USER '" + dbConfig.getUsername() + "'@'%' IDENTIFIED BY '" + password + "';");
                    statement.execute("GRANT ALL PRIVILEGES ON `" + databaseName + "`.* TO '" + dbConfig.getUsername() + "'@'%';");
                    statement.execute("FLUSH PRIVILEGES;");
                    log.info("Tenant database and user created successfully...");
                } catch (SQLException e) {
                    statement.execute("DROP DATABASE IF EXISTS `" + databaseName + "`;");
                    throw new BadRequestException(ErrorCode.GENERAL_ERROR_CREATE_DATABASE, e.getMessage());
                }
            } catch (SQLException e) {
                e.printStackTrace();
                throw new BadRequestException(ErrorCode.GENERAL_ERROR_CREATE_DATABASE, e.getMessage());
            }
        }
    }

    public void deleteTenantDatabase(DbConfig dbConfig) {
        if (dbConfig != null) {
            String databaseName = parseDatabaseNameFromConnectionString(dbConfig.getUrl());
            DataSource dataSource = getRootDatasource();
            try (
                    Connection connection = dataSource.getConnection();
                    Statement statement = connection.createStatement()
            ) {
                statement.execute("DROP DATABASE IF EXISTS `" + databaseName + "`;");
                statement.execute("DROP USER IF EXISTS '" + dbConfig.getUsername() + "';");
                statement.execute("FLUSH PRIVILEGES;");
                log.info("Tenant database deleted successfully...");
            } catch (SQLException e) {
                throw new BadRequestException(ErrorCode.GENERAL_ERROR_DELETE_DATABASE, e.getMessage());
            }
        }
    }
}