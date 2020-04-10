package insis.acervo.utils;

import java.util.Enumeration;
import java.util.Properties;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 
 * Obtain Environment Variables Service Task
 * 
 */
public class ObtainEnvironmentVariables implements JavaDelegate {

	private static Log LOGGER = LogFactory.getLog(ObtainEnvironmentVariables.class);

	public void execute(DelegateExecution execution) throws Exception {
		LOGGER.info("Looking for environment variables...");

		ConfigFile configFile = new ConfigFile();
		Properties properties = configFile.getProperties();

		Enumeration<?> e = properties.propertyNames();
		while (e.hasMoreElements()) {
			String key = (String) e.nextElement();
			String value = properties.getProperty(key);

			LOGGER.info(String.format("%s = %s", key, value));
			execution.setVariable(key, value);
		}
	}

}
