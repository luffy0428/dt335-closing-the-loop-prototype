# HostelPulse · LoopFix
### Closing the Loop: Hostel Maintenance Complaints That Go Nowhere
**Course Project**: INT335 Design Thinking (CA2 Project Submission)  
**Problem Statement Reference**: `P02 · Closing the Loop`  
**Domain**: Hostel Life & Digital Student Services  

---

## 📌 Executive Summary & Problem Context

In university hostels, thousands of students encounter everyday infrastructure failures—leaking geysers, broken window latches, non-functional ceiling fans, and plumbing blockages. Under current hostel apps and physical warden intake registers, **the feedback loop back to the student is broken**:

- **No Status, No Timeline, No Confirmation**: Hostellers report a fault and hear nothing.
- **Ghost Closures**: Technicians mark complaints "Resolved" on central registers without physically visiting or verifying the fix.
- **Avoidable Friction**: Desperate students skip classes to stake out their rooms, re-raise duplicate complaints, or informally confront hostel wardens.
- **Technician Burnout**: Maintenance technicians juggle unsorted, conflicting paper slips across multi-story hostel blocks with no inventory tracking or schedule alignment.

**HostelPulse (LoopFix)** solves this systemic breakdown by introducing a **closed-loop, mutually verified digital maintenance ecosystem**.

---

## 🎯 Key Design Thinking Deliverables (CA2 Rubric)

### 1. User Personas
* **Aryan Sharma (Hosteller)**: 2nd Year B.Tech student living in Room 304, Block-B.
  - *Pain Point*: Complete radio silence after filing; anxiety about leaving room; tickets closed falsely.
  - *Need*: Real-time queue transparency, arrival ETA, and closure veto power.
* **Ramesh Kumar (Maintenance Technician)**: Campus Senior Electrician.
  - *Pain Point*: Wasted transit time walking between disparate blocks; lack of spare parts from central store; hostellers not in rooms during visits.
  - *Need*: Floor-clustered job cards, one-tap spare parts hold that transparently notifies students, and signed-off proof of work.

### 2. User Journey Mapping (Before vs. After)
| Lifecycle Stage | Traditional Flow (Broken Loop) | LoopFix Flow (Closed Loop) | Emotional Arc |
|---|---|---|---|
| **1. Fault Occurs** | Hosteller discovers leaking tap or broken fan. | Opens LoopFix on mobile; picks category with visual icons. | 😐 ➔ 😊 |
| **2. Intake & Filing** | Submits complaint; receives generic ticket # without date or ETA. | Selects preferred time slot; receives instant SLA window (4h urgent / 24h normal) and 4-digit verification OTP. | 😟 ➔ 🤩 |
| **3. Triage & Wait** | Black box. Days pass with zero updates. Re-raises duplicate complaint. | Assigned technician's card appears with live queue position (#1 in Block-B) and arrival countdown. | 😫 ➔ 😊 |
| **4. Repair Execution** | Technician arrives unannounced when student is in class; leaves unresolved. | Technician marks "On My Way" in scheduled slot; pauses for spare parts with 1-tap transparent alert. | 😟 ➔ 🤩 |
| **5. Closure & Verification** | Staff marks ticket "Resolved" unilaterally without visiting. | **Mutual Handshake**: Technician uploads photo proof and must enter student's 4-digit OTP to close. | 😫 ➔ 🤩 |
| **6. Post-Service Feedback** | No accountability or repeat tracking. | 5-star rating, satisfaction comments, and automated 14-day repeat fault watchdog. | 😐 ➔ 🤩 |

### 3. POV & How-Might-We (HMW) Statements
- **Point of View (POV)**: *"Hostel residents and maintenance teams need a transparent, mutually verified workflow because unilateral status reporting causes duplicate complaints, technician distrust, and unaddressed living conditions."*
- **HMW #1**: How might we provide hostellers real-time queue visibility so they know exactly when a technician will arrive?
- **HMW #2**: How might we eliminate "ghost closures" through mutual digital handshakes (4-digit OTP & photo proof)?
- **HMW #3**: How might we route-cluster technician tasks by hostel block and floor to minimize transit delays?
- **HMW #4**: How might we alert hostel wardens automatically before a complaint breaches SLA, avoiding angry student confrontations?

