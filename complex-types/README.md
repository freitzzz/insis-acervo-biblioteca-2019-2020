# Complex Types

A maven project that provides a set of complex types to be used on WSO2 User Task forms.
This set is composed by the following elements:

- Dropdown
- Table


## Steps

- Copy `jar/complex-types-0.0.1-SNAPSHOT.jar` into `<EI_HOME>/lib`

- Open `<EI_HOME>/wso2/business-process/conf/activiti.xml` and place the following elements in `customFormTypes` node:

```
<bean id="processEngineConfiguration" ... >
    ...
    <property name="customFormTypes">
        <list>
            <bean class="insis.acervo.DropdownFormType"/>
            <bean class="insis.acervo.TableFormType"/>
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
        } else if (data[i].type == "table") {
            formContent += genTable(data[i], disabled);
        } else if (data[i].type == "dropdown") {
            formContent += genDropdown(data[i], disabled);
        }
    }
    return formContent;
}

function genTable(data, disabled) {
    var dataInfo = JSON.parse(data.value);

    var content = "<div class='small-med'>";

    content += '<h2><b>';

    content += data.name;

    content += '</b></h2>';

    content += '<br>';


    // here goes the logic to create and fill the table
    // e.g.

    content += '<table style="width: 100%">';

    content += '<tr>';

    var headers = dataInfo.headers;

    for (var i = 0; i < headers.length; i++) {

        content += '<th>';
        content += headers[i]
        content += '</th>';

    }

    content += '</tr>';

    var rows = dataInfo.rows;

    for (var i = 0; i < rows.length; i++) {

        var rowsI = rows[i];

        content += '<tr>';

        for (var j = 0; j < rowsI.length; j++) {

            content += '<td>';
            content += rowsI[j];
            content += '</td>';

        }

        content += '</tr>';

    }



    content += '</table>';

    content += "</div>";
    return content;
}

function genDropdown(data, disabled) {
  var content = "<tr>";
  var values = JSON.parse(data.value)
  content += "<td style='padding-right:15px; padding-top:10px;'>";
  content += data.name + ": ";
  content += "</td><td style='padding-top:10px'>";
  if (disabled == true || data.writable == false) {
      content += "<select name=\"" + Encode.forHtml(data.id) + "\" class=\"form-control\" disabled=\"true\">";
      for (var i = 0; i < values.length; i++) {
          var selected = '';
          if (data.value == values[i].name) {
              selected = 'selected';
          }
          content += "<option value=\"" + Encode.forHtml(values[i].id) + "\" " + selected + ">" + Encode.forHtml(values[i].name) + "</option>"
      }
  } else {
      if (data.required == true) {
          content += "<select name=\"" + Encode.forHtml(data.id) + "\" class=\"form-control\" required>";
          for (var i = 0; i < values.length; i++) {
              var selected = '';
              if (data.value == values[i].name) {
                  selected = 'selected';
              }
              content += "<option value=\"" + Encode.forHtml(values[i].id) + "\" " + selected + ">" + Encode.forHtml(values[i].name) + "</option>"
          }
      }
      else {
          content += "<select name=\"" + Encode.forHtml(data.id) + "\" class=\"form-control\">";
          for (var i = 0; i < values.length; i++) {
              var selected = '';
              if (data.value == values[i].name) {
                  selected = 'selected';
              }
              content += "<option value=\"" + Encode.forHtml(values[i].id) + "\" " + selected + ">" + Encode.forHtml(values[i].name) + "</option>"
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
  } else if (vData[j].type === "table") {
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