POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com:password1
`This is a fragment!`

HTTP/1.1 201

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 19

[Captures]
fragmentUrl: header "Location"

GET {{fragmentUrl}}
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8

[Asserts]
body == "This is a fragment!"