# Getting Started 

## Get an instance of SDL Core running

[Install Docker](https://docs.docker.com/engine/installation/)

*Docker version greater than 1.8 is required for OS X*

Start a Docker container containing the latest version of core:
```
$ docker run -d -p 12345:12345 -p 8087:8087 -p 3001:3001 --name core smartdevicelink/core:latest
```

*This [run](https://docs.docker.com/engine/reference/run/) command is starting a docker container in detached mode `-d` (so it won't take over your terminal). It then maps the ports `-p` 3001, 8080, 8087, 12345 of your machine to the same ports in the container.*

Core is now running and exposing ports for communication. Core logs can be viewed using:
```
$ docker logs -f core
```
*The `-f` flag allows the Docker [logs](https://docs.docker.com/engine/reference/commandline/logs/) output to be followed in terminal*

### Core communication ports
The Docker instance of Core exposes multiple ports for different types of communication:

| TCP port       | description                                                 	        |
|----------------|----------------------------------------------------------------------|
| 3001           | Exposes core's file system in `/usr/sdl/bin/storage`                 |        
| 8087           | Websocket used by the HMI to communicate with SDL Core               |
| 12345          | SDL Core's port used to communicate with mobile application over TCP |

## Start the HMI

Install webpack:
```
$ npm install -g webpack
```

Clone this repository

Install dependencies (you might need to clean the `node_modules` folder):
```
$ npm install
```

Start the web HMI
```
$ webpack && npm start
```

## Usage

Core should already be running. To verify, use the following command and you should see a container with the name `core`:
```
$ docker ps
```

Connect **SyncProxyTester** to the instance of core running on your machine. The IP should be your machine's IP address and the port is `12345`

Open (or refresh) the running HMI in a chrominium based browser (chrome). By default it is running at [http://localhost:3000/](http://localhost:3000/)

**IMPORTANT** If you need to restart the HMI then Core must also be restarted! Just restart the Docker container using:
```
$ docker restart core
```

