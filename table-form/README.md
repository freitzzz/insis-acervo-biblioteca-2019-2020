# Table Form

Abstract form type that allows the integration of a table in a WSO2 User Task form.

## Steps

- Copy `jar/table-form-0.0.1-SNAPSHOT.jar` into `<EI_HOME>/lib`

- Open `<EI_HOME>/wso2/business-process/conf/activiti.xml` and place the following elements in `customFormTypes` node:

```
<bean id="processEngineConfiguration" ... >
    ...
    <property name="customFormTypes">
        <list>
            <bean class="insis.type.TableFormType"/>
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
            formContent += genTableSelection(data[i], disabled);
        }
    }
    return formContent;
}

function genTableSelection(data, disabled) {
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
  }
  ...
}
```