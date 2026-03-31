# OpenDoor

## Overview
OpenDoor is an emergency accommodation platform that connects evacuee families with hosts offering temporary housing.

---

## Architecture

### Monorepo Structure
```
root/
  backend/
  frontend/
  docs/
```

### Backend (BE)
The backend is built with:
- Python
- FastAPI

### Frontend (FE)
The frontend is built with:

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

---

## Database (Docker)

Run PostgreSQL and PgAdmin in Docker for local development.

### 1. PostgreSQL 16

```bash
docker pull postgres:16
docker run -d --name opendoor-postgres -e POSTGRES_USER=opendooruser -e POSTGRES_PASSWORD=opendoorpass -e POSTGRES_DB=opendoordb -p 5432:5432 postgres:16
```

- **Host:** `localhost` (or `127.0.0.1`)
- **Port:** `5432`
- **Database:** `opendoordb`
- **User:** `opendooruser`
- **Password:** `opendoorpass`

### 2. PgAdmin 4

```bash
docker pull dpage/pgadmin4
docker run -d --name pgadmin -e PGADMIN_DEFAULT_EMAIL=admin@admin.com -e PGADMIN_DEFAULT_PASSWORD=admin -p 5050:80 dpage/pgadmin4
```

- **URL:** http://localhost:5050
- **Login:** `admin@admin.com` / `admin`
- In PgAdmin, add a server with host `host.docker.internal` (or your host IP) if connecting from the container to Postgres on the host; or use `opendoor-postgres` if both run in the same Docker network.

To stop/remove containers later: `docker stop opendoor-postgres pgadmin` and `docker rm opendoor-postgres pgadmin` (if needed).

---

## Getting Started


### Run Backend (BE)
1. Go to the backend folder
```
cd backend
```
2. create venv, run the venv
```
python -m venv venv
#In Mac:
source venv/bin/activate
#In Windows
.\venv\Scripts\Activate.ps1
```
3. install requirements.txt
```
pip install -r requirements.txt
```
4. Start the server
```
python main.py
```
4. Open the local URL shown in the terminal
  and add in the url
  ``` "/health"```

### Run Frontend (FE)
1. Go to the frontend folder
 Terminal- cd frontend

2- Install dependencies
  Terminal- npm i  OR npm install

3-Start the development server
  Terminal- npm run dev

4-Open the local URL shown in the terminal
  the URL shown in Terminal after running the server
---

## Project Structure

```
root/
  backend/
  frontend/
  docs/
  .env.example
  docker-compose.yml
  README.md
```

---
---
## Seeds Details
### need to run first Alembic command:
```bash
cd backend
pip install -r requirements.txt
python -m alembic upgrade head
```

#### Admin:
```bash
{email :'admin@opendoor.local',password :'12345678',
full name : 'Admin User',Phone Number : '0501111111', 
Role : 'ADMIN'::user_role_enum, is_deleted : false,
created_at : NOW(),updated_at : NOW()}
```
#### Host:
```bash
{email :'host@opendoor.local',password : '23456789',
full name : 'Host User', Phone Number '0502222222',
Role : 'HOST'::user_role_enum, is_deleted : false, 
created_at : NOW(),updated_at : NOW()}
```
#### Family
```bash
{email :'family@opendoor.local',password : '34567890',
full name : 'User Family', Phone Number '0503333333',
Role : 'EVACUEE'::user_role_enum, is_deleted : false, 
created_at : NOW(),updated_at : NOW()}
```


## Database Migrations (Alembic)

After setting up PostgreSQL (Docker), run the following commands to create the database schema.

### 1. Install dependencies (if not already installed)
```bash
cd backend
pip install -r requirements.txt
alembic upgrade head #This will create all tables in PostgreSQL

#If you update the models (for example, adding a new field):
 
alembic revision --autogenerate -m "describe your change" #Generate a new migration
alembic upgrade head

### Alembic Migration Fix (Revision Issue)

If you encounter the following error:
#Can't locate revision identified by 'XXXXXXXXXXXX'

This usually means that the database contains a revision that does not exist in the current codebase.

### Solution

 1.Check the current revision in the database:

```sql
SELECT * FROM alembic_version;
#Update it to match the latest existing migration:
UPDATE alembic_version
SET version_num = 'LATEST_EXISTING_REVISION';
#vs
alembic upgrade head

### Seeds deatials


## Core Concepts
<!-- To be filled by team -->

---

## Development Guidelines
<!-- To be filled by team -->

---

## Team Responsibilities

### Backend Team
<!-- To be filled by BE -->

### Frontend Team
<!-- To be filled by FE -->

---

## Documentation

docs/
<!-- To be filled -->

---

## Environment Variables
<!-- To be filled -->

---

## Future Improvements
<!-- To be filled -->

---

## Contributing
<!-- To be filled -->

---

## Notes
<!-- To be filled -->
