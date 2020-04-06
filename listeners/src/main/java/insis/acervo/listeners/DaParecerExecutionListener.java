package insis.acervo.listeners;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.TaskListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DaParecerExecutionListener implements ExecutionListener {
	
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
		
		System.out.println(variableNameExpression2);
		
		System.out.println(variableNameExpression2.getExpressionText());
		
		System.out.println(variableNameExpression2.getValue(execution));
		
		if(execution.hasVariable(DECISOES_LIST_VARIABLE_NAME)) {
			
			LOGGER.info("Has Variable");
			
			LOGGER.info(execution.getVariables());
			
			decisoes = (List<Boolean>) execution.getVariable(DECISOES_LIST_VARIABLE_NAME);
			
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
		
		execution.setVariable(DECISOES_ACEITES_VARIABLE_NAME, decisoesAceites);
		
		LOGGER.info("Set: " + DECISOES_ACEITES_VARIABLE_NAME);
		
		execution.setVariable(DECISOES_RECUSADAS_VARIABLE_NAME, decisoesRecusadas);
		
		LOGGER.info("Set: " + DECISOES_RECUSADAS_VARIABLE_NAME);
		
		execution.setVariable(DECISOES_LIST_VARIABLE_NAME, decisoes);
		
		LOGGER.info("Set: " + DECISOES_LIST_VARIABLE_NAME);
		
		LOGGER.info("Da Parecer Execution Listener ending");
	}

}
