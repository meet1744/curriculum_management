# Curriculum Management System

A web application for managing a university department's curriculum. Heads of Department, Program Coordinators and Faculty each log in with their own role to maintain subjects, teaching schemes and syllabus PDFs, and anyone can download the complete, merged syllabus booklet for a given batch.

Built with a **Spring Boot** REST API, a **MySQL** database and a **React** frontend.

---

## Features

**Role-based access (JWT)**
- Three roles: **HOD**, **Program Coordinator (PC)** and **Faculty**. Users pick a role, then log in with their ID and password.
- Passwords are stored as BCrypt hashes; sessions use a JWT that expires after one hour.

**Head of Department**
- View all subjects in the department
- Add and remove faculty members
- Appoint a faculty member as the department's Program Coordinator

**Program Coordinator**
- Add, update and delete subjects
- Assign subjects to faculty members
- Set each subject's semester and position in the semester's sequence

**Faculty**
- View the subjects assigned to them
- Update subject details (teaching scheme, marks, credits)
- Upload the syllabus PDF for each of their subjects

**Syllabus booklet generation (public)**
- Pick an admission year and department to download a single PDF containing:
  1. a generated scheme table for each of the 8 semesters (code, name, lecture/tutorial/practical hours, theory/sessional/practical/termwork marks), followed by
  2. every subject's uploaded syllabus PDF, merged in order.
- Subjects carry an *effective date* and a *removed date*, so each batch gets the curriculum that was in force during its four years.

---

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 19, Spring Boot 2.6.3 (Web, Data JPA, Security, Validation), JJWT 0.11.5, ModelMapper, Lombok |
| PDF      | OpenPDF (table generation), Apache PDFBox (merging) |
| Database | MySQL 8 |
| Frontend | React 18, React Router 6, Axios, react-table, react-select, react-toastify, react-pdf-viewer |

---

## Project structure

```
curriculum_management/
├── backend/                         Spring Boot API (Maven)
│   └── src/main/java/com/springboot/CurriculumManagement/
│       ├── Auth/                    JWT filter, token helper, security config
│       ├── Controller/              Auth, HOD, PC, Faculty and Pdf endpoints
│       ├── Entities/                Department, HOD, ProgramCoordinator, Faculty, Subjects, SubjectFile
│       ├── Repository/              Spring Data JPA repositories
│       ├── Services/                Business logic and PDF generation/merging
│       ├── UserDetailService/       Per-role user lookup for Spring Security
│       ├── Payloads/                DTOs and API responses
│       └── Exceptions/              Global exception handling
└── frontend/                        React app (Create React App)
    └── src/
        ├── Pages/                   Login, role selection, HOD/PC/Faculty screens
        ├── Components/              Navigation, tables, base URL config
        └── Auth/                    Auth context
```

---

## Getting started

### Prerequisites
- JDK 19
- MySQL 8
- Node.js 16+ and npm

### 1. Create the database

```sql
CREATE DATABASE cms;
```

Tables are created automatically on first run (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Configure the backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cms
spring.datasource.username=<your-mysql-user>
spring.datasource.password=<your-mysql-password>
jwt.secret=<a long random string, at least 32 characters>
```

> Use your own database password and JWT secret rather than the defaults committed to the repo.

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`.

### 4. Seed initial data

There is no endpoint for creating departments or HODs, so add them directly in MySQL. Passwords must be **BCrypt hashes** (any online BCrypt generator or `new BCryptPasswordEncoder().encode("...")` works).

```sql
INSERT INTO department (dept_id, dept_name, start_year, end_year)
VALUES ('CE', 'Computer Engineering', 2019, NULL);

INSERT INTO hod (hodid, hodname, password, email_id, dept_dept_id)
VALUES ('HOD01', 'Dr. Example', '<bcrypt-hash>', 'hod@example.edu', 'CE');
```

Column names follow Spring's default naming; check the generated tables if yours differ. From there the HOD can add faculty and appoint a Program Coordinator through the UI.

### 5. Run the frontend

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`. If the API runs elsewhere, change `frontend/src/Components/baseurl.js` and the `proxy` field in `frontend/package.json`.

---

## API overview

All routes except `/api/v1/auth/**` and `/Pdf/**` require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Log in with `{ "id", "password", "role" }` (`hod` / `pc` / `faculty`); returns a JWT |
| **HOD** | | |
| POST | `/HOD/getallsubjects` | Subjects in a department |
| POST | `/HOD/addnewfaculty` | Add a faculty member |
| POST | `/HOD/getallfaculty` | Faculty in a department |
| DELETE | `/HOD/deletefaculty/{facultyId}` | Remove a faculty member |
| GET | `/HOD/getfacultybyid/{facultyId}` | Faculty details |
| GET | `/HOD/appointpc/{newPcId}` | Appoint a Program Coordinator |
| POST | `/HOD/checkpc` | Current PC of a department |
| **Program Coordinator** | | |
| POST | `/PC/addnewsubject` | Create a subject |
| POST | `/PC/savesubjectdetails` | Update a subject |
| DELETE | `/PC/deletesubject/{dduCode}` | Delete a subject |
| POST | `/PC/getallsubjects` | Subjects in a department |
| POST | `/PC/getallfaculty` | Faculty in a department |
| GET | `/PC/getremainingsubsequence/{semester}` | Free sequence slots in a semester |
| GET | `/PC/getalldept` | All departments |
| **Faculty** | | |
| POST | `/Faculty/getallmysubjects` | Subjects assigned to the logged-in faculty |
| POST | `/Faculty/savesubjectdetails` | Update a subject |
| POST | `/Faculty/uploadsubjectfile` | Upload a syllabus PDF (`file`, `dduCode`) |
| GET | `/Faculty/getPdf/{dduCode}` | Download a subject's syllabus PDF |
| **Public** | | |
| GET | `/Pdf/getalladmissionyears` | Admission years with a curriculum |
| GET | `/Pdf/getalldept` | All departments |
| GET | `/Pdf/getadmissionyearbydeptname/{deptName}` | Admission years for a department |
| GET | `/Pdf/getdepartmentsbyadmissionyear/{year}` | Departments for an admission year |
| POST | `/Pdf/getmergedpdf?admissionYear=&deptName=` | Download the merged syllabus booklet |

---

## Data model

- **Department** has one HOD, one Program Coordinator, many Faculty and many Subjects.
- **Subjects** are keyed by `dduCode` and store the AICTE code, semester, sequence, subject type, teaching hours (lecture / tutorial / practical), marks (theory / sessional / termwork / practical), credits, the assigned faculty, and `effectiveDate` / `removedDate` for curriculum versioning.
- **SubjectFile** stores each subject's syllabus PDF as a BLOB, keyed by `dduCode`.

---

## Author

**Meet Dadhania** — [@meet1744](https://github.com/meet1744)
