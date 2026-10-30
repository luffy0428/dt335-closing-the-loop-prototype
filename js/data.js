// Initial Data Seeds & Design Thinking Artifacts for P02 Closing the Loop

const INITIAL_DATA = {
  technicians: [
    {
      id: "tech_01",
      name: "Ramesh Kumar",
      trade: "Electrical",
      phone: "+91 98765-43210",
      rating: 4.8,
      completedCount: 142,
      activeJobs: 2,
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "tech_02",
      name: "Suresh Patil",
      trade: "Plumbing",
      phone: "+91 98765-43211",
      rating: 4.6,
      completedCount: 98,
      activeJobs: 1,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "tech_03",
      name: "Mohan Lal",
      trade: "Carpentry & Locks",
      phone: "+91 98765-43212",
      rating: 4.9,
      completedCount: 114,
      activeJobs: 1,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "tech_04",
      name: "Abdul Qadir",
      trade: "Sanitation & Masonry",
      phone: "+91 98765-43213",
      rating: 4.7,
      completedCount: 86,
      activeJobs: 0,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    }
  ],

  complaints: [
    {
      id: "TICK-2041",
      category: "Plumbing",
      title: "Geyser inlet pipe leaking heavily",
      description: "Water continuously dripping from the inlet valve near bathroom sink. Floor is flooded.",
      block: "Block-B",
      room: "304",
      studentName: "Aryan Sharma",
      studentReg: "12204592",
      studentPhone: "+91 98112-99001",
      priority: "Urgent",
      preferredSlot: "Immediate (Water damage risk)",
      filedAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
      slaHours: 4,
      status: "In-Progress",
      assignedTechId: "tech_02",
      otp: "4829",
      queuePosition: 1,
      isRepeat: false,
      isEscalated: false,
      escalationReason: "",
      photoBefore: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      photoAfter: null,
      sparePartsNeeded: null,
      timeline: [
        {
          stage: "Reported",
          time: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
          note: "Complaint lodged via Hosteller Portal"
        },
        {
          stage: "Triaged & Assigned",
          time: new Date(Date.now() - 2.0 * 3600 * 1000).toISOString(),
          note: "Assigned to Suresh Patil (Plumber). Estimated arrival 3:00 PM."
        },
        {
          stage: "In-Progress",
          time: new Date(Date.now() - 0.7 * 3600 * 1000).toISOString(),
          note: "Technician reached Room 304 and started inspecting valve washer."
        }
      ],
      rating: null,
      feedback: ""
    },
    {
      id: "TICK-2042",
      category: "Electrical",
      title: "Ceiling fan regulator burnt & sparking",
      description: "Regulator made loud buzzing sound and stopped rotating. Burning plastic smell noticed.",
      block: "Block-B",
      room: "112",
      studentName: "Rohan Varma",
      studentReg: "12208741",
      studentPhone: "+91 97234-55123",
      priority: "Normal",
      preferredSlot: "5:00 PM - 7:00 PM",
      filedAt: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(),
      slaHours: 12,
      status: "Triaged",
      assignedTechId: "tech_01",
      otp: "9134",
      queuePosition: 2,
      isRepeat: true,
      isEscalated: false,
      escalationReason: "",
      photoBefore: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      photoAfter: null,
      sparePartsNeeded: null,
      timeline: [
        {
          stage: "Reported",
          time: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(),
          note: "Complaint lodged via Hosteller Portal"
        },
        {
          stage: "Triaged & Assigned",
          time: new Date(Date.now() - 0.8 * 3600 * 1000).toISOString(),
          note: "Assigned to Ramesh Kumar (Electrician). Replacement regulator queued."
        }
      ],
      rating: null,
      feedback: ""
    },
    {
      id: "TICK-2038",
      category: "Carpentry & Locks",
      title: "Balcony door latch broken / jammed",
      description: "Cannot close door properly; wind slams door during night. Security concern.",
      block: "Block-A",
      room: "408",
      studentName: "Devansh Dixit",
      studentReg: "12210045",
      studentPhone: "+91 99008-88123",
      priority: "Normal",
      preferredSlot: "11:00 AM - 1:00 PM",
      filedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      slaHours: 24,
      status: "Escalated",
      assignedTechId: "tech_03",
      otp: "6271",
      queuePosition: 1,
      isRepeat: false,
      isEscalated: true,
      escalationReason: "Exceeded SLA resolution time without status update.",
      photoBefore: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
      photoAfter: null,
      sparePartsNeeded: "Tower bolt 6-inch + latch plate",
      timeline: [
        {
          stage: "Reported",
          time: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
          note: "Complaint lodged via Hosteller Portal"
        },
        {
          stage: "Triaged & Assigned",
          time: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
          note: "Assigned to Mohan Lal (Carpenter)"
        },
        {
          stage: "Escalated",
          time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          note: "Automated SLA Breach: Escalated to Chief Warden & Maintenance Supervisor."
        }
      ],
      rating: null,
      feedback: ""
    },
    {
      id: "TICK-2035",
      category: "Electrical",
      title: "Tube light flickering continuously",
      description: "Main tube light in study area flickering constantly causing headache.",
      block: "Block-C",
      room: "205",
      studentName: "Aditya Nair",
      studentReg: "12203112",
      studentPhone: "+91 98450-22114",
      priority: "Normal",
      preferredSlot: "Anytime",
      filedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      slaHours: 24,
      status: "Closed",
      assignedTechId: "tech_01",
      otp: "1890",
      queuePosition: 0,
      isRepeat: false,
      isEscalated: false,
      escalationReason: "",
      photoBefore: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80",
      photoAfter: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=600&auto=format&fit=crop&q=80",
      sparePartsNeeded: null,
      timeline: [
        {
          stage: "Reported",
          time: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          note: "Complaint lodged via Hosteller Portal"
        },
        {
          stage: "Triaged & Assigned",
          time: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
          note: "Assigned to Ramesh Kumar"
        },
        {
          stage: "In-Progress",
          time: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
          note: "Replaced 20W LED tube choke"
        },
        {
          stage: "Verification & OTP Check",
          time: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
          note: "Student OTP 1890 verified, photo evidence validated"
        },
        {
          stage: "Closed",
          time: new Date(Date.now() - 24.5 * 3600 * 1000).toISOString(),
          note: "Complaint resolved and confirmed closed."
        }
      ],
      rating: 5,
      feedback: "Electrician arrived on time and replaced the tube quickly. Very satisfied!"
    }
  ],

  designThinking: {
    problemStatement: {
      title: "P02 · Closing the Loop: Hostel Maintenance Complaints That Go Nowhere",
      coreIssue: "A student reports a leaking tap, failed fan, or broken window and then hears nothing — no status, no timeline, no confirmation — so complaints get re-raised, escalated informally, or abandoned.",
      impact: "Unresolved small faults degrade daily living for thousands of residents and create avoidable friction between students, wardens, and maintenance teams."
    },
    personas: [
      {
        name: "Aryan Sharma",
        role: "2nd Year B.Tech Hosteller (Room 304, Block-B)",
        quote: "\"I filed a ticket 4 days ago about my water geyser. I have no idea if anyone read it, so I had to personally go to the warden's office during study hours.\"",
        painPoints: [
          "Complete radio silence after clicking 'Submit Complaint'.",
          "Technicians marking complaints 'Done' when nobody even visited.",
          "Must skip classes or stay locked in room waiting uncertainly for technicians.",
          "Forced to re-raise duplicate complaints out of desperation."
        ],
        goals: [
          "Real-time visibility of who is assigned and when they'll arrive.",
          "Power to verify closure via personal OTP so work isn't falsely completed.",
          "One-click escalation if response is stalled."
        ]
      },
      {
        name: "Ramesh Kumar",
        role: "Head Electrician (Campus Maintenance Team)",
        quote: "\"Students think we are sitting idle, but our paper job list is scattered across 4 blocks with no inventory tracking. When parts run out, we get blamed.\"",
        painPoints: [
          "Juggle disjointed paper slips with conflicting priorities.",
          "Wasted walking back-and-forth across blocks without route grouping.",
          "Accused of delays when actually waiting for spare parts from central store.",
          "Hostellers aren't in their rooms when visiting unscheduled."
        ],
        goals: [
          "Floor-clustered job list showing student's availability slot.",
          "Quick one-tap way to pause a job when waiting for spare parts.",
          "Digital photo-proof and OTP sign-off so no one disputes the work was done."
        ]
      }
    ],
    journeyMap: [
      {
        stage: "1. Fault Occurs",
        touchpoint: "Room fixture breaks (e.g. tap leaks, fan fails)",
        traditionalFlow: "Student notices fault; feels irritation and inconvenience.",
        traditionalEmotion: "neutral",
        loopfixFlow: "Student quickly opens LoopFix web app on mobile/laptop.",
        loopfixEmotion: "positive",
        opportunity: "Category picker with visual icons & quick photo upload."
      },
      {
        stage: "2. Filing & Intake",
        touchpoint: "App submission / Warden register",
        traditionalFlow: "Submits text; receives generic 'Ticket #9482 created' with no date or ETA.",
        traditionalEmotion: "negative",
        loopfixFlow: "Selects preferred time slot, receives instant SLA resolution window (e.g. 4 hrs) & 4-digit OTP.",
        loopfixEmotion: "positive",
        opportunity: "Clear SLA calculation & transparent queue position badge."
      },
      {
        stage: "3. Triage & Wait",
        touchpoint: "Maintenance assignment",
        traditionalFlow: "Black box. Days pass with zero updates. Student re-raises complaint or vents to warden.",
        traditionalEmotion: "very-negative",
        loopfixFlow: "Assigned technician's card appears with photo, mobile, and live ETA countdown.",
        loopfixEmotion: "positive",
        opportunity: "Push notification / live status updates; pause-with-reason if spare parts needed."
      },
      {
        stage: "4. Repair Execution",
        touchpoint: "Technician visits room",
        traditionalFlow: "Technician arrives unannounced when student is in class, leaves without fixing.",
        traditionalEmotion: "negative",
        loopfixFlow: "Technician marks 'On My Way' within scheduled slot, begins work with digital job card.",
        loopfixEmotion: "positive",
        opportunity: "Mutual schedule alignment; technician inventory checklist."
      },
      {
        stage: "5. Closure & Verification",
        touchpoint: "Ticket completion",
        traditionalFlow: "Staff marks ticket 'Resolved' in system without student confirmation. Fault still exists.",
        traditionalEmotion: "very-negative",
        loopfixFlow: "Technician uploads repair photo; Student verifies work and provides 4-digit OTP to close.",
        loopfixEmotion: "very-positive",
        opportunity: "Mandatory OTP verification eliminates ghost closures."
      },
      {
        stage: "6. Post-Service Feedback",
        touchpoint: "Rating & Analytics",
        traditionalFlow: "No mechanism to evaluate quality. Chronic issues repeat continually.",
        traditionalEmotion: "neutral",
        loopfixFlow: "5-star rating, instant satisfaction survey, and 14-day repeat fault monitoring.",
        loopfixEmotion: "very-positive",
        opportunity: "Supervisor dashboard tracks First-Time-Fix Rate and technician performance."
      }
    ],
    povHmw: {
      pov: "Hostel residents and maintenance teams need a transparent, mutually verified workflow because unilateral status reporting causes duplicate complaints, technician distrust, and unaddressed living conditions.",
      hmwList: [
        "How Might We provide hostellers real-time queue visibility so they know exactly when a technician will arrive?",
        "How Might We prevent 'ghost closures' through mutual digital handshakes (like OTP or photo proof)?",
        "How Might We give technicians route-optimized job cards with one-tap spare parts hold to eliminate unnecessary walking?",
        "How Might We alert hostel wardens automatically before a complaint breaches SLA, avoiding angry student confrontations?"
      ]
    },
    screeningMatrix: [
      {
        idea: "Mutual OTP Closure Verification",
        impact: "High (Eliminates false closures completely)",
        feasibility: "High (Simple 4-digit code generated in-app)",
        score: "5/5 (Core Feature)"
      },
      {
        idea: "Live SLA Countdown & Queue Position Tracker",
        impact: "High (Stops duplicate filings & anxiety)",
        feasibility: "High (Deterministic based on queue load)",
        score: "5/5 (Core Feature)"
      },
      {
        idea: "Technician Route & Floor Clustering",
        impact: "High (Cuts technician transit time by 40%)",
        feasibility: "Medium (Requires grouping by block/floor)",
        score: "4.5/5 (Implemented)"
      },
      {
        idea: "Spare Parts Pause with Student Notification",
        impact: "Medium-High (Explains valid delays)",
        feasibility: "High (One-click state toggle)",
        score: "4.5/5 (Implemented)"
      },
      {
        idea: "Automated Warden Stall Alerts (>24h)",
        impact: "High (Ensures accountability)",
        feasibility: "High (Timestamp rule trigger)",
        score: "5/5 (Core Feature)"
      }
    ]
  }
};
