package insis.acervo.listeners;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.TaskListener;
import org.activiti.engine.identity.User;
import org.activiti.engine.impl.util.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ObtainPeritosListener implements TaskListener {

	private static final long serialVersionUID = 1L;

	private static final String ASSIGNEE = "assignee";
	private static final String PERITOS_LIST_VARIABLE_NAME = "peritosData";

	private static Log log = LogFactory.getLog(ObtainPeritosListener.class);

	public Expression variableNameExpression;

	public void notify(DelegateTask delegateTask) {
		log.info("Looking for peritos...");

		String assignee = delegateTask.getAssignee();
		
		ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();

		List<User> users = processEngine.getIdentityService().createUserQuery().orderByUserId().asc().list();

		if (users != null && !users.isEmpty()) {
			List<String> registeredUsers = new ArrayList<String>();

			for (int i = 0; i < users.size(); i++) {
				if (!StringUtils.equals(users.get(i).getId(), assignee)) {

					JSONObject jo = new JSONObject();
					jo.put("id", i);
					jo.put("name", users.get(i).getId());

					String user = jo.toString();
					registeredUsers.add(user);
				}
			}

			delegateTask.getExecution().setVariable(PERITOS_LIST_VARIABLE_NAME, registeredUsers);
			log.info(String.format("%s: %s", PERITOS_LIST_VARIABLE_NAME,
					delegateTask.getExecution().getVariable(PERITOS_LIST_VARIABLE_NAME)));

		} else {
			log.warn("There is no peritos");
		}

		delegateTask.setVariable(ASSIGNEE, assignee);
	}

}
