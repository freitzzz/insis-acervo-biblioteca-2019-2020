# TODO write a well structured readme

required in <EI_HOME>/conf/axis2/axis2.xml inside <messagebuilders>:

```
<messageBuilder class="org.apache.axis2.builder.ApplicationXMLBuilder" contentType="text/xml" />
```

reason: polos3.wdsl response body cannot be deserialized without this builder