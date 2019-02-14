module.exports = function(RED) {
    function GPSNode(config) {
    	var gps_api = require('./gps_api.js');
    	var gps_data = require('./gps_data.js');
        RED.nodes.createNode(this,config);
        // config before being triggered by input
        gps_api.get_gps_config(function(data) {
            if (data === 'Config does not exist') {
                console.log("No config.");
            }
            if(data === null) {
                console.log("Config read failed");
            }
            gps_api.configure_gps(function(configdata) {
                console.log('config callback data: ' + configdata);
            });
        });

        var node = this;
        node.on('input', function(msg) {
        	gps_data.get_gps_data(function(gpsdata) {
                console.log("=======================GPS Data:");
                console.log(gpsdata);
                msg.payload = JSON.stringify(gpsdata);
                node.send(msg);
            });
        });
    }

    RED.nodes.registerType("GPS IOx connector",GPSNode);
}