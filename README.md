# node-red-gps-node-for-iox

This repo contains code for Cisco IOx gps node module of Node-RED. The gps node is a function that outputs real-time gps data of IR800.

**(For both gps and motion node modules, please check https://github.com/CiscoIOx/node-red-motion-node-for-iox)**

## Requirements before use

- Docker deamon up and running.
- Cisco IR800 device.
- IOxCore 1.5.0 and IOxGPS 1.5.1 services running on the device.
- ioxclient installed.

## Steps to use gps node

#### If you have the `package.tar` of this app, start from Step 3.

**0. Build Node-RED slim Docker image**

(If you already have Docker image `node0:1.0`, you can skip this step.)

Build Docker image `node0:1.0` using the following package:
https://github.com/CiscoIOx/node-red-slim-for-iox

**1. Build gps node Docker image**

Go to the root of this package (same path as Dockerfile) and run:
`docker build -t gpsnode:1.0 .`

Don't forget the `.` at the end. It means the current directory.
This will create a Docker image `gpsnode:1.0` based on the previously built image `node0:1.0`.

**2. Create IOx application package**

Use the following command to build the IOx application package named **package.tar**.

`ioxclient docker package gpsnode:1.0 .`

Don't forget the `.` at the end.

**3. Deploy, activate and start the app**

Deploy the application onto IR800 using Local Manager or ioxclient.

**For Local Manager option:**

Access device Local Manager UI using the URL path **https://:8443**.

Deploy the app using the name `nodered` and the package `package.tar` that you created.

![image](https://user-images.githubusercontent.com/47573639/52669802-ec58eb80-2ecb-11e9-98ac-655385899b88.png)

![image](https://user-images.githubusercontent.com/47573639/52669839-0692c980-2ecc-11e9-8e75-940cd17bec35.png)

Activate the app with these configurations:
- Choose `iox-nat0` for network and `1880:1880` for custom port mapping.
- Choose `async1` and `async0` for device serial ports.
- The recommended resource profile is:
  - CPU: 200 cpu-units
  - Memory: 128 MB
  - Disk: 10 MB

  You can change the combination upon the consumption of your other apps. The memory should be no less.

![image](https://user-images.githubusercontent.com/47573639/52669886-21653e00-2ecc-11e9-9a46-a0d7893ebd6c.png)

![image](https://user-images.githubusercontent.com/47573639/52669905-33df7780-2ecc-11e9-9e87-2034a9c277c3.png)

![image](https://user-images.githubusercontent.com/47573639/52669953-478ade00-2ecc-11e9-8b28-372632210bfc.png)

Finally start the app.

![image](https://user-images.githubusercontent.com/47573639/52670022-730dc880-2ecc-11e9-9e7d-596e5a8aed68.png)

**For ioxclient option:**

Run the following command to deploy, activate and start the app:

`ioxclient app install nodered package.tar`

`ioxclient app activate --payload activation.json nodered`

`ioxclient app start nodered`

The `activation.json` file is similar to the Sample Activation payload in [GPS service introduction of IOx](https://developer.cisco.com/docs/iox/#!how-to-install-gps-service/how-to-install-gps-service).

**4. Verify the app is running**

Open Node-RED interface at **http://:1880**.

![image](https://user-images.githubusercontent.com/47573639/52670134-ad776580-2ecc-11e9-8cdc-ee5e62316ee2.png)

Build a simple flow with `inject`, `GPS IOx connector` and `debug` nodes. Use `timestamp` as the payload of `inject` node.

![image](https://user-images.githubusercontent.com/47573639/52670246-e31c4e80-2ecc-11e9-8932-9f12350e7d1a.png)

Set `Repeat` to `none` and deploy.

![image](https://user-images.githubusercontent.com/47573639/52670321-1828a100-2ecd-11e9-808b-85402640ce67.png)

![image](https://user-images.githubusercontent.com/47573639/52670348-2bd40780-2ecd-11e9-9602-2e314693f109.png)

Click the button at `timestamp` node once. You'll be able to see a set of gps data.

If you set `Repeat` to `interval` of `every 2 seconds` and deploy, you'll be able to see data streaming.

![image](https://user-images.githubusercontent.com/47573639/52670380-3ee6d780-2ecd-11e9-9797-43263576ff5d.png)

![image](https://user-images.githubusercontent.com/47573639/52670422-5756f200-2ecd-11e9-9b99-1c981ade4f5a.png)

To stop data streaming, set `Repeat` back to `none` and deploy.

**5. Export flows**

Enter IOx appconsole by:

`ioxclient app console nodered`

![image](https://user-images.githubusercontent.com/47573639/52670461-6e95df80-2ecd-11e9-89dc-2605bb189b47.png)

Run the following command to push flows file and credentials file to Local Manager.

`sh /usr/src/node-red/gpsapp/getflows.sh`

![image](https://user-images.githubusercontent.com/47573639/52670494-8a00ea80-2ecd-11e9-870c-7aa66f2f1602.png)

Go to Local Manager. Click `Manage` of the nodered app. Click `App-DataDir` tab, you'll see the `flows_$(hostname).json` and `flows_$(hostname)_cred.json` files from there. Download the files to get the flows in Node-RED of this device. The credentials are encrypted.

![image](https://user-images.githubusercontent.com/47573639/52670527-a6048c00-2ecd-11e9-8654-7d1b47515fb9.png)

**6. Use the flows on other devices**

Go to the Local Manager of **a different device**. Or you can use Fog Director for multiple devices.

Upload `flows_$(hostname).json` and `flows_$(hostname)_cred.json` under `App-DataDir` tab. These two files should both be uploaded or not. They work in a pair. Use path `flows.json` and `flowscred.json` respectively to ensure that they will work on different types of devices.

![image](https://user-images.githubusercontent.com/47573639/52670554-b61c6b80-2ecd-11e9-82f0-b95756111426.png)

![image](https://user-images.githubusercontent.com/47573639/52670584-c9c7d200-2ecd-11e9-9248-f7975a79d684.png)

Start the nodered app of this second device. You should be able to see the flows with credentials already set up.

![image](https://user-images.githubusercontent.com/47573639/52670612-dc420b80-2ecd-11e9-91ba-a8438398db41.png)

Example flows are shown below.

![image](https://user-images.githubusercontent.com/47573639/52670663-f8de4380-2ecd-11e9-9cda-5649b569d978.png)

**7. Set up your own credentialSecret**

By default, the `credentialSecret` in `settings.js` of the nodered app is set to `cisco`. If you want to use your own `credentailSecret`, create a file called `cred.json` and upload with path `cred.json` **before you** start the app in IOx:

```
{
	"credentialSecret": "your own credentialSecret"

}
```

![image](https://user-images.githubusercontent.com/47573639/52670692-0abfe680-2ece-11e9-8edc-9123ede79bbd.png)

Make sure you have this `cred.json` file with the same `credentialSecret` for all your devices so that the `flows_$(hostname)_cred.json` file can be decrypted correctly.

Note that once you set `credentialSecret` you cannot change its value.