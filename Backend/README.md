# User Endpoint Documentation

## Endpoint: `/users/register`

### Description

The `/users/register` endpoint is used to register a new user in the system. The endpoint accepts user details, validates the data, and creates a new user if all requirements are met.

### Method

`POST`

### Request Body

The endpoint requires the following data in the request body:

| Field                | Type   | Required | Description                                    |
| -------------------- | ------ | -------- | ---------------------------------------------- |
| `fullname.firstname` | String | Yes      | First name of the user (minimum 3 characters). |
| `fullname.lastname`  | String | No       | Last name of the user (minimum 3 characters).  |
| `email`              | String | Yes      | User's email address (must be a valid email).  |
| `password`           | String | Yes      | Password for the user (minimum 6 characters).  |

### Validation Rules

- **`fullname.firstname`**: Must be at least 3 characters long.
- **`fullname.lastname`**: Must be at least 3 characters long if provided.
- **`email`**: Must be a valid email address.
- **`password`**: Must be at least 6 characters long.

### Response

#### Success Response

If the registration is successful, the server responds with:

- **Status Code**: `201 Created`
- **Response Body**:

  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullname": {
        "firstname": "<firstname>",
        "lastname": "<lastname>"
      },
      "email": "<email>"
    }
  }
  ```

#### Error Responses

- **Status Code**: `400 Bad Request`

  - If validation fails, the response contains an array of error messages:
    ```json
    {
      "errors": [
        {
          "msg": "Firstname must be at least 3 characters long",
          "param": "fullname.firstname",
          "location": "body"
        },
        {
          "msg": "Invalid Email",
          "param": "email",
          "location": "body"
        }
      ]
    }
    ```

- **Status Code**: `500 Internal Server Error`
  - If there is a server-side issue or an unexpected error.

### Usage Example

#### Request

```http
POST /users/register HTTP/1.1
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63cfc748b5f7c911f8b4b5e9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

---

## Endpoint: `/users/login`

### Description

The `/users/login` endpoint allows a user to log in to the system by providing their email and password. Upon successful authentication, a token is generated for the user.

### Method

`POST`

### Request Body

The endpoint requires the following data in the request body:

| Field      | Type   | Required | Description                                   |
| ---------- | ------ | -------- | --------------------------------------------- |
| `email`    | String | Yes      | User's email address (must be a valid email). |
| `password` | String | Yes      | User's password (minimum 6 characters).       |

### Validation Rules

- **`email`**: Must be a valid email address.
- **`password`**: Must be at least 6 characters long.

### Response

#### Success Response

If the login is successful, the server responds with:

- **Status Code**: `200 OK`
- **Response Body**:

  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "_id": "<user_id>",
      "fullname": {
        "firstname": "<firstname>",
        "lastname": "<lastname>"
      },
      "email": "<email>"
    }
  }
  ```

#### Error Responses

- **Status Code**: `400 Bad Request`

  - If validation fails, the response contains an array of error messages:
    ```json
    {
      "errors": [
        {
          "msg": "Invalid Email",
          "param": "email",
          "location": "body"
        },
        {
          "msg": "Password Invalid",
          "param": "password",
          "location": "body"
        }
      ]
    }
    ```

- **Status Code**: `401 Unauthorized`

  - If the email or password is incorrect, the response contains:
    ```json
    {
      "message": "Invalid email or password"
    }
    ```

- **Status Code**: `500 Internal Server Error`
  - If there is a server-side issue or an unexpected error.

### Usage Example

#### Request

```http
POST /users/login HTTP/1.1
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63cfc748b5f7c911f8b4b5e9",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

---

## Endpoint: `/users/profile`

### Description

The `/users/profile` endpoint retrieves the profile details of the authenticated user.

### Method

`GET`

### Headers

| Field           | Required | Description                           |
| --------------- | -------- | ------------------------------------- |
| `Authorization` | Yes      | Bearer token for user authentication. |

### Response

#### Success Response

If the request is authenticated successfully, the server responds with:

- **Status Code**: `200 OK`
- **Response Body**:

  ```json
  {
    "_id": "<user_id>",
    "fullname": {
      "firstname": "<firstname>",
      "lastname": "<lastname>"
    },
    "email": "<email>"
  }
  ```