---

## 🛠️ Prototype Architecture & Interactive Features

The prototype is built as a responsive, zero-dependency web application:

1. **Hosteller (Student) Portal**:
   - Clean, friction-free fault reporting form (Plumbing, Electrical, Carpentry, Sanitation, Wi-Fi, Appliances).
   - Live 5-stage progress stepper (`Reported` ➔ `Triaged` ➔ `In-Progress` ➔ `OTP Check` ➔ `Closed`).
   - Live Estimated Time of Resolution (ETR) countdown badge and queue position transparency.
   - Assigned technician card with contact button and arrival window.
   - **Mutual OTP Security**: Displays 4-digit OTP that technician must collect in person.
   - **1-Click Escalation**: Direct alert to Chief Warden if SLA is exceeded.
   - 5-Star rating & feedback widget for resolved requests.

2. **Technician Field View (Job Card)**:
   - Profile switcher for different trade technicians (Electrical, Plumbing, Carpentry, Sanitation).
   - Route and floor clustering tabs (Block-B 3rd Floor, Block-B 1st Floor, Block-A).
   - One-tap status updates: "Accept Job", "On My Way", "Start Work".
   - **Spare Parts Hold**: Pauses SLA timer with transparent reason sent to student.
   - **Closure Modal**: Requires photo proof upload and entry of student's 4-digit OTP.

3. **Warden & Admin Oversight Dashboard**:
   - Real-time KPIs: Total Complaints Today, Active Jobs, First-Time-Fix Rate (FTFR %), Stalled / Breached Tickets (>24h).
   - **Stall Alert Watchdog**: Flags complaints stalled >24 hours with 1-click reassign.
   - **14-Day Repeat Complaint Detector**: Identifies fixtures failing repeatedly (e.g., Room 112 Fan Regulator).
   - Technician Workload Balancing table.
   - Central Searchable Master Log.

4. **CA2 Deliverables Tab**:
   - Integrated academic display of Personas, Journey Map, POV/HMW statements, and Idea Screening Matrix.

5. **Demo & Simulation Tools**:
   - `Simulate Next Step`: Fast-forwards the active ticket across lifecycle stages.
   - `Simulate 24h SLA Breach`: Simulates automated escalation to the warden.
   - `Simulate Spare Parts Hold`: Simulates inventory hold with student notification.
   - `Reset Demo`: Restores initial seed dataset in 1 click.

---

## 🚀 How to Run the Prototype Locally

No `npm install` or complex build step required! Simply open the project in any browser:

### Option 1: Direct File Open
Double-click `index.html` or open `index.html` in Chrome, Edge, Safari, or Firefox.

### Option 2: Local Python Server (Recommended)
Open PowerShell / Terminal in this folder and run:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

---

## 📦 Uploading to GitHub

An automated Python script (`upload_to_github.py`) is included to upload the repository directly to your GitHub account using the official GitHub REST API without requiring git installation.

### Method 1: Using the Automated Script
1. Generate a GitHub Personal Access Token (PAT) with `repo` scope at:  
   👉 [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Run the uploader script in terminal:
   ```bash
   python upload_to_github.py
   ```
3. Enter your token and desired repository name (e.g. `dt335-closing-the-loop-prototype`).
4. The script will automatically create the repository and upload all files!

### Method 2: Standard Git (if Git is installed)
```bash
git init
git add .
git commit -m "feat: complete INT335 P02 Closing the Loop prototype"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

---

## 📄 File Directory Structure

```
dt335proto1/
├── index.html              # Main application layout, multi-role views & modals
├── css/
│   └── styles.css          # Design system, responsive layout, animations, badges
├── js/
│   ├── data.js             # Initial seeds: complaints, technicians, personas, journey map
│   └── app.js              # State manager, real-time sync, OTP verification, simulation
├── upload_to_github.py     # Zero-dependency Python script to push to GitHub via REST API
└── README.md               # CA2 Design Thinking documentation & setup guide
```

---
*Created for INT335 Design Thinking CA2 Evaluation — Problem Statement P02.*
