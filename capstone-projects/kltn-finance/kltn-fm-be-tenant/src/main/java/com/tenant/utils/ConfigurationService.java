package com.tenant.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.event.ConfigurationEvent;
import org.apache.commons.configuration.event.ConfigurationListener;
import org.apache.commons.configuration.reloading.FileChangedReloadingStrategy;

import java.io.File;
import java.io.IOException;

@Slf4j
public class ConfigurationService extends PropertiesConfiguration implements ConfigurationListener{
    private static final String PROPS_RESOURCE = "config.properties";
    private static ConfigurationService instance = null;
    private ConfigurationService(){

    }
    public static final ConfigurationService getInstance() {
        if (instance == null) {
            instance = new ConfigurationService();
            instance.loadProperties();
        }
        return instance;
    }
    private void loadProperties() {
        try {
            File is = new File(PROPS_RESOURCE);
            loadProperties(is);
        }
        catch (IOException ioe) {
            log.warn("Could not load engine properties", ioe);
        }
    }

    private void loadProperties(File is)
            throws IOException {
        try {
            instance.setFile(is);
            instance.setReloadingStrategy(new FileChangedReloadingStrategy());
            instance.setAutoSave(true);
            instance.load();
            log.info("Loaded engine properties from " + PROPS_RESOURCE);
        }
        catch (ConfigurationException e) {
            throw new IOException("Failed to load properties from " + PROPS_RESOURCE);
        }
    }


    @Override
    public void configurationChanged() {
        super.configurationChanged();
        log.info("something change in config.properties file, configurationChanged()!");
    }
    @Override
    public void configurationChanged(ConfigurationEvent event) {
        log.info("something change in config.properties file, configurationChanged(ConfigurationEvent event)!");
    }
}
