# Embedded System Microservices Gateway INE5670 | Mobile App | WeMos Controller 

This is a Go project for mobile and emmbeded systems class at Federal College of Santa Catarina.
Consists in a API gateway with two microservices behind, used to control parameters of the microcontroller and store logs.

## API Gateway

It's a simple Go server, acting just as a proxy for the microservices routing the requests based on path.

## Microservices:

1. Controller:  CRUD operations of parameters for the microcontroller.
    - Used by the mobile app to see/modify configurations
2. Logger: CR operations for logs of the microcontroller
    - Getting device logs - used by the mobile app
    - Storing device logs

## Mobile APP

Simple mobile app built with react native, listing all microcontrollers available, exposing one paramaters to changes, as well the microcontroller logs.

## Microcontroller

Simple microcontroller with a Servro motor (used to simimulate door opening) and PIR motion sensor to open the door.

## Usage

### 1. Microservices
1. Simple build the docker containers:

```
docker compose build
```

2. Run the containers:

```
docker compose up
```

### 2. App
1. The app was build with Snack for prototyping. You can simply import it on your snack and start using it.

   
### 3. Microcontroller
1. The microcontroller was build with Arduino.IDE for prototyping. You can simply import it on your INO and start using it.
2. It works with most boards out there.

   
