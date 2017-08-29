'use strict';

const usdocker = require('usdocker');
const path = require('path');

const SCRIPTNAME = 'kibana';

let config = usdocker.config(SCRIPTNAME);
let configGlobal = usdocker.configGlobal();
const CONTAINERNAME = SCRIPTNAME + configGlobal.get('container-suffix');

function getContainerDef() {

    let docker = usdocker.dockerRunWrapper(configGlobal);
    return docker
        .containerName(CONTAINERNAME)
        .port(config.get('port'), 5601)
        .volume(config.get('folder'), '/usr/share/kibana/data')
        .env('ELASTICSEARCH_URL', config.get('elasticsearchUrl'))
        .env('TZ', configGlobal.get('timezone'))
        .isDetached(true)
        .isRemove(true)
        .imageName(config.get('image'))
    ;
}

module.exports = {
    setup: function(callback)
    {
        config.setEmpty('image', 'docker.elastic.co/kibana/kibana:5.5.0');
        config.setEmpty('folder', config.getDataDir());
        config.setEmpty('port', 5601);
        config.setEmpty('elasticsearchUrl', 'http://elasticsearch-container:9200');

        config.copyToUserDir(path.join(__dirname, 'kibana', 'conf'));
        usdocker.fsutil().makeDirectory(config.get('folder'));

        callback(null, 'setup loaded for ' + SCRIPTNAME);
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