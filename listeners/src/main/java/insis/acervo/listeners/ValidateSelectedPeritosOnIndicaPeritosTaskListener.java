package insis.acervo.listeners;

import java.util.logging.Logger;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ValidateSelectedPeritosOnIndicaPeritosTaskListener implements TaskListener{

	/**
	 * 
	 */
	private static final long serialVersionUID = 12L;
	
	private static final String PERITOS_VARIABLE_NAME = "peritosByBM";
	
	private static Log LOGGER = LogFactory.getLog(ValidateSelectedPeritosOnIndicaPeritosTaskListener.class);
	
	public void notify(DelegateTask delegateTask) {
		
		LOGGER.info("Starting selected peritos validation...");
		
		try {
		
			final String selectedPeritos = (String)delegateTask.getVariable(PERITOS_VARIABLE_NAME);
			
			final int numberOfSelectedPeritos = selectedPeritos.split(",").length;
			
			if(numberOfSelectedPeritos != 2) {
				throw new Exception();
			}
			
		} catch (Exception exception) {
			LOGGER.warn("Selected peritos failed validation! Throwing Illegal State Exception");
			LOGGER.error(exception);
			throw new IllegalStateException("Não indicou 2 peritos");
		}
		
		LOGGER.info("Selected peritos passed validation");
	}

}
