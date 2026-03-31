POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com:password1
`Hello S3!`
HTTP/1.1 201
[Asserts]
header "Location" exists
[Captures]
fragment_url: header "Location"

GET {{fragment_url}}
[BasicAuth]
test-user1@fragments-testing.com:password1
HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/plain"
body contains "Hello S3!"

DELETE {{fragment_url}}
[BasicAuth]
test-user1@fragments-testing.com:password1
HTTP/1.1 200

GET {{fragment_url}}
[BasicAuth]
test-user1@fragments-testing.com:password1
HTTP/1.1 404