# TaskFlow - MERN Task Management Application

## Overview

TaskFlow is a full-stack Task Management Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The application allows users to register, log in securely using JWT authentication, and manage their personal tasks through a clean and responsive dashboard.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Secure Password Hashing using bcryptjs

### Task Management

* Create Tasks
* View Tasks
* Edit Tasks
* Delete Tasks
* Mark Tasks as Completed or Pending
* Real-Time Task Statistics

### Dashboard

* Total Tasks Counter
* Completed Tasks Counter
* Pending Tasks Counter
* Search Tasks by Title or Description
* Responsive Design

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

### Database

* MongoDB
* Mongoose

---

## Project Structure

```text
taskflow/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <your-repository-url>
```

### Backend Setup

```bash
cd server

npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start Backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

---

### Tasks

#### Get Tasks

```http
GET /api/tasks
```

#### Create Task

```http
POST /api/tasks
```

#### Update Task

```http
PUT /api/tasks/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

---

## Screenshots

Add screenshots of:

* Login Page
* Register Page
* Dashboard
* Add Task Modal
* Task List
* Search Functionality

---

## Future Improvements

* Task Filtering
* Pagination
* Email Notifications
* Team Collaboration
* Dark/Light Theme Toggle

---

## Author

Uday Malviya

MERN Stack Internship Assignment
