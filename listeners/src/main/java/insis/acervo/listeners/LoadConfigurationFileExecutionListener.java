package insis.acervo.listeners;

import java.util.Map;
import java.util.Properties;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;

import insis.acervo.util.ConfigFile;

/** 
 * Loads properties defined in /conf/config.properties file into current execution which listener is being called on
 */
public class LoadConfigurationFileExecutionListener implements ExecutionListener {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void notify(final DelegateExecution execution) throws Exception {
		
		final ConfigFile configurationFile = new ConfigFile();
		
		final Properties loadedProperties = configurationFile.getProperties();
		
		for(Map.Entry<Object, Object> keyPair : loadedProperties.entrySet()) {
			
			execution.setVariable((String)keyPair.getKey(), keyPair.getValue());
			
		}
		
	}

}
