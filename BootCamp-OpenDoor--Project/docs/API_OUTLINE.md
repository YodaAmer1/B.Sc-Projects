# OpenDoor — API Outline

*Aligned with [PROJECT_SPEC.md](PROJECT_SPEC.md) roles, user stories, and MVP.*

Base URL (dev): `http://127.0.0.1:8000`  
Suggested API prefix: `/api/v1` (optional).

---

## Auth (MVP: Registration + verification)

| Method | Path             | Auth | Description                         |
|--------|------------------|------|-------------------------------------|
| POST   | `/auth/register` | No   | Register as Host or Evacuee Family  |
| POST   | `/auth/login`    | No   | Login → JWT `access_token`          |
| GET    | `/auth/me`       | Yes  | Current user profile (from JWT)     |

**Login response:** `{ "access_token": "...", "token_type": "bearer" }`  
**Protected requests:** `Authorization: Bearer <access_token>`

---

## Properties — Host (MVP: Property listing, Availability calendar)

| Method | Path                | Auth | Description                              |
|--------|---------------------|------|------------------------------------------|
| POST   | `/properties`       | Host | Create property + tags + availability   |
| GET    | `/properties`       | Host | List my properties                       |
| GET    | `/properties/:id`   | Host | Get one (my property)                     |
| PATCH  | `/properties/:id`  | Host | Update property / slots; block dates     |
| DELETE | `/properties/:id`  | Host | Delete (or soft-delete)                  |

**Tags (per spec):** e.g. safe room, pets, accessibility.  
**Address:** Stored but not returned to non-owners until a booking is approved (per spec: hide exact address until approval).

---


## Booking Requests (MVP: Booking flow, Approval system)

| Method | Path                         | Auth           | Description                    |
|--------|------------------------------|----------------|--------------------------------|
| POST   | `/requests`                  | Evacuee Family | Create booking request         |
| GET    | `/requests`                 | Evacuee Family | My requests                    |
| GET    | `/requests/:id`             | Evacuee Family | Request detail                 |
| PATCH  | `/requests/:id/cancel`      | Evacuee Family | Cancel (e.g. approved booking) |
| GET    | `/properties/:id/requests`  | Host           | Requests for my property       |
| PATCH  | `/requests/:id/status`      | Host           | Approve or reject request      |

**Statuses (per spec):** e.g. Pending, Approved, Rejected. On **Approved**, Evacuee Family can see exact address.

---

## Admin — Verification & Moderation (MVP: Verification; spec: moderate listings)

| Method | Path                          | Auth  | Description                    |
|--------|-------------------------------|-------|--------------------------------|
| GET    | `/admin/users/pending`        | Admin | Registration queue (per spec)  |
| PATCH  | `/admin/users/:id/verify`     | Admin | Approve user                    |
| PATCH  | `/admin/users/:id/reject`     | Admin | Reject user                     |
| GET    | `/admin/listings`             | Admin | List all / flagged listings    |
| PATCH  | `/admin/listings/:id/suspend` | Admin | Suspend unsafe listing (spec)  |

**Roles (per PROJECT_SPEC):** Host, Evacuee Family, Verification Admin.

---

## Role Summary (RBAC)

| Role              | Access (per spec)                                                                 |
|-------------------|-----------------------------------------------------------------------------------|
| **Host**          | Auth; create/manage listings (tags, availability); approve/reject booking requests; hide address until approval. |
| **Evacuee Family** | Auth; search (date, capacity, tags); submit booking requests; view request statuses; cancel approved bookings.   |
| **Verification Admin** | Auth; review registration queue; verify or reject users; suspend unsafe listings.                    |

