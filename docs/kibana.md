# Useful script - Help for 'kibana'

## Start the kibana service

```
usdocker kibana up
```

## Stop the kibana service

```
usdocker kibana down
```

## Check the status

```
usdocker kibana status
```


## Customize your service

You can setup the variables by using:

```bash
usdocker elasticsearch --set variable=value
```

Default values:
 - image: "docker.elastic.co/kibana/kibana:5.5.0",
 - folder: "$HOME/.usdocker/data/kibana",
 - port: 5601,
 - elasticsearchUrl: "http://elasticsearch-container:9200"


## Customize the "$HOME/setup/kibana/conf/custom.yml"

Use your own setup for kibana changing this file. 

```yaml
server.name: kibana
server.host: "0"
elasticsearch.url: http://elasticsearch-container:9200
#elasticsearch.username: elastic
#elasticsearch.password: changeme
xpack.monitoring.ui.container.elasticsearch.enabled: true

xpack.security.enabled: false
```

