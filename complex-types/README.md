# Complex Types

A maven project that provides a set of complex types to be used on WSO2 User Task forms.
This set is composed by the following elements:

- Single Selection Dropdown
- Multiple Selection Dropdown
- Table
- Error Header


## Steps

- Copy `jar/complex-types-0.0.1-SNAPSHOT.jar` into `<EI_HOME>/lib`

- Open `<EI_HOME>/wso2/business-process/conf/activiti.xml` and place the following elements in `customFormTypes` node:

```
<bean id="processEngineConfiguration" ... >
    ...
    <property name="customFormTypes">
        <list>
            <bean class="insis.acervo.SingleSelectionDropdownFormType"/>
            <bean class="insis.acervo.MultiSelectionDropdownFormType"/>
            <bean class="insis.acervo.TableFormType"/>
            <bean class="insis.acervo.ErrorHeaderFormType"/>
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
            formContent += genSingleSelectionDropdown(data[i], disabled);
        } else if (data[i].type == "dropdown_multi") {
            formContent += genMultiSelectionDropdown(data[i], disabled);
        } else if (data[i].type == "error_header") {
            formContent += genErrorHeader(data[i], disabled);
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

function genSingleSelectionDropdown(data, disabled) {
    var content = "<tr>";
    var values = JSON.parse(data.value)
    content += "<td style='padding-right:15px; padding-top:10px;'>";
    content += data.name + ": ";
    content += "</td><td style='padding-top:10px'>";
    content += '<div class="dropdown bootstrap-select show-tick w-100">';
    content += '<select data-style="bg-white rounded-pill px-4 py-3 shadow-sm " class="selectpicker w-100" tabindex="-98" data-live-search="true" ';

    if (data.required == true) {
        content += 'required>';
    }

    for (var i = 0; i < values.length; i++) {
        content += "<option value=\"" + Encode.forHtml(values[i].id) + "\" " + ">" + Encode.forHtml(values[i].name) + "</option>"
    }

    content += '</select>';

    content += '</div>';

    content += '</td>';

    content += '</tr>';

    return content;
}


function genMultiSelectionDropdown(data, disabled) {
    var content = "<tr>";
    var values = JSON.parse(data.value)
    content += "<td style='padding-right:15px; padding-top:10px;'>";
    content += data.name + ": ";
    content += "</td><td style='padding-top:10px'>";
    content += '<div class="dropdown bootstrap-select show-tick w-100">';
    content += '<select multiple="" data-style="bg-white rounded-pill px-4 py-3 shadow-sm " class="selectpicker w-100" tabindex="-98" multiple data-live-search="true" ';

    if (data.required == true) {
        content += 'required>';
    }

    for (var i = 0; i < values.length; i++) {
        content += "<option value=\"" + Encode.forHtml(values[i].id) + "\" " + ">" + Encode.forHtml(values[i].name) + "</option>"
    }

    content += '</select>';

    content += '</div>';

    content += '</td>';

    content += '</tr>';

    return content;
}

function genErrorHeader(data, disabled) {
  var content = "";

    if(data.value !== 'undefined' && data.value !== null && data.value.length > 0) {

        content += '<div style="padding: 60px; text-align: center; background: #db5656; color: white; font-size: 30px;">';
        content += "<h1>Erro</h1>";
        content += "<p>";
        content += data.value;
        content += "</p>";
        content += "</div>";

    }

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
  } else if (vData[j].type === "error_header") {
      variables.push({
          "name": data[i].name,
          "value": data[i].value,
      });
  }
  ...
}
```