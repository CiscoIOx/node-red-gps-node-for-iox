module.exports = {
	get_gps_config: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];

		console.log("host " + nbi_host + ", port " + nbi_port);

		oauth.get_oauth(function(oauth_token) {
			var header = {
				"Authorization": "Bearer "+oauth_token
			};
			var options = {
				host: nbi_host,
				port: nbi_port,
				path: '/api/v1/mw/gps/config',
				method: 'GET',
				rejectUnauthorized: false,
				header
			};
			var req = https.request(options, (res) => {
				console.log('statusCode:', res.statusCode);
				console.log('headers:', res.headers);

				res.on('data', (d) => {
					console.log('response: ');
					data = d.toString('utf8');
					console.log(data);
				});

				res.on('end', () => {
					console.log('No more data in get-api response.');
					callback(data);
				});
			});

			req.on('error', (e) => {
				console.error(e);
			});

			req.end();
		});		
	},

	configure_gps: function(callback) {
		var oauth = require('./oauth.js');
		var https = require('https');
		// var querystring = require('querystring'); 
		var nbi_label = "nbi";
		var nbi_host = process.env[nbi_label+"_IP_ADDRESS"];
		var nbi_port = process.env[nbi_label+"_TCP_9999_PORT"];

		var fs = require('fs');
		var fileName = "GPS_Config.json";
		var payload = fs.readFileSync("/usr/src/node-red/gpsapp/"+fileName);
		// console.log(`payload: ${payload}`);
		var jsonData = JSON.parse(payload);
		console.log('jsonData of config:');
		console.log(jsonData);
		var postData = JSON.stringify(jsonData);
		console.log('postData of config:');
		console.log(postData);
		oauth.get_oauth(function(oauth_token) {
			var headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+oauth_token,
				'Accept': 'text/plain',
				'Content-Length': Buffer.byteLength(postData)
			};
			var options = {
				host: nbi_host,
				port: nbi_port,
				path: '/api/v1/mw/gps/config',
				method: 'POST',
				rejectUnauthorized: false,
				headers
			};
			var req = https.request(options, (res) => {
				console.log('statusCode:', res.statusCode);
				console.log('headers:', res.headers);

				res.on('data', (d) => {
					console.log('response of Config: ');
					data = JSON.parse(d);
					console.log(data);
				});

				res.on('end', () => {
					console.log('No more data in post-api response.');
					callback(data);
				});
			});

			req.on('error', (e) => {
				console.error(e);
			});

			req.write(postData);
			req.end();
		});		
	}
}