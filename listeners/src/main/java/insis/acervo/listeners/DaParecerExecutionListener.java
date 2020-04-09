package insis.acervo.listeners;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.delegate.Expression;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DaParecerExecutionListener implements ExecutionListener {
	
	private static final String ACERVO_PROCESS_INSTANCE_ID = "acervoProcessInstanceId";
	
	private static final String DECISAO_TO_JOIN_VARIABLE_NAME = "preencheParecerDecisao";
	
	private static final String DECISOES_LIST_VARIABLE_NAME = "globalTodosPeritos";
	
	private static final String DECISOES_ACEITES_VARIABLE_NAME = "globalDecisoesAceitesPeritos";
	
	private static final String DECISOES_RECUSADAS_VARIABLE_NAME = "globalDecisoesRecusadasPeritos";
	
	public Expression variableNameExpression2;

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
		
		LOGGER.info("Variables initialized");
		
		RuntimeService runtimeService = execution.getEngineServices().getRuntimeService();
		
		String processInstanceId = (String)execution.getVariable(ACERVO_PROCESS_INSTANCE_ID);
		
		if(runtimeService.hasVariable(processInstanceId, DECISOES_LIST_VARIABLE_NAME)) {
			
			LOGGER.info("Has Variable");
			
			LOGGER.info(runtimeService.getVariables(processInstanceId));
			
			decisoes = (List<Boolean>) runtimeService.getVariable(processInstanceId, DECISOES_LIST_VARIABLE_NAME);
			
			LOGGER.info("Got decisoes");
			
		}
		
		boolean decisaoPerito = execution.getVariable(DECISAO_TO_JOIN_VARIABLE_NAME, Boolean.class);
		
		LOGGER.info("Got decisao perito" + decisaoPerito);
		
		decisoes.add(decisaoPerito);
		
		LOGGER.info("Added Decisao Perito");
		
		for(Boolean decisao : decisoes) {
			
			if(decisao) {
				decisoesAceites++;
			} else {
				decisoesRecusadas++;
			}
			
			LOGGER.info("Loop Entry" + decisao);
			
		}
		
		LOGGER.info("Setting Variables");
		
		runtimeService.setVariable(processInstanceId, DECISOES_ACEITES_VARIABLE_NAME, decisoesAceites);
		
		LOGGER.info("Set: " + DECISOES_ACEITES_VARIABLE_NAME);
		
		runtimeService.setVariable(processInstanceId, DECISOES_RECUSADAS_VARIABLE_NAME, decisoesRecusadas);
		
		LOGGER.info("Set: " + DECISOES_RECUSADAS_VARIABLE_NAME);
		
		runtimeService.setVariable(processInstanceId, DECISOES_LIST_VARIABLE_NAME, decisoes);
		
		LOGGER.info("Set: " + DECISOES_LIST_VARIABLE_NAME);
		
		LOGGER.info("Da Parecer Execution Listener ending");
	}

}
