package com.master.utils;

import com.master.dto.ErrorCode;
import com.master.exception.BadRequestException;
import com.master.model.DbConfig;
import com.master.model.ServerProvider;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class TenantUtils {
    public static String parseDatabaseNameFromConnectionString(String url) {
        String cleanString = url.substring("jdbc:mysql://".length(), url.indexOf("?"));
        return cleanString.substring(cleanString.indexOf("/") + 1);
    }

    public static String getMySqlJdbcUrl(String host, String port) {
        return "jdbc:mysql://" + host + ":" + port;
    }

    public static DataSource getRootDatasource(ServerProvider serverProvider) {
        HikariDataSource ds = new HikariDataSource();
        ds.setUsername(serverProvider.getMySqlRootUser());
        ds.setPassword(serverProvider.getMySqlRootPassword());
        ds.setJdbcUrl(serverProvider.getMySqlJdbcUrl());
        ds.setDriverClassName(serverProvider.getDriverClassName());
        return ds;
    }

    public static String getDbConfigUrl(String prefix, String schema) {
        return prefix + "/" + schema + "?useUnicode=yes&characterEncoding=UTF-8&zeroDateTimeBehavior=convertToNull";
    }

    public static void createTenantDatabase(DbConfig dbConfig) {
        if (dbConfig != null && dbConfig.getServerProvider() != null) {
            String databaseName = parseDatabaseNameFromConnectionString(dbConfig.getUrl());
            DataSource dataSource = getRootDatasource(dbConfig.getServerProvider());
            try (
                    Connection connection = dataSource.getConnection();
                    Statement statement = connection.createStatement();
            ) {
                statement.execute("CREATE DATABASE `" + databaseName + "` CHARACTER SET utf8mb4;");
                try {
                    statement.execute("CREATE USER '" + dbConfig.getUsername() + "'@'localhost' IDENTIFIED BY '" + dbConfig.getPassword() + "';");
                    statement.execute("CREATE USER '" + dbConfig.getUsername() + "'@'%' IDENTIFIED BY '" + dbConfig.getPassword() + "';");
                    statement.execute("GRANT ALL PRIVILEGES ON `" + databaseName + "`.* TO '" + dbConfig.getUsername() + "'@'localhost';");
                    statement.execute("GRANT ALL PRIVILEGES ON `" + databaseName + "`.* TO '" + dbConfig.getUsername() + "'@'%';");
                    statement.execute("FLUSH PRIVILEGES;");
                    System.out.println("Tenant database and user created successfully...");
                } catch (SQLException e) {
                    statement.execute("DROP DATABASE IF EXISTS `" + databaseName + "`;");
                    throw new BadRequestException(ErrorCode.DB_CONFIG_ERROR_CREATE_DATABASE, e.getMessage());
                }
            } catch (SQLException e) {
                e.printStackTrace();
                throw new BadRequestException(ErrorCode.DB_CONFIG_ERROR_CREATE_DATABASE, e.getMessage());
            }
        }
    }

    public static void deleteTenantDatabase(DbConfig dbConfig) {
        if (dbConfig != null && dbConfig.getServerProvider() != null) {
            String databaseName = parseDatabaseNameFromConnectionString(dbConfig.getUrl());
            DataSource dataSource = getRootDatasource(dbConfig.getServerProvider());
            try (
                    Connection connection = dataSource.getConnection();
                    Statement statement = connection.createStatement();
            ) {
                statement.execute("DROP DATABASE IF EXISTS `" + databaseName + "`;");
                statement.execute("DROP USER IF EXISTS '" + dbConfig.getUsername() + "';");
                statement.execute("DROP USER IF EXISTS '" + dbConfig.getUsername() + "'@'localhost';");
                statement.execute("FLUSH PRIVILEGES;");
                System.out.println("Tenant database deleted successfully...");
            } catch (SQLException e) {
                throw new BadRequestException(ErrorCode.DB_CONFIG_ERROR_DELETE_DATABASE, e.getMessage());
            }
        }
    }
}
