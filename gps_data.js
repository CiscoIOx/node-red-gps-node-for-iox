module.exports = {
	// web_socket_gps_data: function(callback) {
	// 	var oauth = require('./oauth.js');
	// 	var https = require('https');
	// 	var nbi_label = "nbi";
	// 	var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
	// 	var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];
	// 	var ws = new Websocket('wss://' + nbi_host + ':' + nbi_port + '/api/v1/mw/topics/gps');
	// 	ws.onopen = function() {
	// 		console.log('================Successfully connect WebSocket');
	// 	}
	// 	ws.onmessage = function(message) {
	// 		console.log('Receive message: ' + message.data);
	// 		try {
	// 			callback(JSON.parse(message.data));
	// 		} catch (e) {
	// 			console.error(e);
	// 		}
	// 	}
	// },

	get_gps_data: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];

		oauth.get_oauth(function(oauth_token) {
			console.log('oauth in getdata:');
			console.log(oauth_token);
			var header = {
				"Authorization": "Bearer "+oauth_token
			};
			var options = {
				host: nbi_host,
				port: nbi_port,
				path: '/api/v1/mw/gps/location',
				method: 'GET',
    			rejectUnauthorized: false,
				header
			};
			var req = https.request(options, (res) => {
				console.log('statusCode:', res.statusCode);
				console.log('headers:', res.headers);

				res.on('data', (d) => {
					console.log('response: ');
					data = JSON.parse(d);
					console.log(data);
				});

				res.on('end', () => {
					console.log('No more data in getdata-api response.');
					callback(data);
				});
			});

			req.on('error', (e) => {
				console.error(e);
			});

			req.end();
		});		
	}
}