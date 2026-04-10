# 🏥 Hospital Management System
### Java Full Stack + React + Google Gemini AI

---

## 📁 Project Structure

```
hospital-management/
├── backend/                  ← Spring Boot (Java)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/hospital/
│       │   ├── HospitalManagementApplication.java
│       │   ├── config/SecurityConfig.java
│       │   ├── controller/  (Auth, Doctor, Patient, Appointment, AI, Admin)
│       │   ├── dto/AuthDTO.java
│       │   ├── entity/      (User, Doctor, Patient, Appointment)
│       │   ├── repository/  (4 JPA repositories)
│       │   ├── security/    (JWT, Filter, UserDetailsService)
│       │   └── service/     (Auth, Doctor, Patient, Appointment, Gemini)
│       └── resources/
│           └── application.properties
└── frontend/                 ← React
    ├── package.json
    └── src/
        ├── App.js
        ├── index.js / index.css
        ├── context/AuthContext.js
        ├── services/api.js
        ├── components/common/ (Navbar, Sidebar)
        └── pages/ (Login, Register, AdminDashboard, DoctorDashboard, PatientDashboard)
```

---

## ⚙️ Prerequisites — Install These First

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org/download.cgi |
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ | https://dev.mysql.com/downloads |
| IDE | IntelliJ / VS Code | Your choice |

---

## 🔑 STEP 1 — Get Your Gemini API Key (FREE)

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll need it in Step 3

---

## 🗄️ STEP 2 — Set Up MySQL Database

Open your MySQL client (MySQL Workbench or terminal) and run:

```sql
CREATE DATABASE hospital_db;
```

That's it! Spring Boot will auto-create all tables when you start the server.

If your MySQL password is different from "root", note it for Step 3.

---

## 🔧 STEP 3 — Configure the Backend

Open this file:
```
backend/src/main/resources/application.properties
```

Update these two lines:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
```

Save the file.

---

## 🚀 STEP 4 — Start the Backend (Spring Boot)

Open a terminal, navigate to the backend folder:

```bash
cd hospital-management/backend
mvn clean install
mvn spring-boot:run
```

✅ You should see:
```
Started HospitalManagementApplication on port 8080
```

Keep this terminal open.

---

## 🌐 STEP 5 — Start the Frontend (React)

Open a NEW terminal, navigate to the frontend folder:

```bash
cd hospital-management/frontend
npm install
npm start
```

✅ Browser will auto-open at: **http://localhost:3000**

---

## 👤 STEP 6 — Create Your First Accounts

Go to http://localhost:3000/register and create accounts in this order:

### 1. Admin Account
- Select **ADMIN** role
- Fill name, email, password
- Register and you're in!

### 2. Doctor Account
- Select **DOCTOR** role
- Fill in specialization (e.g. Cardiology), qualification (MBBS, MD)
- Fill experience, fee, available days & time
- Register

### 3. Patient Account
- Select **PATIENT** role
- Fill in date of birth, gender, blood group
- Register

---

## 🎯 Features by Role

### 👑 Admin
- Dashboard with total stats (doctors, patients, appointments)
- View all doctors and patients
- Manage and update appointment statuses

### 👨‍⚕️ Doctor
- Personal dashboard with appointment stats
- View all appointments, confirm or complete them
- Add consultation notes (marks appointment as completed)
- Edit profile (availability, fees, etc.)

### 🤒 Patient
- Personal health card (blood group, gender, etc.)
- Browse all doctors, filter by name/specialization
- Book appointments with date, time, symptoms
- View & cancel appointments
- **🤖 AI Symptom Checker** — describe symptoms, get AI analysis of possible conditions, recommended department, urgency level
- Edit personal profile

---

## 🛠️ Tech Stack (For Interviews)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend Framework | Spring Boot 3.2 | REST API server |
| Security | Spring Security + JWT | Authentication & Authorization |
| ORM | Spring Data JPA + Hibernate | Database operations |
| Database | MySQL 8 | Data storage |
| AI Integration | Google Gemini API | Symptom analysis |
| HTTP Client | Spring WebFlux (WebClient) | Calling Gemini API |
| Frontend | React 18 | User interface |
| Routing | React Router v6 | SPA navigation |
| HTTP (frontend) | Axios | API calls |
| Notifications | React Toastify | User feedback |
| Build Tool | Maven | Java dependency mgmt |

---

## ❓ Common Issues & Fixes

### ❌ "Access Denied" on API calls
→ Make sure you're sending the JWT token in the Authorization header.
→ The `api.js` interceptor handles this automatically.

### ❌ MySQL connection error
→ Check your MySQL is running.
→ Verify password in `application.properties`.
→ Make sure `hospital_db` database exists.

### ❌ Gemini API error
→ Verify your API key is correct in `application.properties`.
→ Check you have internet connection.
→ Free tier has rate limits — wait 1 minute and retry.

### ❌ CORS error in browser
→ Make sure Spring Boot is running on port 8080.
→ Make sure React is running on port 3000.
→ The CORS config in `SecurityConfig.java` allows localhost:3000.

### ❌ npm install fails
→ Make sure Node.js 18+ is installed: `node --version`
→ Try: `npm install --legacy-peer-deps`

---

## 🎤 Interview Q&A Prep

**Q: Why Spring Boot?**
A: Spring Boot provides auto-configuration, embedded Tomcat, and production-ready features out of the box — reducing boilerplate significantly compared to plain Spring MVC.

**Q: How does JWT authentication work here?**
A: On login, the server creates a signed JWT token containing the user's email. The client stores it and sends it in every request's Authorization header. The JwtAuthFilter intercepts each request, validates the token's signature and expiry, and sets the SecurityContext.

**Q: How does role-based access work?**
A: Spring Security's `@EnableMethodSecurity` combined with `hasRole()` in SecurityConfig restricts API endpoints. ADMIN can access `/api/admin/**`, DOCTOR can access `/api/doctor/**`, etc.

**Q: How is the Gemini AI integrated?**
A: Spring WebFlux's WebClient makes a POST request to the Gemini REST API with a structured prompt. The response is parsed from the JSON candidate array and returned to the frontend.

**Q: How would you scale this for 1 million users?**
A: Add connection pooling (HikariCP), implement Redis caching for frequently accessed data (doctor lists), move to microservices architecture, use an API gateway, and deploy on Kubernetes with horizontal scaling.

**Q: What would you improve with more time?**
A: Add billing/payment module, real-time notifications via WebSockets, email/SMS reminders, file upload for medical reports, and a more robust ML model for symptom analysis.

---

## 📦 Build for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/hospital-management-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build/ folder with any static server
```

---

*Built with ❤️ for interview success. Own every line of this code!*
