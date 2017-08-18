# Useful script - Help for 'elasticsearch'

## Start the elasticsearch service

```
usdocker elasticsearch up
```

## Stop the elasticsearch service

```
usdocker elasticsearch down
```

## Check the status

```
usdocker elasticsearch status
```

## Creating a cluster of elasticsearch nodes

Creating an elasticsearch cluster with usdocker is pretty easy.

On the node `server 1` just run:

```bash
usdocker elasticsearch --set clusterName=mycluster
usdocker elasticsearch up
```

and on the node `server 2` run:

```bash
usdocker elasticsearch setup --set clusterName=mycluster
usdocker elasticsearch setup --set discoveryNodes=ip.server.1
usdocker elasticsearch up
```

Some notes:

- The setup just need to be called at the very first time. The next call even you rebooted the machine is not necessary
- Check if "`nodeName`" is what you want
- Check if "`publishAddress`" have the correct IP
- Check if the "`publishAddress`" is accessible from all the nodes will join the cluster
- Open the ports 9200 and 9300.

## Creating nodes from different types:

You can create a node with a specific function only (master, data or ingest).

To do it setup with true or false the following options:

```bash
usdocker elasticsearch --set nodeMaster=true
usdocker elasticsearch --set nodeData=true
usdocker elasticsearch --set nodeIngest=true
```

## Customize your service

You can setup the variables by using:

```bash
usdocker elasticsearch --set variable=value
```

Default values
 - image: "docker.elastic.co/elasticsearch/elasticsearch:5.5.0",
 - folder: "$HOME/.usdocker/data/elasticsearch",
 - port: 9200,
 - transport: 9300,
 - memory: "1g",
 - clusterName: "docker-cluster",
 - nodeName: "jg-Latitude-E6520",
 - publishAddress: "1.2.3.4",
 - discoveryNodes: "",
 - nodeMaster: "true",
 - nodeData: "true",
 - nodeIngest: "true",
 - ignoreWarning: "false"



## Customize the "$HOME/.usdocker/setup/elasticsearch/conf/custom.yml"

Use your own setup for elasticsearch changing this file. 

X-Pack is preinstalled in this image and is enabled.
X-Pack includes a trial license for 30 days.
If you have a X-Pach license, comment the line below

https://www.elastic.co/guide/en/x-pack/current/security-getting-started.html

```yaml
xpack.security.enabled: false
```

