# 📦 Fragments Cloud Microservice

> A scalable, containerized RESTful cloud microservice for multi-format content ingestion, metadata indexing, and dynamic conversion.

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![AWS](https://img.shields.io/badge/AWS-Cognito%20%7C%20EC2%20%7C%20S3-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-Unit_Testing-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Overview](#overview) • [Architecture](#architecture) • [API Specification](#api-specification) • [Supported Conversions](#supported-conversions) • [Quick Start](#quick-start)

---

## 📌 Overview

**Fragments** is a cloud-native REST API designed for secure storage, retrieval, and transformation of arbitrary data snippets (text, markdown, HTML, JSON, images).

Built with enterprise cloud architectures in mind, the backend integrates identity verification via **Amazon Cognito**, stateless containerization via **Docker**, scalable media storage in **AWS S3**, and an automated testing suite driven by **Jest**.

---

## ⚙️ Architecture

```text
   [ Client Application / UI ]
                │
                │ HTTP Requests + Bearer JWT
                │
┌───────────────┼───── Fragments Express Microservice ──┐
│               ▼                                       │
│     ┌───────────────────┐     Token Verification      │   ┌───────────────────┐
│     │  Auth Middleware  │◄────────────────────────────├──►│ Cognito User Pool │
│     └─────────┬─────────┘                             │   └───────────────────┘
│               │                                       │
│               ▼                                       │
│     ┌───────────────────┐                             │
│     │ Route Controllers │                             │
│     └─────────┬─────────┘                             │
│               │                                       │
│               ▼                                       │
│     ┌───────────────────┐     ┌───────────────────┐   │
│     │ Format Converters │ ──► │   Metadata Store  │   │
│     └─────────┬─────────┘     └───────────────────┘   │
│               │                                       │
└───────────────┼───────────────────────────────────────┘
                ▼
      ┌───────────────────┐
      │   AWS S3 Storage  │
      │   (Raw Payloads)  │
      └───────────────────┘
```

---

## ✨ Core Features

- **Multi-Format Ingestion:** Ingests raw data payloads across text (`text/plain`, `text/markdown`, `text/html`), structured JSON (`application/json`), and binary media (`image/png`, `image/jpeg`, `image/webp`, `image/gif`).
- **Format Transformation Engine:** Dynamically converts saved fragments across compatible formats using query extensions (e.g., Markdown to HTML, PNG to JPEG, HTML to plain text).
- **Identity & Authentication:** Enforces RFC 6750 Bearer authentication using Amazon Cognito User Pools with local HTTP Basic fallback for offline testing.
- **Stateless Containerization:** Multi-stage Docker builds engineered for minimal image size, zero cached dependencies, and production deployment across AWS EC2 and container services.
- **Rigorous Test Coverage:** Comprehensive unit and integration test suite using Jest and Supertest, covering route authorization, malformed payloads, and edge cases.

---

## 📡 API Specification

All data endpoints require an `Authorization: Bearer <token>` header unless testing locally.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/v1/fragments` | Retrieves an array of fragment IDs belonging to the authenticated user. |
| `GET` | `/v1/fragments?expand=1` | Returns complete metadata objects for all user fragments. |
| `POST` | `/v1/fragments` | Creates a new fragment with content type specified in `Content-Type`. |
| `GET` | `/v1/fragments/:id` | Returns the raw fragment data matching its original `Content-Type`. |
| `GET` | `/v1/fragments/:id.ext` | Dynamically converts and returns the fragment in the requested extension. |
| `GET` | `/v1/fragments/:id/info` | Retrieves structured fragment metadata (size, timestamps, MIME type). |
| `PUT` | `/v1/fragments/:id` | Updates raw fragment payload (content type must match creation type). |
| `DELETE` | `/v1/fragments/:id` | Removes both metadata and raw storage references. |

---

## 🔄 Supported Conversions

| Source Type | Available Extensions |
| :--- | :--- |
| `text/markdown` | `.html`, `.txt` |
| `text/html` | `.txt` |
| `application/json` | `.txt` |
| `image/png`, `image/jpeg`, `image/webp`, `image/gif` | `.png`, `.jpg`, `.webp`, `.gif` |

---

## 🛠️ Tech Stack

- **Runtime & Framework:** Node.js, Express.js
- **Cloud & Auth:** AWS S3, Amazon Cognito, AWS EC2
- **DevOps:** Docker multi-stage builds
- **Testing & Quality:** Jest, Supertest, ESLint

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop (optional, for container runs)
- AWS account with Amazon Cognito User Pool credentials

### 1. Installation

```bash
git clone https://github.com/RasaReiszadeh/fragments.git
cd fragments
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=8080
LOG_LEVEL=debug
AWS_COGNITO_POOL_ID=your-pool-id
AWS_COGNITO_CLIENT_ID=your-client-id
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

### 3. Running Locally

```bash
# Start in development mode with nodemon
npm run dev

# Run unit and integration tests
npm test

# Build and execute via Docker
docker build -t fragments:latest .
docker run -p 8080:8080 --env-file .env fragments:latest
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
