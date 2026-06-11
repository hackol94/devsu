Practice GET/POST/PUT/DELETE against ReqRes classic endpoints - right from your browser.

Requires an API key (free) to keep the public API stable and abuse-resistant.

Auth bar
Key loaded
Verified just now
reqres_09d8a64a286647ffaf31e195d1061697

Saved keys

API Playground key · reqr...1697
Stored in session only.
hackol94@gmail.com
Request builder
Pick a preset or craft a request from scratch.

Classic API
Method
GET
Path
/api/users

Send request
https://reqres.in/api/users

Presets

GET /api/users
Read

List users
Single user
List resources
Generic resource
/api/
products
Create + Auth

Register (success)
Login (success)
Update

Update user
Delete

Delete user

Query params

Add key/value pairs to build query strings.

0 params

Headers

x-api-key auto-injected

x-api-key injected
•
0 custom
Response viewer
Inspect status, headers, and payload.

GET
200
Response received
•
Latency 834 ms
•
Size 1.5 KB
•
At 14:42
Copy cURL
Copy fetch
Copy JSON
Response body

Wrap
Expand
json
{
  "page": 1,
  "per_page": 6,
  "total": 12,
  "total_pages": 2,
  "data": [
    {
      "id": 1,
      "email": "george.bluth@reqres.in",
      "first_name": "George",
      "last_name": "Bluth",
      "avatar": "https://reqres.in/img/faces/1-image.jpg"
    },
    {
      "id": 2,
      "email": "janet.weaver@reqres.in",
      "first_name": "Janet",
      "last_name": "Weaver",
      "avatar": "https://reqres.in/img/faces/2-image.jpg"
    },
    {
      "id": 3,
      "email": "emma.wong@reqres.in",
      "first_name": "Emma",
      "last_name": "Wong",
      "avatar": "https://reqres.in/img/faces/3-image.jpg"
    },
    {
      "id": 4,
      "email": "eve.holt@reqres.in",
      "first_name": "Eve",
      "last_name": "Holt",
      "avatar": "https://reqres.in/img/faces/4-image.jpg"
    },
    {
      "id": 5,
      "email": "charles.morris@reqres.in",
      "first_name": "Charles",
      "last_name": "Morris",
      "avatar": "https://reqres.in/img/faces/5-image.jpg"
    },
    {
      "id": 6,
      "email": "tracey.ramos@reqres.in",
      "first_name": "Tracey",
      "last_name": "Ramos",
      "avatar": "https://reqres.in/img/faces/6-image.jpg"
    }
  ],
  "support": {
    "url": "https://benhowdle.im/first-cto-playbook?utm_source=reqres&utm_medium=json&utm_campaign=referral",
    "text": "Become a better CTO. A playbook of painful stories and practical advice from a two-time startup CTO."
  },
  "_meta": {
    "powered_by": "ReqRes",
    "docs_url": "https://app.reqres.in/documentation",
    "upgrade_url": "https://app.reqres.in/upgrade",
    "example_url": "https://app.reqres.in/examples/notes-app",
    "variant": "v1_b",
    "message": "This is a read-only demo endpoint. Sign up to create your own collections with full CRUD and auth.",
    "cta": {
      "label": "Get started",
      "url": "https://app.reqres.in/upgrade"
    },
    "context": "legacy_success"
  }
}

Response headers

2 header(s)

text
cache-control: public, max-age=14400, s-maxage=60
content-type: application/json; charset=utf-8

Request details

URL, headers, and body snapshot

URL
https://reqres.in/api/users
Headers
json
{
  "x-api-key": "reqres_09d8a64a286647ffaf31e195d1061697"
}
