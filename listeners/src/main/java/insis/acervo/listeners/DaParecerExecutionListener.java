package insis.acervo.listeners;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.delegate.TaskListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DaParecerExecutionListener implements ExecutionListener {
	
	private static final String DECISAO_TO_JOIN_VARIABLE_NAME = "preencheParecerDecisao";
	
	private static final String DECISOES_LIST_VARIABLE_NAME = "globalTodosPeritos";
	
	private static final String DECISOES_ACEITES_VARIABLE_NAME = "globalDecisoesAceitesPeritos";
	
	private static final String DECISOES_RECUSADAS_VARIABLE_NAME = "globalDecisoesRecusadasPeritos";

	/**
	 * 
	 */
	private static final long serialVersionUID = 4L;
	
	private static Log LOGGER = LogFactory.getLog(DaParecerExecutionListener.class);
	
	@SuppressWarnings("unchecked")
	public void notify(DelegateExecution execution) {
		LOGGER.info("Da Parecer Execution Listener starting");
		
		List<Boolean> decisoes = new ArrayList<Boolean>();
		
		int decisoesAceites = 0;
		
		int decisoesRecusadas = 0;
		
		if(execution.hasVariable(DECISOES_LIST_VARIABLE_NAME)) {
			
			decisoes = (List<Boolean>) execution.getVariable(DECISOES_LIST_VARIABLE_NAME);
			
		}
		
		boolean decisaoPerito = execution.getVariable(DECISAO_TO_JOIN_VARIABLE_NAME, Boolean.class);
		
		decisoes.add(decisaoPerito);
		
		for(Boolean decisao : decisoes) {
			
			if(decisao) {
				decisoesAceites++;
			} else {
				decisoesRecusadas++;
			}
			
		}
		
		execution.setVariable(DECISOES_ACEITES_VARIABLE_NAME, decisoesAceites);
		
		execution.setVariable(DECISOES_RECUSADAS_VARIABLE_NAME, decisoesRecusadas);
		
		execution.setVariable(DECISOES_LIST_VARIABLE_NAME, decisoes);
		
		
		
		LOGGER.info("Da Parecer Execution Listener ending");
	}

}
