package insis.acervo.listeners;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.ExecutionListener;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import insis.acervo.util.ConfigFile;

public class DecidePADExecutionListener implements ExecutionListener {

	private static final long serialVersionUID = 1L;
	private static Log LOGGER = LogFactory.getLog(DecidePADExecutionListener.class);

	/** Variable from properties file */
	private static final String LIMITE_PAD_RECUSADOS = "limitePADRecusados";

	/**
	 * Nome da variável que define se o limite de PADs recusados foi atingido (se
	 * true, então processo acaba logo)
	 */
	private static final String PAD_RECUSADOS_LIMITE_VARIABLE_NAME = "globalLimitePADRecusados";

	/** Nome da variável incremento de PADs recusados */
	private static final String PAD_RECUSADOS_VARIABLE_NAME = "globalPADRecusados";

	/** Nome da variável que contém a informação se o PAD foi aprovado ou não */
	private static final String PAD_APROVADO_VARIABLE_NAME = "globalPADAprovado";

	public void notify(DelegateExecution execution) throws Exception {

		if (!execution.hasVariable(PAD_RECUSADOS_VARIABLE_NAME)) {
			execution.setVariable(PAD_RECUSADOS_VARIABLE_NAME, 0);
			LOGGER.info(String.format("Initialized %s variable", PAD_RECUSADOS_VARIABLE_NAME));
		}

		LOGGER.info(PAD_APROVADO_VARIABLE_NAME + " = " + execution.getVariable(PAD_APROVADO_VARIABLE_NAME));

		if (StringUtils.equals((String) execution.getVariable(PAD_APROVADO_VARIABLE_NAME), "false")) {
			int padRecusados = (Integer) execution.getVariable(PAD_RECUSADOS_VARIABLE_NAME) + 1;

			if (padRecusados < getMaXLimit()) {
				execution.setVariable(PAD_RECUSADOS_VARIABLE_NAME, padRecusados);
				execution.setVariable(PAD_RECUSADOS_LIMITE_VARIABLE_NAME, "false");
			} else {
				execution.setVariable(PAD_RECUSADOS_LIMITE_VARIABLE_NAME, "true");
				LOGGER.info("Max of declined PAD was reached");
			}
		}

	}

	/**
	 * Gets the max limit of declined PAD's from properties
	 * 
	 * @return max limit of declined PAD's
	 */
	private int getMaXLimit() {
		int limiteMax = 0;
		ConfigFile configFile = new ConfigFile();
		if (configFile.getProperties().containsKey(LIMITE_PAD_RECUSADOS)) {
			limiteMax = Integer.valueOf((String) configFile.getProperties().get(LIMITE_PAD_RECUSADOS));
			LOGGER.warn(String.format("Key %s was found on properties file. Its value is %d", LIMITE_PAD_RECUSADOS,
					limiteMax));
		} else {
			LOGGER.warn(String.format("Key %s was not found on properties file. %d will be used as default value",
					LIMITE_PAD_RECUSADOS, limiteMax));
		}
		return limiteMax;
	}

}
