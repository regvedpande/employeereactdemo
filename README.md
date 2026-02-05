
# 🧑‍💼 Employee Management System – Frontend

This repository contains the **frontend application** for the Employee Management System (EMS).
It is built using **React + TypeScript** and provides a **modern dashboard UI** for managing employees, attendance, and reports.

The frontend communicates with a separate **ASP.NET Core Web API backend** via REST APIs.

---

## ✨ Key Features

* 🔐 Authentication (Login & Register)
* 📊 Dashboard-style UI with sidebar & navbar
* 👥 Employee CRUD (Add, Edit, Delete, List)
* 🔎 Search & filtering
* 📅 Attendance page
* 📄 Reports (CSV / PDF download)
* 🔐 Role-based UI guards (Admin/User ready)
* ⚡ Fast Vite-based build
* 🎨 Clean, responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

* **React 18**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Axios**
* **React Router**
* **Context API (Auth)**

---

## 📂 Folder Structure

```
employee-frontend/
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── DashboardLayout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── EmployeeForm.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TableList.tsx
│   │   ├── StatsCards.tsx
│   │   ├── ReportButtons.tsx
│   │   └── RoleGuard.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Employees.tsx
│   │   ├── Attendance.tsx
│   │   └── Reports.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── App.css
│
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🧠 Architecture Overview

* **Pages** represent routes/screens (Login, Employees, Reports, etc.)
* **Components** are reusable UI blocks (forms, tables, layout)
* **AuthContext** manages authentication state globally
* **api.ts** centralizes all backend API communication
* **DashboardLayout** ensures consistent UI across authenticated pages

---

## 🔐 Authentication Flow

1. User logs in via **Login page**
2. Backend returns a **JWT token**
3. Token is stored in `localStorage`
4. Axios interceptor automatically attaches token to API requests
5. Protected pages are accessible only when authenticated

---

## 👥 Employee Management Flow

* Employees page fetches employee data from backend
* Users can:

  * Add a new employee
  * Edit existing employee
  * Delete employee
* The same form is reused for **Add & Edit**
* Data refreshes automatically after actions

---

## 📄 Reports

* CSV and PDF reports can be downloaded from the Reports page
* Buttons trigger backend report endpoints
* Files are downloaded directly in the browser

---
---

## ▶️ Running the Project Locally

```bash
npm install
npm run dev
```

The app will start at:

```
http://localhost:5173
```


## 👨‍💻 Author

**Regved Pande**
Full Stack Developer (ASP.NET Core + React)

This project was built as a **real-world, production-style frontend** suitable for:

* Assignments
* Interviews
* Portfolio projects

---

## ⭐ Support

If you found this project useful, feel free to ⭐ the repository.

---

