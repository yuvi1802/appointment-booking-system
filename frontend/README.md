# Frontend - Appointment Booking UI

Frontend application built using Angular standalone components and Reactive Forms.

## Technologies Used

- Angular 18
- TypeScript
- Reactive Forms
- CSS

---

## Setup

Install dependencies:

```bash
npm install
```

Run the application:

```bash
ng serve
```

Application runs at:

```text
http://localhost:4200
```

Requirements:

- Node.js v18+
- Angular CLI

Install Angular CLI if needed:

```bash
npm install -g @angular/cli
```

---

## Folder Structure

```text
src/app/
│
├── models/
│   └── appointment.model.ts
│
├── services/
│   └── appointment.service.ts
│
├── components/
│   ├── appointment-form/
│   ├── appointment-list/
│   ├── search-filter/
│   └── status-badge/
│
├── app.ts
├── app.html
├── app.css
└── app.config.ts
```

---

## Features

- Appointment creation form
- Edit appointment details
- Delete appointment option
- Search by customer name
- Status filter
- Form validation
- Future date validation
- Duplicate prevention handling
- Responsive card layout
- Toast messages
- Delete confirmation popup
- Status badges

---

## Build Project

Create production build:

```bash
ng build
```

Output folder:

```text
dist/appointment-booking
```

---

## Notes

- Uses Angular standalone components
- Reactive Forms used for validation
- API communication handled using HttpClient
- Connected with Express backend and SQLite database