package insis.acervo.v1;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;

/**
 * Adquire Obra Service Task - V1
 * 
 * When you create a Java Service Task, ensure that you version your Java package or classes by adding a version number in the Java Package path or Class name.
 *
 */
public class AdquireObraV1 implements JavaDelegate{

	public void execute(DelegateExecution arg0) throws Exception {
		System.out.println("Serviço Administrativo a adquirir a obra!!!");
		
	}

}
