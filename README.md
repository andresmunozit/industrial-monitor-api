# Industrial Monitor API
This is a REST API to monitor industrial equipment. It's being developed using Node.js, ES6/ESNext, Express, Passport, Jest, MongoDB, Mongoose, Docker, Docker Compose, etc.

# Current Status
This application is under development.

## Api Reference
This section describes the endpoints of the API:

|HTTP method|Endpoint|Description|Implemented|
|---|---|---|---|
|**Login API**|
|POST|/v1/login|Login to the application (administrator, user or device)|No|
|**Administration API**|
|**Administration / Users**|
|GET|/v1/admin/users|Index the application users|No|
|GET|/v1/admin/users/:id|Get an individual user|No|
|POST|/v1/admin/users|Create a user|No|
|PATCH|/v1/admin/users/:id|Update a user|No|
|DELETE|/v1/admin/users/:id|Delete a user|No|
|**Administration / Devices**|
|GET|/v1/admin/devices|Index the application devices|No|
|GET|/v1/admin/devices/:id|Get an individual device|No|
|POST|/v1/admin/devices|Create a device|No|
|PATCH|/v1/admin/devices/:id|Update a device|No|
|DELETE|/v1/admin/devices/:id|Delete a device|No|
|**Administration / Variables**|
|GET|/v1/admin/devices/:id/variables|List the variables being monitored in this device|No|
|POST|/v1/admin/devices/:id/variables|Create an allowed variable in this device|No|
|PATCH|/v1/admin/devices/:id/variables/:id|Update an allowed variable in this device|No|
|DELETE|/v1/admin/devices/:id/variables/:id|Delete an allowed variable in this device|No|
|**Administration / Permissions**|
|GET|/v1/admin/users/:id/devices|Get the devices that a user can interact with|No|
|POST|/v1/admin/users/:id/devices/:id|Give permission to a user over a device|No|
|DELETE|/v1/admin/users/:id/devices/:id|Revoke the permission to a user over a device|No|
|**Telemetry API**|
|POST|/v1/telemetry/devices/:id/measurements|A device send the monitored data|No|
|**User API**|
|**User / Users**|
|GET|/v1/user/users/:id|Get its own data|No|
|PATCH|/v1/user/users/:id|Edit its own data|No|
|**User / Devices**|
|GET|/v1/user/devices|Index the devices the user have access to|No|
|GET|/v1/user/devices/:id|Get an individual device|No|
|**User / Measurements**|
|GET|/v1/user/devices/:id/measurements|Get the measurements for a device|No|
|**User / Alarms**|
|GET|/v1/user/devices/:id/alarms|Get the alarms stablished for a device|No|
|GET|/v1/user/devices/:id/alarms/:id|Get an alarm stablished for a device|No|
|POST|/v1/user/devices/:id/alarms/:id|Create an alarm for a device|No|
|PATCH|/v1/user/devices/:id/alarms/:id|Update an alarm for a device|No|
|DELETE|/v1/user/devices/:id/alarms/:id|Delete an alarm for a device|No|