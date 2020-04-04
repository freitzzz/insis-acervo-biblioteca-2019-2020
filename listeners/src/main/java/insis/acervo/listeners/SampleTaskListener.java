package insis.acervo.listeners;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class SampleTaskListener implements TaskListener{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3L;
	
	private static Log LOGGER = LogFactory.getLog(SampleTaskListener.class);
	
	public void notify(DelegateTask arg0) {
		LOGGER.info("Sample Task Listener starting");
		
		// Operations declared here
		
		LOGGER.info("Sample Task Listener ending");
	}

}
