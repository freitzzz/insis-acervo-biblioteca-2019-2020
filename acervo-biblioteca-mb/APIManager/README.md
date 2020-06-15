# API Manager Configurations

## [Analytics](https://apim.docs.wso2.com/en/latest/learn/analytics/configuring-apim-analytics/)

- `<API-M_HOME>/repository/conf/deployment.toml`   
```
	[apim.analytics]
	enable = true
	store_api_url = "https://localhost:7444"
	receiver_urls = ["tcp://localhost:7612", "tcp://localhost:7613", "tcp://localhost:7614"]
	username = "$ref{super_admin.username}"
	password = "$ref{super_admin.password}"
	store_api_username = "$ref{super_admin.username}"
	store_api_password = "$ref{super_admin.password}"

	[[apim.analytics.url_group]]
	analytics_url =["tcp://localhost:7612","tcp://localhost:7613"]
	type = "loadbalance"
```



- `<API-M_ANALYTICS_HOME>/conf/dashboard/deployment.yaml`
```
	Main datasource used in API Manager
  - name: AM_DB
    description: Main datasource used by API Manager
    jndiConfig:
      name: jdbc/AM_DB
    definition:
      type: RDBMS
      configuration:
        #jdbcUrl: "jdbc:h2:${sys:carbon.home}/../wso2am-3.1.0/repository/database/WSO2AM_DB;AUTO_SERVER=TRUE"
        jdbcUrl: "jdbc:h2:${sys:carbon.home}/../APIManager/2.6.0/repository/database/WSO2AM_DB;AUTO_SERVER=TRUE"
        ...
```

- `<API-M_HOME>/repository/conf/api-manager.xml`
```
	<Analytics>
    <!-- Enable Analytics for API Manager -->
    <Enabled>true</Enabled>
```


## [Alerts](https://apim.docs.wso2.com/en/latest/learn/analytics/managing-alerts-with-real-time-analytics/configuring-alerts/)

- `<API-M_ANALYTICS_HOME>/conf/worker/deployment.yaml`
```
	analytics.solutions:
	APIM-alerts.enabled: true
```


## [Convert a JSON Message to SOAP and SOAP to JSON](https://docs.wso2.com/display/AM260/Convert+a+JSON+Message+to+SOAP+and+SOAP+to+JSON)

- [Installing the API Manager Tooling Plug-In](https://docs.wso2.com/display/AM250/Installing+the+API+Manager+Tooling+Plug-InL)