#### Error Responses

- **Status Code**: `401 Unauthorized`

  - If the token is invalid, expired, or blacklisted, the response contains:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

- **Status Code**: `500 Internal Server Error`
  - If there is a server-side issue or an unexpected error.

---

## Endpoint: `/users/logout`

### Description

The `/users/logout` endpoint logs out the authenticated user by blacklisting the token and clearing the session cookie.

### Method

`GET`

### Headers

| Field           | Required | Description                           |
| --------------- | -------- | ------------------------------------- |
| `Authorization` | Yes      | Bearer token for user authentication. |

### Response

#### Success Response

If the logout is successful, the server responds with:

- **Status Code**: `200 OK`
- **Response Body**:

  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Error Responses

- **Status Code**: `400 Bad Request`

  - If no token is provided, the response contains:
    ```json
    {
      "message": "No token provided for logout"
    }
    ```

- **Status Code**: `401 Unauthorized`

  - If the token is invalid, expired, or blacklisted, the response contains:
    ```json
    {
      "message": "Unauthorized"
    }
    ```

- **Status Code**: `500 Internal Server Error`
  - If there is a server-side issue or an unexpected error.


# Captain Endpoint Documentation

## Endpoint: `/captains/register`

### Description

Registers a new captain in the system. Validates input, hashes password, and generates a JWT token upon successful registration.

### Method

`POST`

### Request Body

| Field                     | Type   | Required | Description                                      |
| ------------------------- | ------ | -------- | ------------------------------------------------ |
| `fullname.firstname`       | String | Yes      | Captain's first name (min 3 chars).             |
| `fullname.lastname`        | String | Yes      | Captain's last name (min 3 chars).              |
| `email`                    | String | Yes      | Captain's email (valid format).                 |
| `password`                 | String | Yes      | Captain's password (min 6 chars).               |
| `vehicle.color`            | String | Yes      | Vehicle's color.                                |
| `vehicle.plate`            | String | Yes      | Vehicle's plate number.                         |
| `vehicle.capacity`         | Number | Yes      | Number of passengers the vehicle can carry.     |
| `vehicle.vehicleType`      | String | Yes      | Type of the vehicle (e.g., car, van).           |

### Response

#### Success (201)

```json
{
  "token": "<jwt_token>",
  "captain": { 
    "_id": "<captain_id>",
    "firstname": "<firstname>",
    "lastname": "<lastname>",
    "email": "<email>",
    "vehicle": { "color": "<color>", "plate": "<plate>", "capacity": <capacity>, "vehicleType": "<type>" }
  }
}

POST /captains/register HTTP/1.1
Content-Type: application/json

{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": { "color": "red", "plate": "AB123CD", "capacity": 4, "vehicleType": "car" }
}


{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "63cfc748b5f7c911f8b4b5e9",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "vehicle": { "color": "red", "plate": "AB123CD", "capacity": 4, "vehicleType": "car" }
  }
}





## API Endpoints

### 1. **Login Captain**
#### `POST /captain/login`
**Description:** Logs in a captain and provides an authentication token.

**Request Body:**
```json
{
  "email": "string", // Valid email address
  "password": "string" // Minimum 6 characters
}
```

**Response:**
- **Success (200):**
```json
{
  "token": "string", // JWT token for authentication
  "captain": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "vehicle": {
      "color": "string",
      "plate": "string",
      "capacity": "number",
      "vehicleType": "string"
    },
    "status": "string"
  }
}
```
- **Error (400 or 401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### 2. **Get Captain Profile**
#### `GET /captain/profile`
**Description:** Retrieves the authenticated captain's profile.

**Authentication:**
- Requires a valid JWT token in the `Authorization` header or `token` cookie.

**Response:**
- **Success (200):**
```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": "number",
    "vehicleType": "string"
  },
  "status": "string"
}
```
- **Error (401):**
```json
{
  "message": "Unauthorized"
}
```

---

### 3. **Logout Captain**
#### `GET /captain/logout`
**Description:** Logs out the captain by blacklisting the token and clearing cookies.

**Authentication:**
- Requires a valid JWT token in the `Authorization` header or `token` cookie.

**Response:**
- **Success (200):**
```json
{
  "message": "Captain logged out successfully"
}
````
