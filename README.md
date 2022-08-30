


```http
GET http://localhost:4000/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqaW0iLCJpYXQiOjE2NjE3MDQ0MTMsImV4cCI6MTY2MTcwNDQ3M30._hprnOK1RquDzrIxacy1j_0o2L9otONo-KGe8O843iM

###

POST http://localhost:4000/login
Content-Type: application/json

{
  "username": "jim"
}

###

POST http://localhost:4000/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqaW0iLCJpYXQiOjE2NjE3MDQyOTgsImV4cCI6MTY2MTcwNzg5OH0.4MzSAlYjh7hqkPorbYuh1BjjcA_U0w4Uc741jvGLc2E"
}

###

DELETE http://localhost:4000/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqaW0iLCJpYXQiOjE2NjE3MDQzMDgsImV4cCI6MTY2MTcwNDYwOH0.-9ABijMfFP0JiMV8MGfhiLwXjhrsPjZ5SVrc8zXomwg

```
