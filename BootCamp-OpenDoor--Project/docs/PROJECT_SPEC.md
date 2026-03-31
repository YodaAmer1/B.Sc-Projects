# OpenDoor (Evacuee Housing Matcher)

## 🧭 Overview

OpenDoor is an emergency accommodation marketplace connecting displaced families with citizens offering spare rooms, empty apartments, or temporary hosting.

It enables:
- Hosts to list accommodations with tags and availability
- Evacuee families to search and request housing
- Admins to verify users and maintain trust

---

## 👥 Core User Roles

### Host
- Create and manage property listings
- Define availability
- Approve/reject booking requests

### Evacuee Family
- Search for housing
- Submit booking requests
- Manage request statuses

### Verification Admin
- Verify users via documents
- Approve/reject accounts
- Moderate listings

---

## 📖 User Stories

### Host
- Create listings with tags (safe room, pets, accessibility)
- Manage availability calendar
- Review booking requests
- Hide exact address until approval
- Block unavailable dates

### Evacuee Family
- Search by date, capacity, tags
- Submit booking requests
- View request statuses
- Cancel approved bookings

### Verification Admin
- Review registration queue
- Verify or reject users
- Suspend unsafe listings

---

## 🚫 Out of Scope
- Payments
- Legal contracts
- Automated verification
- Multi-city routing
- Map UI

---

## 🚀 Stretch Goals
- File uploads for verification
- OAuth2 (Google login)

---

## 🧱 Technical Challenges
- Complex filtering (dates, tags, capacity)
- RBAC for secure data access
- Calendar management

---

## 👨‍💻 Team Responsibilities

### Backend
- Search logic
- RBAC
- Booking APIs
- Verification flow

### Frontend
- Calendar UI
- Registration flow
- Search UI
- Dashboard

---

## 📁 Project Structure

root/
  backend/
  frontend/
  docs/
  docker/
  README.md
  PROJECT_SPEC.md

---

## 🎯 MVP
- Registration + verification
- Property listing
- Availability calendar
- Search
- Booking flow
- Approval system
