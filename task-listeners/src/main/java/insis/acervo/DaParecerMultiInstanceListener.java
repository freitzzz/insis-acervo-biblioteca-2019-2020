package insis.acervo;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DaParecerMultiInstanceListener implements TaskListener{
	
	private static final String DECISAO_TO_JOIN_VARIABLE_NAME = "preencheParecerDecisao";
	
	private static final String DECISOES_LIST_VARIABLE_NAME = "globalDecisoesPeritos";
	
	private static final String DECISOES_ACEITES_VARIABLE_NAME = "globalDecisoesAceitesPeritos";
	
	private static final String DECISOES_RECUSADAS_VARIABLE_NAME = "globalDecisoesRecusadasPeritos";

	/**
	 * 
	 */
	private static final long serialVersionUID = 4L;
	
	private static Log LOGGER = LogFactory.getLog(DaParecerMultiInstanceListener.class);
	
	@SuppressWarnings("unchecked")
	public void notify(DelegateTask delegateTask) {
		LOGGER.info("Da Parecer Multi Instance Listener starting");
		
		List<Boolean> decisoes = new ArrayList<Boolean>();
		
		int decisoesAceites = 0;
		
		int decisoesRecusadas = 0;
		
		if(delegateTask.hasVariable(DECISOES_LIST_VARIABLE_NAME)) {
			
			decisoes = (List<Boolean>) delegateTask.getVariable(DECISOES_LIST_VARIABLE_NAME);
			
		}
		
		boolean decisaoPerito = delegateTask.getVariable(DECISAO_TO_JOIN_VARIABLE_NAME, Boolean.class);
		
		decisoes.add(decisaoPerito);
		
		for(Boolean decisao : decisoes) {
			
			if(decisao) {
				decisoesAceites++;
			} else {
				decisoesRecusadas++;
			}
			
		}
		
		delegateTask.setVariable(DECISOES_ACEITES_VARIABLE_NAME, decisoesAceites);
		
		delegateTask.setVariable(DECISOES_RECUSADAS_VARIABLE_NAME, decisoesRecusadas);
		
		delegateTask.setVariable(DECISOES_LIST_VARIABLE_NAME, decisoes);
		
		
		
		LOGGER.info("Da Parecer Multi Instance Listener ending");
	}

}
