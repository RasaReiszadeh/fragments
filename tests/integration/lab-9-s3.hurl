# Create fragment (S3 write test)
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjpwYXNzd29yZA==
Content-Type: text/plain

Hello S3!

HTTP/1.1 201
[Asserts]
header "Location" exists

[Captures]
fragment_url: header "Location"

# Read fragment (S3 read test)
GET {{fragment_url}}
Authorization: Basic dXNlcjpwYXNzd29yZA==

HTTP/1.1 200
[Asserts]
header "Content-Type" == "text/plain"
body == "Hello S3!"

# Delete fragment (S3 delete test)
DELETE {{fragment_url}}
Authorization: Basic dXNlcjpwYXNzd29yZA==

HTTP/1.1 200

# Confirm deletion
GET {{fragment_url}}
Authorization: Basic dXNlcjpwYXNzd29yZA==

HTTP/1.1 404