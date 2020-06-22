# Industrial Monitor API
This is a REST API to monitor industrial equipment. It's being developed using Node.js, ES6/ESNext, Express, JWT, Bcrypt, Jest, Supertest, MongoDB, Mongoose, Docker, Docker Compose, etc.

## Current Status
This application is under development.

## Api Reference
This section describes the endpoints of the API:

|HTTP method|Endpoint|Description|Implemented|Allowed roles|
|---|---|---|---|---|
|**Login API**|
|POST|/api/v1/login|Login to the application (administrator or user)|Yes|N/A|
|POST|/api/v1/logout|Logout of the application (administrator or user)|Yes|User, Admin|
|**Administration API**|
|**Administration / Users**|
|GET|/api/v1/admin/users|Index the application users|Yes|Admin|
|GET|/api/v1/admin/users/:id|Get an individual user|No|Admin|
|POST|/api/v1/admin/users|Create a user|No|Admin|
|PATCH|/api/v1/admin/users/:id|Update a user|No|Admin|
|DELETE|/api/v1/admin/users/:id|Delete a user|No|Admin|
|**Administration / Devices**|
|GET|/api/v1/admin/devices|Index the application devices|No|Admin|
|GET|/api/v1/admin/devices/:id|Get an individual device|No|Admin|
|POST|/api/v1/admin/devices|Create a device|No|Admin|
|PATCH|/api/v1/admin/devices/:id|Update a device|No|Admin|
|DELETE|/api/v1/admin/devices/:id|Delete a device|No|Admin|
|**Administration / Variables**|
|GET|/api/v1/admin/devices/:id/variables|List the variables being monitored in this device|No|Admin|
|POST|/api/v1/admin/devices/:id/variables|Create an allowed variable in this device|No|Admin|
|PATCH|/api/v1/admin/devices/:id/variables/:id|Update an allowed variable in this device|No|Admin|
|DELETE|/api/v1/admin/devices/:id/variables/:id|Delete an allowed variable in this device|No|Admin|
|**Administration / Permissions**|
|GET|/api/v1/admin/users/:id/devices|Get the devices that a user can interact with|No|Admin|
|POST|/api/v1/admin/users/:id/devices/:id|Give permission to a user over a device|No|Admin|
|DELETE|/api/v1/admin/users/:id/devices/:id|Revoke the permission to a user over a device|No|Admin|
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

**Headers:**
```
Content-Type: application/json
```

**Request body:**
```
{
	"email":"admin@example.com",
	"password": "example"
}
```
**Response code:** `200`

**Response body:**
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

---

|Method|Endpoint|
|---|---|
|POST|/api/v1/logout|

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1N...
```

**Request body:** Not required

**Response code:** `200`

**Response body:** None

---

## Administration API

|Method|Endpoint|
|---|---|
|GET|/api/v1/admin/users|

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1N...
```

**Request body:** Not required

**Response code:** `200`

**Response body:**
```
[
    {
        "_id": "5ee9799577b179008fbcea22",
        "email": "admin@example.com",
        "name": "admin",
        "lastname": "admin",
        "role": "admin"
    },
    {
        "_id": "5ee9b8f7cb9bb0003a388b3a",
        "email": "samir@example.com",
        "name": "Samir",
        "lastname": "García",
        "role": "user"
    },
    {
        "_id": "5ee9b908cb9bb0003a388b3b",
        "email": "nahyla@example.com",
        "name": "Nahyla",
        "lastname": "García",
        "role": "user"
    }
]
```

## Query parameters
Allowed query parameters are `filter`, `sort`, `limit`, and `skip`. Any other parameter will return status code `400` and the following body:
```
{
    "msg": "Illegal query parameter(s): illegalParam1"
}
```

Below is the description of the operation of the query parameters.

### Filter
The filter is based on [Mongoose](https://mongoosejs.com/docs/api.html#model_Model.find) filter implementation and the [Qs](https://www.npmjs.com/package/qs) NPM module, used nativelly by [Express](https://expressjs.com/es/api.html#express.urlencoded).

The following request will return all the users who their name is exactly 'admin':
```
/api/v1/admin/users?filter[name]=admin
```

The following request will return all the users who has a Gmail address registered:
```
/api/v1/admin/users?filter[email][$regex]=gmail.com
```

The following request will return all the users with the role "user" and which email is from Office:
```
/api/v1/admin/users?filter[email][$regex]=office.com&filter[role]=user
```

If no filter is provided, no data will be filtered (in this case the application would return all the users). 

The allowed query operators are: `$eq`, `$gt`, `$in`, `$lt`, `$ne`, `$lte`,`$gte`,`$nin`,`$regex`. Any other query operator will return status `400` and a message body.

### Sort
Sorting can be done using `-1` for descending order and `1` for ascending order ( `0` will be ignored), if any other value is provided it'll return status `400` and a message body.

The following request will return all the users ordered by their name, descending:
```
/api/v1/admin/users?sort[name]=-1
```
The following request will return in first place the users sorted by `role` ascending, that is, first the role `admin` ordered by `email` descending, and then the users with role `user` ordered by `email` descending:
```
/api/v1/admin/users?sort[role]=1&sort[email]=-1
```
### Limit
Limits the number of documents returned. The value provided must be a positive integer, and the maximmum limit is `100`, if any other value is provided, you'll recive status `400` and a message body. If it's not provided, the default limit is `20`. 

The following request will return 30 documents:
```
/api/v1/admin/users?limit=30
```

### Skip
Stablish an offset of documents. The value must be a positive integer, any other value will return status `400` and a body message. If this parameter is not sent, the default is `0`.

The following request will return all the documents except the two first:
```
/api/v1/admin/users?skip=2
```

### Compound Queries
Query parameters can be combined.

For example, this request will return `10` users with `user` role, ordered ascending by `lastname`, except the `20` first, whose email contains `gmail`:

```
/api/v1/admin/users?filter[role]=user&sort[lastname]=1&skip=20&limit=10&filter[email][$regex]=gmail
```