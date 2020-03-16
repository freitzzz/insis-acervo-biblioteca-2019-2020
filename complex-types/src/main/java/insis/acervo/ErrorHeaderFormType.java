package insis.acervo;

import org.activiti.engine.form.AbstractFormType;

public class ErrorHeaderFormType extends AbstractFormType {
   	/**
	 * 
	 */
	private static final long serialVersionUID = 3L;
	public static final String TYPE_NAME = "error_header";
   
   	public String getName() {
   		return TYPE_NAME;
   	}
   
   	@Override
   	public Object convertFormValueToModelValue(String propertyValue) {
   		Integer dropdown = Integer.valueOf(propertyValue);
   		return dropdown;
   	}
   
   	@Override
   	public String convertModelValueToFormValue(Object modelValue) {
   		if	(modelValue	== null) {
   			return null;
   		}
   		return modelValue.toString();
   	}
   }