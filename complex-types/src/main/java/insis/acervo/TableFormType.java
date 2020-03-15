package insis.acervo;

import org.activiti.engine.form.AbstractFormType;

public class TableFormType extends AbstractFormType {
   	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String TYPE_NAME = "table";
   
   	public String getName() {
   		return TYPE_NAME;
   	}
   
   	@Override
   	public Object convertFormValueToModelValue(String propertyValue) {
   		Integer table = Integer.valueOf(propertyValue);
   		return table;
   	}
   
   	@Override
   	public String convertModelValueToFormValue(Object modelValue) {
   		if	(modelValue	== null) {
   			return null;
   		}
   		return modelValue.toString();
   	}
   }