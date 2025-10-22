# TaskFlow Project

## Overview
TaskFlow is a **React-based task management application** that allows users to create, manage, and track projects and tasks. It supports authentication, dynamic routing, and real-time database interactions using **Firebase**, and uses **Redux** for state management. The UI is styled with **Tailwind CSS**.

---

## Features
- **User Authentication:** Signup, login, and secure session handling.
- **Project Management:** Create, view, edit, and delete projects.
- **Task Management:** Add tasks to projects, mark tasks as complete, and delete tasks.
- **Role-Based Access:** Users can view other users' data but cannot edit it.
- **Responsive Design:** Works on both desktop and mobile devices.
- **Real-Time Updates:** All changes are synced in real-time via Firebase.
- **State Management:** Global state handled by Redux with thunks for async API calls.

---

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **State Management:** Redux Toolkit, Redux Thunks
- **Backend & Database:** Firebase Authentication, Firestore
- **Routing:** React Router DOM
- **Others:** Axios (for API calls if needed), react-icons

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Abhishek37k/taskFlow_react_capstone
cd taskFlow_react_capstone
