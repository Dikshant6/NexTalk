# 💬 NexTalk 

<p align="center">
  <strong>A modern, secure, and real-time messaging platform built from the ground up.</strong>
</p>

<p align="center">
  <em>Connect. Communicate. Create.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-8B5CF6?style=for-the-badge&logo=github&logoColor=white" alt="Project Status: In Development" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/API-Express-FFFFFF?style=for-the-badge&logo=express&logoColor=black" alt="Express" />
</p>

---

## 📌 Overview

**NexTalk** is a full-stack messaging application being developed with a focus on secure authentication, real-time communication, thoughtful user experience, and scalable backend architecture.

The goal is to build more than a basic chat interface. NexTalk is a hands-on engineering project exploring how modern messaging applications are designed, implemented, secured, tested, and eventually deployed.

The application is being developed incrementally, starting with the backend foundation and authentication system before moving into conversations, real-time messaging, and advanced infrastructure.

### 🎯 Project Vision

- 🔐 **Secure authentication** — Protect user accounts and sessions.
- 💬 **Real-time communication** — Build responsive, live messaging experiences.
- 👤 **User discovery** — Allow users to find and connect with other users through unique usernames.
- ⚡ **Responsive experience** — Create an intuitive interface across desktop and mobile devices.
- 🧱 **Maintainable architecture** — Keep the frontend, backend, validation, middleware, and business logic organized.
- 🚀 **Scalable foundations** — Explore technologies that support reliable communication as the application grows.

> **Current status:** NexTalk is actively under development. Features listed in the roadmap are planned work, not claims of completed functionality.

---

## ✨ Features & Development Status

### Authentication and Security

| Feature | Status |
|---|---|
| User registration and login | Implemented |
| Password hashing with Argon2id | Implemented |
| JWT-based authentication | Implemented |
| HTTP-only authentication cookie | Implemented |
| Protected user profile endpoint | Implemented |
| Logout and session handling | Implemented; further hardening planned |
| Google OAuth | Planned |
| Sign in with Apple | Planned |
| Email verification with OTP | Planned |
| OTP expiration and resend limits | Planned |
| Authentication rate limiting | Planned |
| Centralized error handling and validation hardening | In progress |

### Messaging and User Experience

| Feature | Status |
|---|---|
| Landing page | Implemented |
| Login and registration interfaces | Implemented |
| Authentication UI connected to backend | Implemented |
| Google and Apple logo buttons | UI work planned |
| Main chat dashboard | Planned |
| Conversation list and search | Planned |
| Username-based user discovery | Planned |
| One-to-one messaging | Planned |
| Real-time message delivery | Planned |
| Online/offline presence | Planned |
| Typing indicators | Planned |
| Read receipts | Planned |
| Message history and pagination | Planned |
| Mobile-responsive chat experience | Planned |

*Statuses reflect the development stage documented in this README and should be updated as the project evolves.*

---

## 🛠️ Tech Stack

NexTalk uses a modern JavaScript-based full-stack architecture.

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and build tooling |
| JavaScript | Application logic |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Reusable interface components |
| React Router | Client-side navigation |
| Lucide React | Interface icons |
| Geist | Typography |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server and API routing |
| MongoDB | Document-oriented data storage |
| Zod | Request and environment validation |
| Argon2id | Secure password hashing |
| JSON Web Tokens (JWT) | Authentication tokens |
| HTTP-only cookies | Browser session credential storage |

### Planned Infrastructure and Tools

| Technology | Intended purpose |
|---|---|
| Socket.IO | Real-time messaging and connection events |
| Redis | Presence, ephemeral state, and scaling support where needed |
| Zustand | Frontend application and chat state management |
| Google OAuth | Google account authentication |
| Sign in with Apple | Apple account authentication |
| Email delivery provider | Verification codes and account emails |
| Automated tests | Authentication, API, and messaging reliability |
| Deployment platform | Hosting the frontend and backend |

The roadmap may evolve as implementation and testing reveal better architectural choices.

---

## 🏗️ Architecture

NexTalk is organized into separate frontend and backend applications.

