# GreenGrid 🌱

**AI-Powered Worksite Attendance & Wage Integrity System**

GreenGrid is a next-generation workforce management platform designed specifically for rural worksites. Aligned with the vision of **Viksit Bharat @2047**, GreenGrid empowers rural India through enhanced livelihood security, productive asset creation, and technology-enabled governance. 

By leveraging cutting-edge Artificial Intelligence and biometrics, GreenGrid enhances statutory wage employment programs (extending from 100 to 125 days) by establishing a convergence-driven rural development framework focused on resilience, saturation, and transparent governance.

---

## 🎯 The Problem
Traditional rural worksite management often struggles with:
- **Proxy Attendance & Buddy Punching**: Workers clocking in for others, leading to wage leakage.
- **Inaccurate Wage Distribution**: Lack of verifiable attendance causing delayed or unfair wage payouts.
- **Manual Overhead**: Supervisors spending excessive time on manual roll-calls and paper-based records.
- **Lack of Transparency**: Limited real-time visibility for administrators and government bodies.

## 💡 Our Solution
GreenGrid introduces a robust, technology-driven ecosystem to ensure accountability and efficiency:
- **AI-Enabled Analytics**: For optimized wage distribution and workforce planning.
- **Biometric Authentication**: Live facial recognition to eliminate proxy attendance.
- **Mobile-Based Monitoring & Real-time Dashboards**: Empowering supervisors with actionable insights on the ground.
- **Spatial Technology Planning**: Enhancing infrastructure and asset creation tracking.

---

## ✨ Key Features

1. **🧑‍💻 AI Face Verification & Liveness Detection**  
   Workers are verified in real-time via an AI-powered webcam kiosk. Liveness detection ensures genuine attendance, preventing the use of photos or pre-recorded videos.
   
2. **🛡️ Prevent Proxy Attendance**  
   By generating and storing encrypted face descriptor vectors, GreenGrid mathematically guarantees that only the actual worker is marked present.

3. **📊 Supervisor Dashboard**  
   Real-time insights for site supervisors to track daily attendance, resolve uncertain biometric matches, and monitor worksite productivity.

4. **💰 Accurate Wage Payouts & Export**  
   Attendance records are immutably tied to the worker's profile, ensuring fair wage calculation. Export official CSV reports directly for government or agency processing.

---

## 🛠️ Technology Stack

GreenGrid is built using a modern, scalable, and highly performant tech stack:

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **AI / Biometrics**: `@vladmandic/face-api` (Browser-based Face Recognition & Liveness)
- **Database / ORM**: PostgreSQL, Prisma ORM (`@prisma/client`)
- **Authentication**: JWT (JSON Web Tokens), secure HTTP-only cookies
- **Media Storage**: Cloudinary (for secure storage of reference images and profiles)

---

## 🔄 How GreenGrid Works

1. **Card 01: Worker Enrollment**  
   Supervisors register workers and securely capture their facial reference images on-site. Face descriptor vectors are generated and safely stored in the database.
   
2. **Card 02: AI Attendance Kiosk**  
   Workers arrive at the site and step in front of the kiosk (tablet/mobile device). The system scans their face, verifies liveness, and logs their attendance in real-time.
   
3. **Card 03: Review & Verification**  
   If the AI detects low confidence or an uncertain match, the entry is flagged and sent to the supervisor's dashboard for manual review, ensuring no worker is unfairly denied their wage.
   
4. **Card 04: Wage Records & Export**  
   At the end of the wage cycle, administrators can instantly generate accurate attendance-based wage records and export them as CSV files for official payroll processing.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RishiVykunta/hakerthon.git
   cd hakerthon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**  
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/greengrid?schema=public"
   JWT_SECRET="your_super_secret_jwt_key"
   CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
   ```

4. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🏆 Hackathon Submission Details
**Track / Theme**: Rural Development, Tech for Good, AI / Governance  
**Team**: [Your Team Name]  
**Built for**: Enhancing transparency and efficiency in statutory wage employment guarantees.

*Let's build a smarter, fairer, and more transparent rural India together.* 🇮🇳
