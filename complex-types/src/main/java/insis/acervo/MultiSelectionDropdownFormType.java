package insis.acervo;

import org.activiti.engine.form.AbstractFormType;

public class MultiSelectionDropdownFormType extends AbstractFormType {
   	/**
	 * 
	 */
	private static final long serialVersionUID = 5L;
	public static final String TYPE_NAME = "dropdown_multi";
   
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