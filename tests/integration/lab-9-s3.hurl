POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjpwYXNzd29yZA==
Content-Type: text/plain
[Body]
Hello S3!

HTTP/1.1 201
[Asserts]
header "Location" exists

[Captures]
fragment_url: header "Location"

GET {{fragment_url}}
Authorization: Basic dXNlcjpwYXNzd29yZA==

HTTP/1.1 200
[Asserts]
header "Content-Type" == "text/plain"
body == "Hello S3!"

DELETE {{fragment_url}}
Authorization: Basic dXNlcjpwYXNzd29yZA==

HTTP/1.1 200

GET {{fragment_url}}
Authorization: Basic dXNlcjpwYXNzd29yZA==

HTTP/1.1 404