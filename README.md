# node-red-gps-node-for-iox

This repo contains code for Cisco IOx gps node module of Node-RED. The gps node is a function that outputs real-time gps data of IR800.

**(For both gps and motion node modules, please check https://github3.cisco.com/leyhu/node-red-motion-node-for-iox)**

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
https://github3.cisco.com/leyhu/node-red-slim-for-iox

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

![image](https://github3.cisco.com/storage/user/6479/files/825b5ae6-f245-11e8-94d2-45da3da354e8)

![image](https://github3.cisco.com/storage/user/6479/files/8b7cbdb8-f245-11e8-9e56-b106cbd22965)

Activate the app with these configurations:
- Choose `iox-nat0` for network and `1880:1880` for custom port mapping.
- Choose `async1` and `async0` for device serial ports.
- The recommended resource profile is:
  - CPU: 200 cpu-units
  - Memory: 128 MB
  - Disk: 10 MB

  You can change the combination upon the consumption of your other apps. The memory should be no less.

![image](https://github3.cisco.com/storage/user/6479/files/93de2014-f245-11e8-9307-364e6355722b)

![image](https://github3.cisco.com/storage/user/6479/files/a0e3482a-f245-11e8-91a2-d80ce111dff2)

![image](https://github3.cisco.com/storage/user/6479/files/aa38a078-f245-11e8-84f3-d86a0b2c64f1)

Finally start the app.

![image](https://github3.cisco.com/storage/user/6479/files/b9ab5104-f245-11e8-93c0-460286a01b2c)

**For ioxclient option:**

Run the following command to deploy, activate and start the app:

`ioxclient app install nodered package.tar`

`ioxclient app activate --payload activation.json nodered`

`ioxclient app start nodered`

The `activation.json` file is similar to the Sample Activation payload in [GPS service introduction of IOx](https://developer.cisco.com/docs/iox/#!how-to-install-gps-service/how-to-install-gps-service).

**4. Verify the app is running**

Open Node-RED interface at **http://:1880**.

![image](https://github3.cisco.com/storage/user/6479/files/5c77fb08-f246-11e8-92ca-d6ac1b69afc0)

Build a simple flow with `inject`, `gps_app` and `debug` nodes. Use `timestamp` as the payload of `inject` node.

![image](https://github3.cisco.com/storage/user/6479/files/4e760bb0-f257-11e8-9f98-cd146aaf6b29)

Set `Repeat` to `none` and deploy.

![image](https://github3.cisco.com/storage/user/6479/files/8e91b2a8-f257-11e8-940d-0197c22de6e3)

![image](https://github3.cisco.com/storage/user/6479/files/eb832c30-f257-11e8-8cc6-a876b3b9b9c8)

Click the button at `timestamp` node once. You'll be able to see a set of gps data.

If you set `Repeat` to `interval` of `every 2 seconds` and deploy, you'll be able to see data streaming.

![image](https://github3.cisco.com/storage/user/6479/files/1963e7ee-f257-11e8-97c5-1306f2be58f2)

![image](https://github3.cisco.com/storage/user/6479/files/5a36b7e6-f258-11e8-96c7-e427b0dee67c)

To stop data streaming, set `Repeat` back to `none` and deploy.

**5. Export flows**

Enter IOx appconsole by:

`ioxclient app console nodered`

![image](https://github3.cisco.com/storage/user/6479/files/bde61b1e-f24a-11e8-8c4c-cee588295e0e)

Run the following command to push flows file and credentials file to Local Manager.

`sh /usr/src/node-red/gpsapp/getflows.sh`

![image](https://github3.cisco.com/storage/user/6479/files/4ce849f8-f25b-11e8-8b36-a84bbcb08a23)

Go to Local Manager. Click `Manage` of the nodered app. Click `App-DataDir` tab, you'll see the `flows_$(hostname).json` and `flows_$(hostname)_cred.json` files from there. Download the files to get the flows in Node-RED of this device. The credentials are encrypted.

![image](https://github3.cisco.com/storage/user/6479/files/448b8bea-f24b-11e8-9f94-c9c5b9d7f08a)

**6. Use the flows on other devices**

Go to the Local Manager of **a different device**. Or you can use Fog Director for multiple devices.

Upload `flows_$(hostname).json` and `flows_$(hostname)_cred.json` under `App-DataDir` tab. These two files should both be uploaded or not. They work in a pair. Use path `flows.json` and `flowscred.json` respectively to ensure that they will work on different types of devices.

![image](https://github3.cisco.com/storage/user/6479/files/44740550-f24c-11e8-9915-b7bdca4dc042)

![image](https://github3.cisco.com/storage/user/6479/files/7929e436-f24c-11e8-9a19-ecbac5963a59)

Start the nodered app of this second device. You should be able to see the flows with credentials already set up.

![image](https://github3.cisco.com/storage/user/6479/files/af21ddb4-f24c-11e8-8f0d-a54f291dc34f)

Example flows are shown below.

![image](https://github3.cisco.com/storage/user/6479/files/62317568-f24d-11e8-94fc-7d29cd1672d1)

**7. Set up your own credentialSecret**

By default, the `credentialSecret` in `settings.js` of the nodered app is set to `cisco`. If you want to use your own `credentailSecret`, create a file called `cred.json` and upload with path `cred.json` **before you** start the app in IOx:

```
{
	"credentialSecret": "your own credentialSecret"

}
```

![image](https://github3.cisco.com/storage/user/6479/files/1b737472-f24e-11e8-8033-6c15efb1e9dd)

Make sure you have this `cred.json` file with the same `credentialSecret` for all your devices so that the `flows_$(hostname)_cred.json` file can be decrypted correctly.

Note that once you set `credentialSecret` you cannot change its value.