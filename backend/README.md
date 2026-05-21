# Backend - Appointment Booking API

Backend application built using Node.js, Express, and SQLite.

## Technologies Used

- Node.js
- Express.js
- better-sqlite3
- SQLite
- CORS

---

## Setup

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm start
```

Server runs at:

```text
http://localhost:3000
```

SQLite database file (`appointments.db`) is created automatically during first run.

---

## API Endpoints

Base URL:

```text
/api/appointments
```

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | / | Get all appointments |
| GET | /:id | Get appointment by ID |
| POST | / | Create appointment |
| PUT | /:id | Update appointment |
| DELETE | /:id | Delete appointment |

---

## Status Codes

- 200 – Success
- 201 – Created
- 400 – Validation Error
- 404 – Appointment Not Found
- 409 – Duplicate Appointment
- 500 – Server Error

---

## Database Structure

Table: `appointments`

```text
id                INTEGER PRIMARY KEY AUTOINCREMENT
customer_name     TEXT NOT NULL
appointment_date  DATETIME NOT NULL
status            TEXT NOT NULL
created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
```

Allowed status values:

- Pending
- Confirmed
- Completed
- Cancelled

Duplicate prevention:

```sql
UNIQUE(customer_name, appointment_date)
```

---

## Validation Implemented

- Customer name required
- Empty spaces not allowed
- Future appointment date only
- Duplicate booking prevention
- Status validation

---

## Folder Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── appointment.controller.js
│
├── routes/
│   └── appointment.routes.js
│
├── services/
│   └── appointment.service.js
│
├── app.js
├── server.js
└── package.json
```

---

## Notes

- SQLite database is generated automatically
- Data remains stored after restart
- API connected with Angular frontend
- Search and filter supported
- Results are sorted by latest appointments