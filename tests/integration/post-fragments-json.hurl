POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test-user1@fragments-testing.com:password1
{"name":"Rasa","course":"CCP555"}

HTTP/1.1 201

[Captures]
fragmentUrl: header "Location"

GET {{fragmentUrl}}
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8

[Asserts]
body == "{\"name\":\"Rasa\",\"course\":\"CCP555\"}"