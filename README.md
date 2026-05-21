# Appointment Booking System

A full-stack web application to manage appointments with create, update, delete, search, and filtering functionality.

## Tech Stack

### Frontend
- Angular 18 (Standalone Components)
- TypeScript
- Reactive Forms
- CSS

### Backend
- Node.js
- Express.js
- better-sqlite3

### Database
- SQLite

---

## Features

- Create appointments
- View appointment list
- Update appointment details
- Delete appointments
- Search appointments by customer name
- Filter appointments by status
- Future date validation
- Duplicate appointment prevention
- Responsive UI
- Status badges
- Toast notifications
- Delete confirmation popup
- SQLite data persistence

---

## Project Structure

```text
appointment-booking-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── appointment.controller.js
│   ├── routes/
│   │   └── appointment.routes.js
│   ├── services/
│   │   └── appointment.service.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── components/
│   │   │   ├── appointment-form/
│   │   │   ├── appointment-list/
│   │   │   ├── search-filter/
│   │   │   └── status-badge/
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   └── app.config.ts
│   │
│   ├── angular.json
│   └── package.json
│
└── README.md
```

---

## Database Schema

Table Name: `appointments`

| Column | Type |
|---------|---------|
| id | INTEGER |
| customer_name | TEXT |
| appointment_date | DATETIME |
| status | TEXT |
| created_at | DATETIME |

Rules followed:

- Customer name is required
- Appointment date should be in future
- Duplicate appointments are prevented using:

```sql
UNIQUE(customer_name, appointment_date)
```

Allowed status values:

- Pending
- Confirmed
- Completed
- Cancelled

---

## API Endpoints

Base URL:

```text
http://localhost:3000/api/appointments
```

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | / | Get all appointments |
| GET | /:id | Get appointment by ID |
| POST | / | Create appointment |
| PUT | /:id | Update appointment |
| DELETE | /:id | Delete appointment |

---

## Setup Instructions

### Backend Setup

Open terminal:

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:3000
```

SQLite database file is created automatically during first run.

---

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
ng serve
```

Frontend runs on:

```text
http://localhost:4200
```

Open browser:

```text
http://localhost:4200
```

---

## Application Flow

1. User creates appointment using customer name, date, and status.
2. Data is stored in SQLite database.
3. Appointments are displayed in card view.
4. User can search appointments.
5. User can filter using status.
6. User can edit appointment details.
7. User can delete appointments after confirmation.

---

## Validation

Implemented validations:

- Required customer name
- Empty spaces not allowed
- Future date validation
- Duplicate booking prevention
- Valid appointment status checking

---

## Future Improvements

- Add pagination
- Export appointment reports
- Add unit testing
- Add appointment reminders
- Improve dashboard analytics

---

## Output

The system supports:

✔ Create Appointment  
✔ View Appointment  
✔ Update Appointment  
✔ Delete Appointment  
✔ Search  
✔ Filter  
✔ Validation  
✔ Responsive Design  
✔ SQLite Persistence
