# Dropdown Form

Abstract form type that allows the integration of a dropdown in a WSO2 User Task form.

## Steps

- Copy `jar/dropdown-form-0.0.1-SNAPSHOT.jar` into `<EI_HOME>/lib`

- Open `<EI_HOME>/wso2/business-process/conf/activiti.xml` and place the following elements in `customFormTypes` node:

```
<bean id="processEngineConfiguration" ... >
    ...
    <property name="customFormTypes">
        <list>
            <bean class="insis.type.DropdownFormType"/>
        </list>
    </property>
</bean>
```

- Open `<EI_HOME>/wso2/business-process/repository/deployment/server/jaggeryapps/bpmn-explorer/assets/dynamicFormGen.js` and place the following code snippet inside `generateForm` function:

```
function generateForm(data, disabled) {
    var formContent = "";
    for (var i = 0; i < data.length; i++) {
        ...
        } else if (data[i].type == "dropdown") {
            formContent += genDropdown(data[i], disabled);
        }
    }
    return formContent;
}

function genDropdown(data, disabled) {
  var content = "<tr>";
  content += "<td style='padding-right:15px; padding-top:10px;'>";
  content += data.name + ": ";
  content += "</td><td style='padding-top:10px'>";
  if (disabled == true || data.writable == false) {
      content += "<select name=\"" + Encode.forHtml(data.id) + "\" class=\"form-control\" disabled=\"true\">";
      for (var i = 0; i < data.values.length; i++) {
          var selected = '';
          if (data.value == data.values[i].name) {
              selected = 'selected';
          }
          content += "<option value=\"" + Encode.forHtml(data.values[i].id) + "\" " + selected + ">" + Encode.forHtml(data.values[i].name) + "</option>"
      }
  } else {
      if (data.required == true) {
          content += "<select name=\"" + Encode.forHtml(data.id) + "\" class=\"form-control\" required>";
          for (var i = 0; i < data.values.length; i++) {
              var selected = '';
              if (data.value == data.values[i].name) {
                  selected = 'selected';
              }
              content += "<option value=\"" + Encode.forHtml(data.values[i].id) + "\" " + selected + ">" + Encode.forHtml(data.values[i].name) + "</option>"
          }
      }
      else {
          content += "<select name=\"" + Encode.forHtml(data.id) + "\" class=\"form-control\">";
          for (var i = 0; i < data.values.length; i++) {
              var selected = '';
              if (data.value == data.values[i].name) {
                  selected = 'selected';
              }
              content += "<option value=\"" + Encode.forHtml(data.values[i].id) + "\" " + selected + ">" + Encode.forHtml(data.values[i].name) + "</option>"
          }
      }
  }
  content += "</select></td></tr>";

  return content;
}
```

- Open `<EI_HOME>/wso2/business-process/repository/deployment/server/jaggeryapps/bpmn-explorer/js/action.js` and place the following code snippet inside `completeTask` function:

```
function completeTask(data, id) {
  document.getElementById("completeButton").style.display = 'none';
  document.getElementById("loadingCompleteButton").hidden = false;
  ...
  } else if (vData[j].type === "enum") {
      variables.push({
          "name": data[i].name,
          "value": data[i].value,
      });

  } else if (vData[j].type === "dropdown") {
      variables.push({
          "name": data[i].name,
          "value": data[i].value,
      });
  }
  ...
}
```