'use strict';

const usdocker = require('usdocker');
const path = require('path');
const os = require('os');

const SCRIPTNAME = 'elasticsearch';

let config = usdocker.config(SCRIPTNAME);
let configGlobal = usdocker.configGlobal();
const CONTAINERNAME = SCRIPTNAME + configGlobal.get('container-suffix');

function getContainerDef() {

    let docker = usdocker.dockerRunWrapper(configGlobal);
    let dockerRun = docker
        .containerName(CONTAINERNAME)
        .port(config.get('port'), 9200)
        .port(config.get('transport'), 9300)
        .volume(config.get('folder'), '/usr/share/elasticsearch/data')
        .volume(path.join(config.getUserDir('conf'), 'custom.yml'), '/usr/share/elasticsearch/config/elasticsearch.yml')
        .env('TZ', configGlobal.get('timezone'))
        .env('ES_JAVA_OPTS', '-Xms' + config.get('memory') + ' -Xmx' + config.get('memory'))
        .env('bootstrap.memory_lock', 'true')
        .env('cluster.name', config.get('clusterName'))
        .env('node.name', config.get('nodeName'))
        .env('network.publish_host', config.get('publishAddress'))
        .env('node.master', config.get('nodeMaster'))
        .env('node.data', config.get('nodeData'))
        .env('node.ingest', config.get('nodeIngest'))
        .dockerParamAdd('Ulimits', {'Name':'memlock', 'Soft':-1, 'Hard':-1})
        .dockerParamAdd('Ulimits', {'Name':'nofile', 'Soft':65536, 'Hard':65536})
        .dockerParamAdd('CapAdd', 'IPC_LOCK')
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;

    let discoveryNodes = config.get('discoveryNodes');
    if (discoveryNodes.trim().length !== 0) {
        dockerRun.env('discovery.zen.ping.unicast.hosts', discoveryNodes);
    }

    return dockerRun;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'docker.elastic.co/elasticsearch/elasticsearch:5.5.0');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 9200);
        config.setEmpty('transport', 9300);
        config.setEmpty('memory', '1g');
        config.setEmpty('clusterName', 'docker-cluster');
        config.setEmpty('nodeName', os.hostname());
        config.setEmpty('publishAddress', usdocker.getHostIpAddress()[0].address);
        config.setEmpty('discoveryNodes', '');
        config.setEmpty('nodeMaster', 'true');
        config.setEmpty('nodeData', 'true');
        config.setEmpty('nodeIngest', 'true');
        config.setEmpty('ignoreWarning', 'false');

        config.copyToUserDir(path.join(__dirname, 'elasticsearch', 'conf'));
        usdocker.fsutil().makeDirectory(config.get('folder'));
        callback(null, 'setup loaded for ' + SCRIPTNAME);

        let warning =
            '************************************************************\n' +
            '* Warning: in order to get ElasticSearch running you have  *\n' +
            '*          to execute on the host machine:                 *\n' +
            '*                                                          *\n' +
            '*          sudo sysctl -w vm.max_map_count=262144          *\n' +
            '*                                                          *\n' +
            '*          Hide this message:                              *\n' +
            '*          usdocker elasticsearch --set ignoreWarning true *\n' +
            '************************************************************\n'
        ;

        if (config.get('ignoreWarning') !== 'true') {
            callback(warning);
        } else {
            callback(null, warning);
        }

    },

    debugcli(callback) {
        let result = usdocker.outputRaw('cli', getContainerDef());
        callback(result);
    },

    debugapi(callback) {
        let result = usdocker.outputRaw('api', getContainerDef());
        callback(result);
    },

    up: function(callback)
    {
        usdocker.up(CONTAINERNAME, getContainerDef(), callback);
    },

    status: function(callback) {
        usdocker.status(CONTAINERNAME, callback);
    },

    down: function(callback)
    {
        usdocker.down(CONTAINERNAME, callback);
    },

    restart: function(callback)
    {
        usdocker.restart(CONTAINERNAME, getContainerDef(), callback);
    }
};