```text
NexTalk/
│
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── components.json
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express backend
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── models/
│   │   └── services/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

*This is a conceptual structure based on the current project organization and intended backend modules. Some directories may be added as development progresses.*

### Request Lifecycle

The intended request lifecycle follows a clear separation of responsibilities:

1. **Client:** Collects user input and sends an HTTP request.
2. **Routes:** Direct the request to the appropriate endpoint.
3. **Validation middleware:** Validates incoming data before business logic executes.
4. **Authentication middleware:** Checks credentials when an endpoint requires an authenticated user.
5. **Controllers and services:** Execute application logic and coordinate operations.
6. **Database:** Stores and retrieves persistent application data.
7. **Response:** Returns a consistent success or error response to the client.

This structure helps keep request handling, validation, security, and business logic maintainable as the project grows.

---

## 🔐 Authentication Design

Authentication is one of the first major components being implemented in NexTalk.

### Current Authentication Flow

**Registration**

1. The client submits registration details.
2. The backend validates the request.
3. The password is hashed using Argon2id.
4. The account is created and the API returns its response.

**Login**

1. The client submits login credentials.
2. The backend validates the request and checks the account.
3. The supplied password is verified against the stored hash.
4. A JWT-based authentication credential is issued in an HTTP-only cookie.
5. Protected endpoints use authentication middleware to validate the session.

**Logout**

The client requests logout, and the backend clears the authentication cookie.

### Planned Authentication Improvements

- Google OAuth and Sign in with Apple.
- Email ownership verification during registration.
- Secure, time-limited, single-use email OTPs.
- OTP attempt limits and resend cooldowns.
- Login and registration rate limiting.
- Consistent validation and error-handling middleware.
- Secure account linking for users with multiple sign-in methods.
- Improved session expiration and authentication lifecycle tests.

### Security Principles

- Never store plaintext passwords.
- Never expose secret keys or credentials in the frontend.
- Validate incoming data on the server.
- Use HTTPS in production.
- Apply appropriate cookie security settings.
- Limit repeated authentication and verification attempts.
- Verify third-party identity tokens on the backend.
- Avoid automatically linking accounts based only on an unverified email address.
- Keep secrets in environment variables and out of version control.

---

## 💬 Planned Real-Time Messaging

Real-time communication is a core part of NexTalk's long-term vision.

Socket.IO is planned for bidirectional communication between connected clients and the server.

The intended messaging lifecycle is:

1. A user authenticates and establishes a connection.
2. The server verifies the user's identity and conversation access.
3. The sender submits a message.
4. The server validates the message and persists it.
5. Authorized conversation participants receive the message in real time.
6. Message history can be retrieved when a user reconnects.

Additional features may include online presence, typing indicators, delivery/read receipts, message pagination, and reconnection handling.

Redis may be introduced for shared presence state, ephemeral data, or multi-instance Socket.IO coordination if the architecture requires it. It is not a replacement for persistent message storage.

---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Install the following:

- Node.js — a supported LTS version.
- npm.
- MongoDB — a local instance or a configured MongoDB deployment.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Dikshant6/NexTalk
cd NexTalk
```

Replace the placeholder with the actual repository URL.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file using the existing `.env.example` as a reference.

Example configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_secure_random_secret
```

These variable names are illustrative. **Use the exact names and requirements defined by the current backend configuration and validation schema.** If the application uses separate access-token secrets, email credentials, or OAuth variables, configure those as required by the implementation.

Never commit your real `.env` file.

Start the backend using the script defined in `server/package.json`. For example, if the project defines a development script:

```bash
npm run dev
```

### 3. Configure the Frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

The URL must match the actual backend port and API mount prefix.

Start the frontend:

```bash
npm run dev
```

Vite will print the local development URL in the terminal, typically `http://localhost:5173`.

### 4. Verify the Setup

- Open the frontend in your browser.
- Confirm the backend starts successfully.
- Check the configured health endpoint, if enabled.
- Test registration, login, protected session retrieval, and logout.
- Check browser and server logs if a request fails.

