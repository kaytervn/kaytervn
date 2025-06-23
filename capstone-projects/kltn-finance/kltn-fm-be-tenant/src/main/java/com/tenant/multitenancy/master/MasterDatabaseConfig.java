package com.tenant.multitenancy.master;

import com.tenant.constant.FinanceConstant;
import com.zaxxer.hikari.HikariDataSource;
import liquibase.integration.spring.SpringLiquibase;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.cfg.Environment;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = {FinanceConstant.MASTER_MODEL_PACKAGE, FinanceConstant.MASTER_REPOSITORY_PACKAGE},
        entityManagerFactoryRef = "masterEntityManagerFactory",
        transactionManagerRef = "masterTransactionManager")
@Slf4j
public class MasterDatabaseConfig {
    @Autowired
    private MasterDatabaseConfigProperties masterDbProperties;

    //Create Master Data Source using master properties and also configure HikariCP
    @Bean(name = "masterDataSource")
    public DataSource masterDataSource() {
        HikariDataSource hikariDataSource = new HikariDataSource();
        hikariDataSource.setUsername(masterDbProperties.getUsername());
        hikariDataSource.setPassword(masterDbProperties.getPassword());
        hikariDataSource.setJdbcUrl(masterDbProperties.getUrl());
        hikariDataSource.setDriverClassName(masterDbProperties.getDriverClassName());
        hikariDataSource.setPoolName(masterDbProperties.getPoolName());
        // HikariCP settings
        hikariDataSource.setMaximumPoolSize(masterDbProperties.getMaxPoolSize());
        hikariDataSource.setMinimumIdle(masterDbProperties.getMinIdle());
        hikariDataSource.setConnectionTimeout(masterDbProperties.getConnectionTimeout());
        hikariDataSource.setIdleTimeout(masterDbProperties.getIdleTimeout());
        log.info("Setup of masterDataSource succeeded.");
        return hikariDataSource;
    }

    @Primary
    @Bean(name = "masterEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean masterEntityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        // Set the master data source
        em.setDataSource(masterDataSource());
        // The master multitenancy entity and repository need to be scanned
        em.setPackagesToScan(FinanceConstant.MASTER_MODEL_PACKAGE, FinanceConstant.MASTER_REPOSITORY_PACKAGE);
        // Setting a name for the persistence unit as Spring sets it as
        // 'default' if not defined
        em.setPersistenceUnitName("masterdb-persistence-unit");
        // Setting Hibernate as the JPA provider
        JpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);
        // Set the hibernate properties
        em.setJpaProperties(hibernateProperties());
        log.info("Setup of masterEntityManagerFactory succeeded.");
        return em;
    }

    @Bean(name = "masterTransactionManager")
    public JpaTransactionManager masterTransactionManager(@Qualifier("masterEntityManagerFactory") EntityManagerFactory emf) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(emf);
        return transactionManager;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    //Hibernate configuration properties
    private Properties hibernateProperties() {
        Properties properties = new Properties();
        //properties.put(org.hibernate.cfg.Environment.DIALECT, "org.hibernate.dialect.MySQL5Dialect"); //-> mysisam
        properties.put(Environment.DIALECT, "org.hibernate.dialect.MySQL5Dialect");
        properties.put(Environment.IMPLICIT_NAMING_STRATEGY, "org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyHbmImpl");
        properties.put(Environment.PHYSICAL_NAMING_STRATEGY, "org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy");
        properties.put(Environment.SHOW_SQL, masterDbProperties.isShowSql());
        properties.put(Environment.HBM2DDL_AUTO, masterDbProperties.getDdlAuto());
        properties.put(Environment.ENABLE_LAZY_LOAD_NO_TRANS, true);
        return properties;
    }


    @Bean("masterLiquibase")
    public SpringLiquibase masterLiquibase(
            @Qualifier("masterLiquibaseProperties") LiquibaseProperties properties,
            ObjectProvider<DataSource> masterDataSource) {
        SpringLiquibase liquibase = createLiquibase(masterDataSource.getIfAvailable(), properties);
        liquibase.setShouldRun(true);
        return liquibase;
    }

    @Bean("masterLiquibaseProperties")
    @ConfigurationProperties("multitenancy.master.liquibase")
    public LiquibaseProperties masterLiquibaseProperties() {
        return new LiquibaseProperties();
    }

    private SpringLiquibase createLiquibase(DataSource dataSource, LiquibaseProperties properties) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(dataSource);
        liquibase.setChangeLog(properties.getChangeLog());
        liquibase.setContexts(properties.getContexts());
        liquibase.setLiquibaseSchema(properties.getLiquibaseSchema());
        liquibase.setLiquibaseTablespace(properties.getLiquibaseTablespace());
        liquibase.setDatabaseChangeLogTable(properties.getDatabaseChangeLogTable());
        liquibase.setDatabaseChangeLogLockTable(properties.getDatabaseChangeLogLockTable());
        liquibase.setDropFirst(properties.isDropFirst());
        liquibase.setLabelFilter(properties.getLabels());
        liquibase.setChangeLogParameters(properties.getParameters());
        liquibase.setRollbackFile(properties.getRollbackFile());
        liquibase.setTestRollbackOnUpdate(properties.isTestRollbackOnUpdate());
        return liquibase;
    }
}
