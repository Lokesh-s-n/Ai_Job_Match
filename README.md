# 💼 AI-Powered Job Match Platform

An end-to-end job discovery platform that leverages **Cohere embeddings** to match job seekers with suitable roles based on their profile, experience, skills, and preferences.

---

## 📸 Screenshots

<img src="https://github.com/user-attachments/assets/bed44242-2a7d-40e8-b190-adeda1ed2940" alt="Job Match UI" width="600"/>

---

## 🛠 Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | React.js + Tailwind CSS + Vite |
| Backend      | Node.js + Express.js        |
| Database     | MongoDB (Mongoose ORM)      |
| AI Engine    | Cohere AI (v2 SDK)          |
| Auth         | JWT with HTTP-only cookies  |
| Deployment   | _Not hosted currently_      |

---

## ⚙️ Project Setup

### 📦 Backend (Express + MongoDB)

```bash
cd server
npm install
````

Create a `.env` file in `server/` with the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai_job
JWT_SECRET=your_jwt_secret
COHERE_API_KEY=your_cohere_api_key
FRONTEND_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

### 💻 Frontend (React + Tailwind + Vite)

```bash
cd client
npm install
npm run dev
```

Tailwind is configured via `postcss.config.cjs` and `tailwind.config.js`.

---

## 🧠 AI Matching Logic

We use **Cohere’s `embed-english-v3.0` model** to semantically match users to job descriptions using cosine similarity.

### Prompt Design

A user profile is formatted like this:

```
Skills: React, Node.js, AWS. Experience: 3 years. Preferences: Remote only.
```

This string is embedded and compared with all job embeddings. The top 3 results are returned as recommendations.

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### 👤 User Routes

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| POST   | `/users/register`      | Register a new user         |
| POST   | `/users/login`         | Login and receive JWT       |
| POST   | `/users/logout`        | Logout & clear cookie       |
| GET    | `/users/validateToken` | Validate session via cookie |
| GET    | `/users/profile`       | Get user profile (auth)     |
| PUT    | `/users/profile`       | Update user profile (auth)  |

### 💼 Job Routes

| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| GET    | `/jobs`           | Fetch all jobs               |
| POST   | `/jobs`           | Create a job (admin use)     |
| DELETE | `/jobs/:id`       | Delete a job                 |
| POST   | `/jobs/recommend` | AI-based job recommendations |

**Sample Request Body for `/jobs/recommend`:**

```json
{
  "name": "Atharva",
  "experience": 2,
  "skills": ["React", "Node.js"],
  "preferences": "remote full stack"
}
```

---

## 🧱 Folder Structure

```
ai-job-match/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed/
│   └── server.js
```

---

## ⚖️ Assumptions & Trade-Offs

* Matching is synchronous for simplicity
* Cookie-based auth for frontend compatibility
* No resume uploads — relies on structured profile input
* Admin dashboard not included (manual job creation)
* No pagination — assumes small dataset
* May experience cold starts if deployed on free-tier hosts

---

## ✅ Submission Checklist

* ✅ Public GitHub repository: [AI\_Job\_Match](https://github.com/atharva-narkhede/AI_Job_Match)
* 🚫 Not deployed
* ✅ Covers:

  * Setup instructions
  * AI logic
  * API documentation
  * Architecture
  * Assumptions

