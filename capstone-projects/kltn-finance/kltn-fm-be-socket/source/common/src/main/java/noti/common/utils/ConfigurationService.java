package noti.common.utils;

import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.commons.configuration.event.ConfigurationEvent;
import org.apache.commons.configuration.event.ConfigurationListener;
import org.apache.commons.configuration.reloading.FileChangedReloadingStrategy;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ConfigurationService extends PropertiesConfiguration implements ConfigurationListener {
    
    Log logger = LogFactory.getLog(getClass());

    public ConfigurationService(String file) {

        try {
            this.setFileName(file);
            this.setReloadingStrategy(new FileChangedReloadingStrategy());
            this.setAutoSave(true);
            this.load();
        } catch (Exception ioe) {
            logger.error("Could not load engine properties", ioe);
        }

    }

    public String getConfig(String envKey, String propKey) {
        String envValue = System.getenv(envKey);
        return envValue != null ? envValue : this.getString(propKey);
    }

    public String[] getConfigArray(String envKey) {
        return new String[]{System.getenv(envKey)};
    }

    @Override
    public void configurationChanged(ConfigurationEvent event) {
        logger.debug("something change in config.properties file, you need to do something!");

    }

    public static void main(String[] args) {
        ConfigurationService config = new ConfigurationService("configuration.properties");
        System.out.println(config.getString("a"));
    }
}
