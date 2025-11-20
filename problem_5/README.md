# Problem 5 — API Documentation

Base URL (local): `http://localhost:8080/api/v1`  
Swagger UI: `http://localhost:8080/api-docs`

Tổng quan
- REST API với các module: Users, Categories, Products, Upload.
- Các _id là string (auto-increment).
- Trường is_active: false = visible/active (theo logic hiện tại), true = activated/removed.

--------------------------------------------------------------------------------
Quick start
- Cài đặt: npm install
- Dev: npm run dev
- Build + run: npm start
- Swagger UI: truy cập `/api-docs` sau khi server chạy.

--------------------------------------------------------------------------------
1) USERS
- GET /api/v1/users/{id}
  - Path: id (string)
  - Response 200: user object

- POST /api/v1/users
  - Body (application/json):
    - username (string, required)
    - password (string, required)
    - email (string, optional)
    - avatar (string, optional)
    - role (string: "admin" | "user", optional)
  - Response 201: created user object

User response attributes (example table)
| Field      | Type   | Description |
|------------|--------|-------------|
| _id        | string | User id |
| username   | string | Username |
| email      | string | Email or null |
| avatar     | string | Avatar URL or null |
| role       | string | "admin" or "user" |
| created_at | string | ISO timestamp |
| is_active  | boolean| Active flag |

Example POST body:
```json
{
  "username": "alice",
  "password": "secret",
  "email": "alice@example.com",
  "role": "user"
}
```

--------------------------------------------------------------------------------
2) CATEGORIES
- GET /api/v1/categories
  - Query params:
    - page (integer, default 1)
    - limit (integer, default 10)
    - search (string) — partial case-insensitive match on name
    - sortBy (string) — field name (e.g. created_at, name)
    - sortOrder (asc|desc, default desc)
  - Response 200:
```json
{
  "data": [ /* categories */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

- GET /api/v1/categories/{id}
  - Response 200: single category with populated products & create_by

- POST /api/v1/categories
  - Body:
    - name (string, required)
    - description (string, optional)
    - create_by (string user id, required)
  - Response 201: created category

- PUT /api/v1/categories/{id}
  - Body: { name, description }

- DELETE /api/v1/categories/{id}
  - Activates category (is_active = true) and sets related products is_active = true

Category response attributes
| Field      | Type    | Description |
|------------|---------|-------------|
| _id        | string  | Category id |
| name       | string  | Category name |
| description| string? | Description |
| products   | array   | Product summaries [{ _id, name, description, price }] |
| create_by  | object? | Creator summary { _id, username, email } |
| created_at | string  | ISO timestamp |
| is_active  | boolean | Active flag |

Example:
`GET /api/v1/categories?page=2&limit=5&search=phone&sortBy=name&sortOrder=asc`

--------------------------------------------------------------------------------
3) PRODUCTS
- GET /api/v1/products
  - Query params: page, limit, search (on product name), sortBy, sortOrder
  - Response 200:
```json
{
  "data": [ /* products */ ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

- GET /api/v1/products/{id}
  - Response 200: product populated (category & create_by)

- POST /api/v1/products
  - Body (application/json):
    - name (string, required)
    - description (string, optional)
    - image (string URL, optional)
    - price (number, optional)
    - category (string category id, required)
    - create_by (string user id, required)
  - Response 201: created product
  - Side-effect: category.products will be updated to include product id

- PUT /api/v1/products/{id}
  - Body: { name, description, price, image }

- DELETE /api/v1/products/{id}
  - Operation sets product.is_active = true and removes it from category.products

Product response attributes
| Field      | Type    | Description |
|------------|---------|-------------|
| _id        | string  | Product id |
| name       | string  | Product name |
| description| string? | Description |
| image      | string? | Image URL |
| price      | number? | Price |
| category   | object? | { _id, name, description } |
| create_by  | object? | { _id, username, email } |
| created_at | string  | ISO timestamp |
| is_active  | boolean | Active flag |

Example create body:
```json
{
  "name": "iPhone 15",
  "description": "New model",
  "price": 999,
  "category": "1",
  "create_by": "1"
}
```

--------------------------------------------------------------------------------
4) UPLOAD
- POST /api/v1/upload
  - Content-Type: multipart/form-data
  - Field name must match multer middleware: `file` (default)
  - Response 200:
```json
{
  "image_url": "https://res.cloudinary.com/...",
  "public_id": "products/abc123",
  "raw": { /* cloudinary response */ }
}
```
Notes:
- Use multer memoryStorage + upload.single('file') recommended.
- If "No file uploaded" occurs: ensure form field key is `file` and middleware matches.

--------------------------------------------------------------------------------
Errors & status codes
- 200 OK — successful GET/operation return
- 201 Created — resource created
- 400 Bad Request — invalid input / duplicate
- 404 Not Found — resource not found
- 500 Server Error — unexpected error (check server logs)

--------------------------------------------------------------------------------
Swagger & deployment
- Swagger UI available at `/api-docs`.
- To avoid duplicated prefix issues, set API_URL env var without trailing `/api`.
- You can export OpenAPI JSON from the running app (add a route returning swaggerSpec) and import to SwaggerHub if needed.

--------------------------------------------------------------------------------
Client hints
- Pagination: use page and limit; response includes pagination metadata.
- Filtering: use search for partial name matches.
- Sorting: specify sortBy and sortOrder.
- Upload: send form-data key `file`.

--------------------------------------------------------------------------------
Changelog / Notes for devs
- _id are strings; ensure relations use string ids.
- Counter models used for auto-increment — if defining Counter model in multiple files, code guards against OverwriteModelError by checking mongoose.models.
- If you want full example responses for each endpoint, tell me which endpoint(s) and I will append JSON samples.

--------------------------------------------------------------------------------
DOCKER — Build & Run (local)

1) Build image locally:
   - docker build -t <dockerhub-username>/problem5:latest .

2) Run container:
   - docker run -e MONGO_URI="mongodb://host:27017/problem5" \
       -e CLOUDINARY_CLOUD_NAME=xxx \
       -e CLOUDINARY_API_KEY=xxx \
       -e CLOUDINARY_API_SECRET=xxx \
       -p 8080:8080 \
       --name problem5-app \
       <dockerhub-username>/problem5:latest

3) Use docker-compose (recommended for local dev with Mongo):
   - Edit docker-compose.yml env values or create .env with MONGO_URI and cloudinary values.
   - docker-compose up -d
   - docker-compose logs -f app

Notes:
- Ensure MONGO_URI points to a reachable MongoDB instance (container or cloud).
- For development you can mount source code (modify docker-compose to include volumes), but production images should contain compiled dist.

--------------------------------------------------------------------------------
CLOUD BUILD (example: GitHub Actions -> Docker Hub)

1) Create Docker Hub repository (e.g. username/problem5).
2) Add repository secrets in GitHub:
   - DOCKERHUB_USERNAME
   - DOCKERHUB_TOKEN (or Docker Hub access token)
   - IMAGE_NAME (e.g. username/problem5)

3) Workflow file is at: .github/workflows/docker-publish.yml
   - On push to main it will build the image and push tags: latest and commit SHA.

4) After push, deploy the image to cloud provider (e.g. AWS ECS / DigitalOcean / Heroku container registry) using your provider deployment steps.

Quick deploy example (pull & run on remote host):
- docker pull username/problem5:latest
- docker run -e MONGO_URI="mongodb://mongo:27017/problem5" -p 8080:8080 username/problem5:latest

--------------------------------------------------------------------------------
Security & env
- Do NOT commit .env with secrets.
- Use GitHub Secrets or cloud provider secret manager for production credentials.

