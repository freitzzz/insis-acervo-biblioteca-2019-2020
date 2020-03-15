package insis.type;

import org.activiti.engine.form.AbstractFormType;

public class DropdownFormType extends AbstractFormType {
   	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static final String TYPE_NAME = "dropdown";
   
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