The exact scripts and environment variables should always match the current `package.json` files and backend configuration.

---

## 🧪 Testing and Quality

Testing will be expanded alongside the implementation.

### Authentication Test Cases

- Valid and invalid registration requests.
- Duplicate account registration.
- Valid and invalid login credentials.
- Missing or malformed request fields.
- Access to protected routes without a valid session.
- Logout and cookie clearing.
- Expired or invalid authentication tokens.
- Rate limiting under repeated requests.
- Incorrect, expired, and reused verification codes.
- OAuth callback validation and account-linking scenarios.

### Messaging Test Cases

- Sending and receiving messages.
- Preventing unauthorized conversation access.
- Message persistence and history retrieval.
- Reconnection after temporary network failure.
- Multiple connected users.
- Presence and typing events.
- Input validation and abuse prevention.

Automated tests, integration tests, and end-to-end coverage will be added as the corresponding features become available.

---

## 🗺️ Development Roadmap

NexTalk is being developed in milestones to keep the implementation understandable and testable.

- [x] **Phase 1 — Project foundation**
  - Frontend and backend setup.
  - Express application foundation.
  - Environment configuration and initial API structure.

- [x] **Phase 2 — Core authentication foundation**
  - Registration and login.
  - Password hashing.
  - JWT-based authentication cookie.
  - Protected user endpoint.
  - Initial frontend authentication integration.

- [ ] **Phase 3 — Authentication hardening**
  - Complete middleware and validator coverage.
  - Centralized error handling.
  - Authentication rate limiting.
  - Email verification and OTP lifecycle.
  - Session and security regression tests.

- [ ] **Phase 4 — OAuth integration**
  - Google authentication.
  - Apple authentication.
  - Provider configuration and callback handling.
  - Secure account linking.

- [ ] **Phase 5 — Chat frontend**
  - Responsive chat layout.
  - Sidebar and conversation list.
  - User discovery and conversation screens.
  - Message panel and composer.
  - Loading, empty, and error states.

- [ ] **Phase 6 — Messaging backend**
  - User and conversation data models.
  - Conversation APIs.
  - Message persistence.
  - Authorization checks and message history.

- [ ] **Phase 7 — Real-time communication**
  - Socket.IO integration.
  - Live message delivery.
  - Reconnection handling.
  - Presence and typing indicators.

- [ ] **Phase 8 — State management and reliability**
  - Zustand integration where appropriate.
  - Redis-backed coordination where needed.
  - Automated testing and structured logging.
  - Performance and security improvements.

- [ ] **Phase 9 — Deployment**
  - Production environment configuration.
  - Secure frontend/backend deployment.
  - Database and connection security.
  - Production smoke tests and documentation updates.

*Roadmap checkboxes represent milestone completion and should be updated only after implementation and relevant verification.*

---

## 🤝 Development Philosophy

NexTalk is being built incrementally, with an emphasis on understanding the underlying engineering decisions rather than simply assembling libraries.

The project follows a few principles:

- Build small, independently testable features.
- Keep authentication and authorization server-side.
- Separate UI, API handling, validation, and business logic.
- Prefer explicit error handling over silent failures.
- Use Git commits to preserve stable checkpoints.
- Test failure scenarios alongside successful flows.
- Introduce infrastructure when it solves a concrete problem.
- Document architectural decisions as the application evolves.

---

## 🔮 Future Possibilities

After the core messaging experience is stable, potential enhancements include:

- Group conversations.
- Image and file sharing.
- Message editing and deletion.
- Search across messages.
- Notification preferences.
- Blocking and reporting users.
- Improved accessibility.
- Additional account-security features.
- More extensive integration and load testing.

These are possible future directions, not current feature guarantees.

---

## 📄 License

A license has not yet been specified.

Before distributing or accepting external contributions, add a `LICENSE` file that reflects the intended licensing terms.

---

<p align="center">
  <strong>Built with curiosity, persistence, and a lot of debugging. 💜</strong>
</p>

<p align="center">
  <em>NexTalk — one milestone at a time.</em>
</p>