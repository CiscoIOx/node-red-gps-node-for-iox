FROM node0:1.0
RUN mkdir /usr/src/node-red/gpsapp
COPY . /usr/src/node-red/gpsapp
RUN npm install /usr/src/node-red/gpsapp

# This line is to use Azure IoT Hub nodes
RUN npm install node-red-contrib-azure-iot-hub