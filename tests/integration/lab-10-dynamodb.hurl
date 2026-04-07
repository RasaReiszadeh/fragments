# 1. POST a new JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
test-user1@fragments-testing.com:password1
{ "service": "DynamoDB" }

HTTP 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 2. GET the fragment info (metadata) for fragment 1
GET {{fragment1_url}}/info
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.ownerId" isString
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.size" isInteger

# 3. POST a second Markdown fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
test-user1@fragments-testing.com:password1
`DynamoDB is **great**.`

HTTP 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 4. GET the fragment info (metadata) for fragment 2
GET {{fragment2_url}}/info
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.ownerId" isString
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

# 5. GET all fragments (IDs only) - confirm both IDs are present
GET http://localhost:8080/v1/fragments
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" contains {{fragment1_id}}
jsonpath "$.fragments" contains {{fragment2_id}}

# 6. DELETE the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP 200

# 7. Try to GET the first fragment - should be 404
GET {{fragment1_url}}
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP 404

# 8. GET all fragments again - fragment1 gone, fragment2 still there
GET http://localhost:8080/v1/fragments
[BasicAuth]
test-user1@fragments-testing.com:password1

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not contains {{fragment1_id}}
jsonpath "$.fragments" contains {{fragment2_id}}
