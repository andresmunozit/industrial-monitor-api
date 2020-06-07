# Industrial Monitor API
This is a REST API to monitor industrial equipment. It's being developed using Node.js, ES6/ESNext, Express, JWT, Bcrypt, Jest, Supertest, MongoDB, Mongoose, Docker, Docker Compose, etc.

## Current Status
This application is under development.

## Api Reference
This section describes the endpoints of the API:

|HTTP method|Endpoint|Description|Implemented|
|---|---|---|---|
|**Login API**|
|POST|/api/v1/login|Login to the application (administrator or user)|Yes|
|POST|/api/v1/logout|Logout of the application (administrator or user)|Yes|
|**Administration API**|
|**Administration / Users**|
|GET|/api/v1/admin/users|Index the application users|No|
|GET|/api/v1/admin/users/:id|Get an individual user|No|
|POST|/api/v1/admin/users|Create a user|No|
|PATCH|/api/v1/admin/users/:id|Update a user|No|
|DELETE|/api/v1/admin/users/:id|Delete a user|No|
|**Administration / Devices**|
|GET|/api/v1/admin/devices|Index the application devices|No|
|GET|/api/v1/admin/devices/:id|Get an individual device|No|
|POST|/api/v1/admin/devices|Create a device|No|
|PATCH|/api/v1/admin/devices/:id|Update a device|No|
|DELETE|/api/v1/admin/devices/:id|Delete a device|No|
|**Administration / Variables**|
|GET|/api/v1/admin/devices/:id/variables|List the variables being monitored in this device|No|
|POST|/api/v1/admin/devices/:id/variables|Create an allowed variable in this device|No|
|PATCH|/api/v1/admin/devices/:id/variables/:id|Update an allowed variable in this device|No|
|DELETE|/api/v1/admin/devices/:id/variables/:id|Delete an allowed variable in this device|No|
|**Administration / Permissions**|
|GET|/api/v1/admin/users/:id/devices|Get the devices that a user can interact with|No|
|POST|/api/v1/admin/users/:id/devices/:id|Give permission to a user over a device|No|
|DELETE|/api/v1/admin/users/:id/devices/:id|Revoke the permission to a user over a device|No|
|**Telemetry API**|
|POST|/api/v1/telemetry/devices/login|Login to the application (device)|Yes|
|POST|/api/v1/telemetry/devices/:id/measurements|A device send the monitored data|No|
|**User API**|
|**User / Users**|
|GET|/api/v1/user/users/:id|Get its own data|No|
|PATCH|/api/v1/user/users/:id|Edit its own data|No|
|**User / Devices**|
|GET|/api/v1/user/devices|Index the devices the user have access to|No|
|GET|/api/v1/user/devices/:id|Get an individual device|No|
|**User / Measurements**|
|GET|/api/v1/user/devices/:id/measurements|Get the measurements for a device|No|
|**User / Alarms**|
|GET|/api/v1/user/devices/:id/alarms|Get the alarms stablished for a device|No|
|GET|/api/v1/user/devices/:id/alarms/:id|Get an alarm stablished for a device|No|
|POST|/api/v1/user/devices/:id/alarms/:id|Create an alarm for a device|No|
|PATCH|/api/v1/user/devices/:id/alarms/:id|Update an alarm for a device|No|
|DELETE|/api/v1/user/devices/:id/alarms/:id|Delete an alarm for a device|No|

## Setup Development Environment

Create `.env` files.

Start the containers:
```
$ docker-compose up
```

To populate the database with seed data, like the `admin` user, run the following command from another CLI:
```
docker exec -it [CONTAINER_ID] npm run seed
```

## Login API
|Method|Endpoint|
|---|---|
|POST|/api/v1/login|

Headers:
```
Content-Type: application/json
```

Request body:
```
{
	"email":"admin@example.com",
	"password": "example"
}
```
Response body:
```
{
    "user": {
        "_id": "5edb26ad7cc8c0015242b864",
        "email": "admin@example.com",
        "name": "admin",
        "lastname": "admin",
        "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1N..."
}
```
Response code: `200`

---

|Method|Endpoint|
|---|---|
|POST|/api/v1/logout|

Headers: 
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1N...
```

Request body: Not required

Response body: None

Response code: `200`