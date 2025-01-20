# User Endpoint Documentation

## Endpoint: `/users/register`

### Description
The `/users/register` endpoint is used to register a new user in the system. The endpoint accepts user details, validates the data, and creates a new user if all requirements are met.

### Method
`POST`

### Request Body
The endpoint requires the following data in the request body:

| Field                | Type   | Required | Description                              |
|----------------------|--------|----------|------------------------------------------|
| `fullname.firstname` | String | Yes      | First name of the user (minimum 3 characters). |
| `fullname.lastname`  | String | No       | Last name of the user (minimum 3 characters). |
| `email`              | String | Yes      | User's email address (must be a valid email). |
| `password`           | String | Yes      | Password for the user (minimum 6 characters). |

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

| Field       | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| `email`     | String | Yes      | User's email address (must be a valid email). |
| `password`  | String | Yes      | User's password (minimum 6 characters). |

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

