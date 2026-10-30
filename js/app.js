/**
 * HostelPulse · LoopFix — Prototype Application Controller
 * Handles Multi-Persona State, Real-time Sync, SLA Rules, and Simulation
 */

const LoopFixApp = (function () {
  // Storage Keys
  const STORAGE_KEY_COMPLAINTS = "loopfix_complaints_v1";
  const STORAGE_KEY_TECHS = "loopfix_techs_v1";

  // Application State
  let state = {
    currentRole: "student", // 'student' | 'technician' | 'warden' | 'design-thinking'
    selectedTechId: "tech_02", // Suresh Patil (Plumbing) by default
    techClusterFilter: "all",
    studentFilter: "all",
    complaints: [],
    technicians: []
  };

  /**
   * Initialize Application
   */
  function init() {
    loadState();
    setupEventListeners();
    setupRealtimeSync();
    renderAll();
  }

  /**
   * Load data from localStorage or initial seed
   */
  function loadState() {
    try {
      const storedComplaints = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
      const storedTechs = localStorage.getItem(STORAGE_KEY_TECHS);

      if (storedComplaints && storedTechs) {
        state.complaints = JSON.parse(storedComplaints);
        state.technicians = JSON.parse(storedTechs);
      } else {
        resetToInitialSeed();
      }
    } catch (e) {
      console.warn("Storage error, resetting to seed", e);
      resetToInitialSeed();
    }
  }

  /**
   * Reset data to initial seed
   */
  function resetToInitialSeed() {
    state.complaints = JSON.parse(JSON.stringify(INITIAL_DATA.complaints));
    state.technicians = JSON.parse(JSON.stringify(INITIAL_DATA.technicians));
    saveState();
  }

  /**
   * Save state to localStorage and re-render
   */
  function saveState() {
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(state.complaints));
    localStorage.setItem(STORAGE_KEY_TECHS, JSON.stringify(state.technicians));
    updateBadges();
  }

  /**
   * Listen for changes across tabs
   */
  function setupRealtimeSync() {
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY_COMPLAINTS || e.key === STORAGE_KEY_TECHS) {
        loadState();
        renderAll();
        showToast("Synchronized update from another view", "info");
      }
    });
  }

  /**
   * Attach UI event listeners
   */
  function setupEventListeners() {
    // Role switcher tabs
    document.querySelectorAll(".role-tab-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const view = this.getAttribute("data-view");
        switchRole(view);
      });
    });

    // Student Filter chips
    const studentChips = document.getElementById("student-filter-chips");
    if (studentChips) {
      studentChips.querySelectorAll(".cluster-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          studentChips.querySelectorAll(".cluster-btn").forEach((b) => b.classList.remove("active"));
          this.classList.add("active");
          state.studentFilter = this.getAttribute("data-filter");
          renderStudentTicketsTable();
        });
      });
    }

    // Technician Selector
    const techSelect = document.getElementById("tech-select");
    if (techSelect) {
      techSelect.value = state.selectedTechId;
      techSelect.addEventListener("change", function () {
        state.selectedTechId = this.value;
        renderTechnicianView();
      });
    }

    // Technician Block Cluster Filters
    const blockChips = document.getElementById("tech-block-filters");
    if (blockChips) {
      blockChips.querySelectorAll(".cluster-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          blockChips.querySelectorAll(".cluster-btn").forEach((b) => b.classList.remove("active"));
          this.classList.add("active");
          state.techClusterFilter = this.getAttribute("data-cluster");
          renderTechnicianView();
        });
      });
    }

    // New Complaint Modal Trigger
    const btnNewTicket = document.getElementById("btn-open-new-ticket");
    if (btnNewTicket) {
      btnNewTicket.addEventListener("click", () => openModal("modal-new-complaint"));
    }

    // Form: New Complaint
    const formNewComplaint = document.getElementById("form-new-complaint");
    if (formNewComplaint) {
      formNewComplaint.addEventListener("submit", handleNewComplaintSubmit);
    }

    // Form: Technician Completion with OTP
    const formCompleteJob = document.getElementById("form-complete-job");
    if (formCompleteJob) {
      formCompleteJob.addEventListener("submit", handleCompleteJobSubmit);
    }

    // Form: Spare Parts Hold
    const formPartsHold = document.getElementById("form-parts-hold");
    if (formPartsHold) {
      formPartsHold.addEventListener("submit", handlePartsHoldSubmit);
    }

    // Form: Feedback Rating
    const formFeedback = document.getElementById("form-feedback");
    if (formFeedback) {
      formFeedback.addEventListener("submit", handleFeedbackSubmit);
    }

    // Star Rating Widget interaction
    const starBox = document.getElementById("star-rating-box");
    if (starBox) {
      starBox.querySelectorAll("span").forEach((star) => {
        star.addEventListener("click", function () {
          const rating = parseInt(this.getAttribute("data-star"), 10);
          document.getElementById("inp-selected-stars").value = rating;
          updateStarDisplay(rating);
        });
      });
    }

    // Demo / Simulation Buttons
    const btnSimStep = document.getElementById("btn-simulate-step");
    if (btnSimStep) {
      btnSimStep.addEventListener("click", simulateNextStep);
    }

    const btnResetData = document.getElementById("btn-reset-data");
    if (btnResetData) {
      btnResetData.addEventListener("click", function () {
        if (confirm("Reset prototype to initial seed dataset?")) {
          resetToInitialSeed();
          renderAll();
          showToast("Prototype reset to initial state", "info");
        }
      });
    }

    // Student Simulation Shortcuts
    const simAdvance = document.getElementById("sim-advance-stage");
    if (simAdvance) simAdvance.addEventListener("click", simulateNextStep);

    const simEscalate = document.getElementById("sim-trigger-escalation");
    if (simEscalate) simEscalate.addEventListener("click", simulateEscalation);

    const simParts = document.getElementById("sim-parts-hold");
    if (simParts) simParts.addEventListener("click", simulateSparePartsHold);

    // Warden Master Search Input
    const searchInput = document.getElementById("warden-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderWardenMasterTable(this.value.trim().toLowerCase());
      });
    }
  }

  /**
   * Switch between Active Views
   */
  function switchRole(role) {
    state.currentRole = role;

    // Update active tab buttons
    document.querySelectorAll(".role-tab-btn").forEach((btn) => {
      if (btn.getAttribute("data-view") === role) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Toggle view sections
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.remove("active-view");
    });

    const activeSec = document.getElementById(`${role}-view`);
    if (activeSec) {
      activeSec.classList.add("active-view");
    }

    renderAll();
  }

  /**
   * Render everything based on current role
   */
  function renderAll() {
    updateBadges();

    if (state.currentRole === "student") {
      renderStudentView();
    } else if (state.currentRole === "technician") {
      renderTechnicianView();
    } else if (state.currentRole === "warden") {
      renderWardenView();
    } else if (state.currentRole === "design-thinking") {
      renderDesignThinkingView();
    }
  }

  /**
   * Update header notification badge counts
   */
  function updateBadges() {
    const activeTechJobs = state.complaints.filter(
      (c) => c.status === "Triaged" || c.status === "In-Progress"
    ).length;
    const techBadge = document.getElementById("tech-badge-count");
    if (techBadge) techBadge.textContent = activeTechJobs;

    const stalledCount = state.complaints.filter((c) => c.isEscalated || c.status === "Escalated").length;
    const wardenBadge = document.getElementById("warden-badge-count");
    if (wardenBadge) wardenBadge.textContent = stalledCount;
  }

  /* =========================================================================
     VIEW 1: HOSTELLER / STUDENT LOGIC
     ========================================================================= */

  function renderStudentView() {
    renderStudentActiveTicket();
    renderStudentTicketsTable();
  }

  function renderStudentActiveTicket() {
    const container = document.getElementById("student-active-ticket-container");
    if (!container) return;

    // Find primary ticket for student Aryan (Room 304 or most active)
    const activeTicket =
      state.complaints.find((c) => c.room === "304" && c.status !== "Closed") ||
      state.complaints.find((c) => c.status !== "Closed") ||
      state.complaints[0];

    if (!activeTicket) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem;">
          <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
          <h3 style="font-size:1.25rem; font-weight:700;">No Pending Complaints!</h3>
          <p style="color:var(--neutral-500); font-size:0.9rem; margin-top:0.25rem;">
            All fixtures in Room 304 are verified and functional. Click 'Report New Fault' if anything breaks.
          </p>
        </div>
      `;
      return;
    }

    const assignedTech = state.technicians.find((t) => t.id === activeTicket.assignedTechId);
    const stages = ["Reported", "Triaged", "In-Progress", "Verification", "Closed"];
    const currentStageIndex = getStageIndex(activeTicket.status);

    // Compute remaining SLA time
    const filedTime = new Date(activeTicket.filedAt).getTime();
    const slaMs = activeTicket.slaHours * 3600 * 1000;
    const elapsedMs = Date.now() - filedTime;
    const remainingHours = Math.max(0, ((slaMs - elapsedMs) / (3600 * 1000))).toFixed(1);
    const isBreached = elapsedMs > slaMs || activeTicket.isEscalated;

    let stepperHtml = stages
      .map((st, idx) => {
        let stateClass = "";
        if (idx < currentStageIndex) stateClass = "completed";
        else if (idx === currentStageIndex) stateClass = "active";

        const label =
          st === "Triaged"
            ? "Assigned"
            : st === "Verification"
            ? "OTP Check"
            : st;

        return `
          <div class="step-item ${stateClass}">
            <div class="step-node">${idx < currentStageIndex ? "✓" : idx + 1}</div>
            <div class="step-label">${label}</div>
          </div>
        `;
      })
      .join("");

    container.className = `card-panel active-ticket-card ${activeTicket.priority.toLowerCase()} ${
      activeTicket.isEscalated ? "escalated" : ""
    }`;

    container.innerHTML = `
      <div class="ticket-top-bar">
        <div class="ticket-id-tag">${activeTicket.id}</div>
        <div class="ticket-badges">
          <span class="badge ${activeTicket.priority === "Urgent" ? "badge-urgent" : "badge-normal"}">
            ${activeTicket.priority === "Urgent" ? "🚨 Urgent" : "Normal"}
          </span>
          <span class="badge badge-sla ${isBreached ? "breached" : ""}">
            ${
              isBreached
                ? "⚠️ SLA Breached"
                : `⏱️ Expected within ~${remainingHours}h`
            }
          </span>
          <span class="badge" style="background:var(--primary-light); color:var(--primary);">
            ${activeTicket.category}
          </span>
        </div>
      </div>

      <div class="ticket-heading">
        <h3>${activeTicket.title}</h3>
        <p style="color:var(--neutral-600); font-size:0.9rem; margin-top:0.35rem;">${activeTicket.description}</p>
      </div>

      <div class="ticket-meta-info" style="margin-top:0.75rem;">
        <span class="ticket-meta-item">📍 ${activeTicket.block}, Room ${activeTicket.room}</span>
        <span class="ticket-meta-item">🕒 Filed: ${formatTimeAgo(activeTicket.filedAt)}</span>
        <span class="ticket-meta-item">🚪 Preferred: ${activeTicket.preferredSlot}</span>
      </div>

      <!-- Queue Transparency Banner -->
      <div class="queue-banner">
        <div class="queue-banner-left">
          <span>📊</span>
          <span>Queue Position: <strong class="queue-badge-number">#${activeTicket.queuePosition || 1}</strong> in ${activeTicket.block} ${activeTicket.category}</span>
        </div>
        <span style="font-size:0.75rem; color:#0369a1;">Live updates enabled</span>
      </div>

      <!-- Spare Parts Hold Notification if applicable -->
      ${
        activeTicket.sparePartsNeeded
          ? `
        <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:var(--radius-md); padding:0.85rem 1rem; margin-bottom:1.25rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; color:#92400e; font-weight:700; font-size:0.85rem;">
            <span>📦</span> Job Temporarily Paused for Spare Parts
          </div>
          <p style="font-size:0.775rem; color:#78350f; margin-top:0.25rem;">
            Technician requested: <strong>${activeTicket.sparePartsNeeded}</strong> from central maintenance inventory. SLA clock is paused.
          </p>
        </div>
      `
          : ""
      }

      <!-- 5-Step Visual Progress Stepper -->
      <div class="tracking-stepper">
        ${stepperHtml}
      </div>

      <!-- Assigned Technician Card -->
      ${
        assignedTech
          ? `
        <div class="tech-assigned-panel">
          <div class="tech-info-flex">
            <img src="${assignedTech.avatar}" alt="${assignedTech.name}" class="tech-avatar-img">
            <div class="tech-details">
              <h4>${assignedTech.name}</h4>
              <p>${assignedTech.trade} Specialist • ${assignedTech.completedCount} jobs completed</p>
              <div class="tech-rating-stars">
                <span>⭐ ${assignedTech.rating}</span>
                <span style="color:var(--neutral-400);">• Verified Campus Staff</span>
              </div>
            </div>
          </div>
          <div class="tech-contact-box">
            <a href="tel:${assignedTech.phone}" class="btn-contact-tech">
              <span>📞</span> Call Technician
            </a>
            <span style="font-size:0.725rem; color:var(--neutral-400); margin-top:0.35rem;">${assignedTech.phone}</span>
          </div>
        </div>
      `
          : `
        <div style="padding:1rem; background:var(--neutral-50); border-radius:var(--radius-md); font-size:0.85rem; color:var(--neutral-500); text-align:center;">
          Automated triage in progress. Maintenance supervisor is assigning the nearest trade technician.
        </div>
      `
      }

      <!-- Mutual OTP Closure Card -->
      <div class="otp-closure-card">
        <div class="otp-left-text">
          <h4>🛡️ Your Closure Verification Code</h4>
          <p>
            Share this 4-digit code <strong>ONLY</strong> with the technician after they physically inspect and resolve the fault. They cannot mark this ticket closed without your code.
          </p>
        </div>
        <div class="otp-display-code">${activeTicket.otp}</div>
      </div>

      <!-- 1-Click Escalation if stalled or breached -->
      ${
        !activeTicket.isEscalated && activeTicket.status !== "Closed"
          ? `
        <div class="escalate-bar">
          <div class="escalate-info">
            <span>⏱️</span>
            <span>Experiencing delay or no technician contact?</span>
          </div>
          <button class="btn-escalate-ticket" onclick="LoopFixApp.triggerEscalation('${activeTicket.id}')">
            ⚠️ 1-Click Escalate to Warden
          </button>
        </div>
      `
          : activeTicket.isEscalated
          ? `
        <div class="escalate-bar" style="background:#fee2e2; border-color:#fca5a5;">
          <div class="escalate-info" style="color:#991b1b; font-weight:700;">
            <span>🚨</span>
            <span>Escalated to Chief Warden Office (SLA Priority Flagged)</span>
          </div>
          <span style="font-size:0.75rem; color:#7f1d1d;">Supervisory review pending</span>
        </div>
      `
          : ""
      }
    `;
  }

  function renderStudentTicketsTable() {
    const tbody = document.getElementById("student-tickets-tbody");
    if (!tbody) return;

    let filtered = state.complaints;
    if (state.studentFilter === "active") {
      filtered = filtered.filter((c) => c.status !== "Closed");
    } else if (state.studentFilter === "escalated") {
      filtered = filtered.filter((c) => c.isEscalated || c.status === "Escalated");
    } else if (state.studentFilter === "closed") {
      filtered = filtered.filter((c) => c.status === "Closed");
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--neutral-500);">No tickets match the selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map((ticket) => {
        return `
        <tr>
          <td><strong style="color:var(--primary); font-family:monospace;">${ticket.id}</strong></td>
          <td>
            <div style="font-weight:600; color:var(--neutral-900);">${ticket.title}</div>
            <small style="color:var(--neutral-500);">Room ${ticket.room} • ${formatTimeAgo(ticket.filedAt)}</small>
          </td>
          <td><span class="badge" style="background:var(--neutral-100); color:var(--neutral-700);">${ticket.category}</span></td>
          <td>
            <span class="badge ${ticket.priority === "Urgent" ? "badge-urgent" : "badge-normal"}">
              ${ticket.priority}
            </span>
          </td>
          <td>
            <span class="badge" style="${getStatusBadgeStyle(ticket.status)}">
              ${ticket.status}
            </span>
          </td>
          <td>
            ${
              ticket.status === "Closed"
                ? `
                <button class="cluster-btn" onclick="LoopFixApp.openFeedbackModal('${ticket.id}')" style="background:var(--success-light); color:var(--success-text); border:none;">
                  ${ticket.rating ? `⭐ ${ticket.rating}/5 Rated` : "★ Rate Service"}
                </button>
              `
                : `
                <button class="cluster-btn" onclick="LoopFixApp.selectAndTrackTicket('${ticket.id}')" style="background:var(--primary-light); color:var(--primary); border:none;">
                  Track Live
                </button>
              `
            }
          </td>
        </tr>
      `;
      })
      .join("");
  }

  function handleNewComplaintSubmit(e) {
    e.preventDefault();
    const category = document.querySelector('input[name="category"]:checked')?.value || "Plumbing";
    const title = document.getElementById("inp-title").value.trim();
    const desc = document.getElementById("inp-desc").value.trim();
    const priority = document.getElementById("inp-priority").value;
    const slot = document.getElementById("inp-slot").value;

    const newId = `TICK-${Math.floor(2050 + Math.random() * 50)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Auto assign matching technician based on category
    let techId = "tech_02"; // default plumber
    if (category === "Electrical") techId = "tech_01";
    else if (category === "Carpentry & Locks") techId = "tech_03";
    else if (category === "Sanitation & Masonry") techId = "tech_04";

    const newTicket = {
      id: newId,
      category: category,
      title: title,
      description: desc,
      block: "Block-B",
      room: "304",
      studentName: "Aryan Sharma",
      studentReg: "12204592",
      studentPhone: "+91 98112-99001",
      priority: priority,
      preferredSlot: slot,
      filedAt: new Date().toISOString(),
      slaHours: priority === "Urgent" ? 4 : 24,
      status: "Reported",
      assignedTechId: techId,
      otp: randomOtp,
      queuePosition: 2,
      isRepeat: false,
      isEscalated: false,
      escalationReason: "",
      photoBefore: null,
      photoAfter: null,
      sparePartsNeeded: null,
      timeline: [
        {
          stage: "Reported",
          time: new Date().toISOString(),
          note: "Complaint submitted via student portal. Verification OTP generated."
        }
      ],
      rating: null,
      feedback: ""
    };

    state.complaints.unshift(newTicket);
    saveState();
    closeModal("modal-new-complaint");
    formNewComplaint.reset();
    renderAll();
    showToast(`Ticket ${newId} logged successfully! OTP is ${randomOtp}`, "success");
  }

  /* =========================================================================
     VIEW 2: TECHNICIAN FIELD JOB LOGIC
     ========================================================================= */

  function renderTechnicianView() {
    const container = document.getElementById("tech-jobs-container");
    if (!container) return;

    const tech = state.technicians.find((t) => t.id === state.selectedTechId) || state.technicians[0];

    // Filter jobs for this technician and block cluster
    let jobs = state.complaints.filter((c) => c.assignedTechId === tech.id);

    if (state.techClusterFilter !== "all") {
      jobs = jobs.filter((c) => c.block === state.techClusterFilter);
    }

    if (jobs.length === 0) {
      container.innerHTML = `
        <div class="card-panel" style="text-align:center; padding:3rem 1rem;">
          <div style="font-size:2.5rem; margin-bottom:0.75rem;">📋</div>
          <h3 style="font-weight:700;">No Open Jobs in this Cluster</h3>
          <p style="color:var(--neutral-500); font-size:0.875rem;">
            ${tech.name} has cleared all current ${tech.trade} work orders for ${state.techClusterFilter}.
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = jobs
      .map((job) => {
        const isUrgent = job.priority === "Urgent";
        return `
        <div class="job-card" style="border-left:5px solid ${isUrgent ? "var(--danger)" : "var(--primary)"};">
          <div class="job-card-header">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <span class="room-badge">${job.block} · Room ${job.room}</span>
                <span class="ticket-id-tag">${job.id}</span>
                <span class="badge ${isUrgent ? "badge-urgent" : "badge-normal"}">${job.priority}</span>
                ${
                  job.isRepeat
                    ? `<span class="badge" style="background:#fce7f3; color:#be185d;">⚠️ Repeat Complaint (14d)</span>`
                    : ""
                }
              </div>
              <h3 style="font-size:1.1rem; font-weight:700; color:var(--neutral-900);">${job.title}</h3>
              <p style="font-size:0.85rem; color:var(--neutral-600); margin-top:0.25rem;">${job.description}</p>
            </div>
            <div style="text-align:right;">
              <span class="badge" style="${getStatusBadgeStyle(job.status)} font-size:0.8rem;">
                ${job.status}
              </span>
              <div style="font-size:0.75rem; color:var(--neutral-400); margin-top:0.35rem;">
                Filed ${formatTimeAgo(job.filedAt)}
              </div>
            </div>
          </div>

          <div style="background:var(--neutral-50); border:1px solid var(--neutral-200); border-radius:var(--radius-md); padding:0.75rem 1rem; margin:0.75rem 0; font-size:0.825rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
            <div>👤 <strong>${job.studentName}</strong> (Reg: ${job.studentReg})</div>
            <div>📞 <a href="tel:${job.studentPhone}" style="color:var(--primary); font-weight:600; text-decoration:none;">${job.studentPhone}</a></div>
            <div>🕒 Preferred Slot: <strong>${job.preferredSlot}</strong></div>
          </div>

          ${
            job.sparePartsNeeded
              ? `
            <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:var(--radius-sm); padding:0.5rem 0.75rem; font-size:0.8rem; color:#92400e; margin-bottom:0.75rem;">
              📦 <strong>Parts On Order:</strong> ${job.sparePartsNeeded}
            </div>
          `
              : ""
          }

          <div class="job-actions-row">
            ${
              job.status === "Reported" || job.status === "Triaged"
                ? `
                <button class="btn-job btn-job-start" onclick="LoopFixApp.updateJobStatus('${job.id}', 'In-Progress')">
                  ▶ Accept & Start Work
                </button>
              `
                : ""
            }

            ${
              job.status === "In-Progress"
                ? `
                <button class="btn-job btn-job-pause" onclick="LoopFixApp.openPartsHoldModal('${job.id}')">
                  ⏸️ Request Spare Parts (Pause SLA)
                </button>
                <button class="btn-job btn-job-complete" onclick="LoopFixApp.openCompleteModal('${job.id}')">
                  ✅ Complete: Enter Student OTP
                </button>
              `
                : ""
            }

            ${
              job.status === "Closed"
                ? `
                <div style="display:flex; align-items:center; gap:0.5rem; color:var(--success); font-weight:700; font-size:0.85rem;">
                  <span>✓ Verified Closed with Student OTP</span>
                  ${job.rating ? `<span style="color:#d97706;">(Rated: ${job.rating}★)</span>` : ""}
                </div>
              `
                : ""
            }
          </div>
        </div>
      `;
      })
      .join("");
  }

  function updateJobStatus(ticketId, newStatus) {
    const ticket = state.complaints.find((c) => c.id === ticketId);
    if (!ticket) return;

    ticket.status = newStatus;
    ticket.timeline.push({
      stage: newStatus,
      time: new Date().toISOString(),
      note: `Status updated to ${newStatus} by technician.`
    });

    saveState();
    renderAll();
    showToast(`Ticket ${ticketId} updated to ${newStatus}`, "success");
  }

  function openCompleteModal(ticketId) {
    document.getElementById("complete-ticket-id").value = ticketId;
    document.getElementById("inp-otp-verify").value = "";
    document.getElementById("inp-tech-notes").value = "";
    openModal("modal-complete-job");
  }

  function handleCompleteJobSubmit(e) {
    e.preventDefault();
    const ticketId = document.getElementById("complete-ticket-id").value;
    const enteredOtp = document.getElementById("inp-otp-verify").value.trim();
    const notes = document.getElementById("inp-tech-notes").value.trim();

    const ticket = state.complaints.find((c) => c.id === ticketId);
    if (!ticket) return;

    // Validate mutual OTP handshake
    if (enteredOtp !== ticket.otp) {
      showToast("❌ Incorrect Student OTP! You must obtain the 4-digit code directly from the hosteller.", "danger");
      return;
    }

    // OTP matched! Mark ticket as Closed
    ticket.status = "Closed";
    ticket.isEscalated = false;
    ticket.timeline.push({
      stage: "Verification & OTP Check",
      time: new Date().toISOString(),
      note: `Student OTP (${enteredOtp}) verified in person. Notes: ${notes || "Repairs confirmed"}`
    });
    ticket.timeline.push({
      stage: "Closed",
      time: new Date().toISOString(),
      note: "Work order officially closed and verified."
    });

    // Update technician stats
    const tech = state.technicians.find((t) => t.id === ticket.assignedTechId);
    if (tech) {
      tech.completedCount += 1;
      tech.activeJobs = Math.max(0, tech.activeJobs - 1);
    }

    saveState();
    closeModal("modal-complete-job");
    renderAll();
    showToast(`🎉 Work order ${ticketId} closed! Mutual OTP verified.`, "success");
  }

  function openPartsHoldModal(ticketId) {
    document.getElementById("parts-ticket-id").value = ticketId;
    document.getElementById("inp-parts-needed").value = "";
    openModal("modal-parts-hold");
  }

  function handlePartsHoldSubmit(e) {
    e.preventDefault();
    const ticketId = document.getElementById("parts-ticket-id").value;
    const part = document.getElementById("inp-parts-needed").value.trim();
    const eta = document.getElementById("inp-parts-eta").value;

    const ticket = state.complaints.find((c) => c.id === ticketId);
    if (!ticket) return;

    ticket.sparePartsNeeded = `${part} (${eta})`;
    ticket.timeline.push({
      stage: "In-Progress (Hold)",
      time: new Date().toISOString(),
      note: `Job held for spare parts: ${part}. Student notified; SLA paused.`
    });

    saveState();
    closeModal("modal-parts-hold");
    renderAll();
    showToast(`Spare parts hold logged for ${ticketId}. Hosteller notified.`, "warning");
  }

  /* =========================================================================
     VIEW 3: WARDEN & ADMIN LOGIC
     ========================================================================= */

  function renderWardenView() {
    // Update KPI counters
    const total = state.complaints.length;
    const active = state.complaints.filter((c) => c.status !== "Closed").length;
    const stalled = state.complaints.filter((c) => c.isEscalated || c.status === "Escalated").length;

    document.getElementById("kpi-total").textContent = total;
    document.getElementById("kpi-active").textContent = active;
    document.getElementById("kpi-stalled").textContent = stalled;

    // Render Tech table
    renderWardenTechTable();

    // Render Master complaints table
    renderWardenMasterTable();
  }

  function renderWardenTechTable() {
    const tbody = document.getElementById("warden-tech-table");
    if (!tbody) return;

    tbody.innerHTML = state.technicians
      .map((tech) => {
        const activeCount = state.complaints.filter(
          (c) => c.assignedTechId === tech.id && c.status !== "Closed"
        ).length;

        return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <img src="${tech.avatar}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">
              <strong>${tech.name}</strong>
            </div>
          </td>
          <td><span class="badge" style="background:var(--neutral-100); color:var(--neutral-700);">${tech.trade}</span></td>
          <td>
            <span class="badge ${activeCount > 2 ? "badge-urgent" : "badge-normal"}">
              ${activeCount} Active
            </span>
          </td>
          <td>${tech.completedCount}</td>
          <td>⭐ ${tech.rating}</td>
          <td>
            <span class="badge" style="background:var(--success-light); color:var(--success-text);">
              ● Active on Campus
            </span>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  function renderWardenMasterTable(searchQuery = "") {
    const tbody = document.getElementById("warden-master-tbody");
    if (!tbody) return;

    let tickets = state.complaints;
    if (searchQuery) {
      tickets = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(searchQuery) ||
          t.room.toLowerCase().includes(searchQuery) ||
          t.title.toLowerCase().includes(searchQuery) ||
          t.studentName.toLowerCase().includes(searchQuery)
      );
    }

    tbody.innerHTML = tickets
      .map((t) => {
        const tech = state.technicians.find((tech) => tech.id === t.assignedTechId);
        return `
        <tr>
          <td><strong style="font-family:monospace; color:var(--primary);">${t.id}</strong></td>
          <td>${t.studentName}<br><small style="color:var(--neutral-400);">Reg: ${t.studentReg}</small></td>
          <td>${t.block}, Rm ${t.room}</td>
          <td>
            <div style="font-weight:600;">${t.title}</div>
            <small style="color:var(--neutral-500);">${t.category} • ${t.priority}</small>
          </td>
          <td>${tech ? tech.name : "Unassigned"}</td>
          <td>
            <span class="badge ${t.isEscalated ? "badge-sla breached" : "badge-sla"}">
              ${t.isEscalated ? "⚠️ Breached" : "On Track"}
            </span>
          </td>
          <td>
            <span class="badge" style="${getStatusBadgeStyle(t.status)}">
              ${t.status}
            </span>
          </td>
          <td>
            <button class="cluster-btn" onclick="LoopFixApp.openReassignModal('${t.id}')">
              Reassign
            </button>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  function openReassignModal(ticketId) {
    const ticket = state.complaints.find((c) => c.id === ticketId);
    if (!ticket) return;

    const availableTechs = state.technicians.map((t) => `${t.id}: ${t.name} (${t.trade})`).join("\n");
    const chosen = prompt(
      `Fast-Track / Reassign Ticket ${ticket.id} (${ticket.title}):\n\nEnter Technician ID (e.g. tech_01, tech_02, tech_03, tech_04):\n\n${availableTechs}`,
      ticket.assignedTechId
    );

    if (chosen && state.technicians.some((t) => t.id === chosen.trim())) {
      ticket.assignedTechId = chosen.trim();
      ticket.isEscalated = false;
      ticket.status = "Triaged";
      ticket.timeline.push({
        stage: "Triaged & Reassigned",
        time: new Date().toISOString(),
        note: `Fast-tracked and reassigned to technician ${chosen.trim()} by Warden Office.`
      });
      saveState();
      renderAll();
      showToast(`Ticket ${ticket.id} successfully reassigned!`, "success");
    }
  }

  /* =========================================================================
     VIEW 4: DESIGN THINKING ARTIFACTS LOGIC
     ========================================================================= */

  function renderDesignThinkingView() {
    // Journey map table
    const jTbody = document.getElementById("dt-journey-tbody");
    if (jTbody) {
      jTbody.innerHTML = INITIAL_DATA.designThinking.journeyMap
        .map((jm) => {
          return `
          <tr>
            <td><strong>${jm.stage}</strong><br><small style="color:var(--neutral-500);">${jm.touchpoint}</small></td>
            <td>
              <div>${jm.traditionalFlow}</div>
              <div style="margin-top:0.35rem;">
                <span class="emotion-pill emotion-${jm.traditionalEmotion}">
                  ${getEmotionLabel(jm.traditionalEmotion)}
                </span>
              </div>
            </td>
            <td>
              <div>${jm.loopfixFlow}</div>
              <div style="margin-top:0.35rem;">
                <span class="emotion-pill emotion-${jm.loopfixEmotion}">
                  ${getEmotionLabel(jm.loopfixEmotion)}
                </span>
              </div>
            </td>
            <td><strong style="color:var(--primary); font-size:0.8rem;">${jm.opportunity}</strong></td>
          </tr>
        `;
        })
        .join("");
    }

    // HMW Grid
    const hmwGrid = document.getElementById("dt-hmw-grid");
    if (hmwGrid) {
      hmwGrid.innerHTML = INITIAL_DATA.designThinking.povHmw.hmwList
        .map((hmw, i) => {
          return `
          <div style="background:#ffffff; border:1px solid var(--neutral-200); border-radius:var(--radius-md); padding:1rem; box-shadow:var(--shadow-sm);">
            <div style="color:var(--primary); font-weight:800; font-size:0.75rem; text-transform:uppercase;">HMW Statement #${i + 1}</div>
            <div style="font-weight:600; color:var(--neutral-800); font-size:0.9rem; margin-top:0.35rem;">${hmw}</div>
          </div>
        `;
        })
        .join("");
    }

    // Screening Matrix Table
    const scrTbody = document.getElementById("dt-screening-tbody");
    if (scrTbody) {
      scrTbody.innerHTML = INITIAL_DATA.designThinking.screeningMatrix
        .map((row) => {
          return `
          <tr>
            <td><strong>${row.idea}</strong></td>
            <td><span style="color:var(--success-text); font-weight:600;">${row.impact}</span></td>
            <td>${row.feasibility}</td>
            <td><strong style="color:var(--primary);">${row.score}</strong></td>
          </tr>
        `;
        })
        .join("");
    }
  }

  /* =========================================================================
     SIMULATION SHORTCUTS & HELPERS
     ========================================================================= */

  function simulateNextStep() {
    const activeTicket =
      state.complaints.find((c) => c.status !== "Closed") || state.complaints[0];
    if (!activeTicket) {
      showToast("No active tickets to advance!", "info");
      return;
    }

    const flow = ["Reported", "Triaged", "In-Progress", "Closed"];
    const currIdx = flow.indexOf(activeTicket.status);

    if (currIdx === -1 || currIdx === flow.length - 1) {
      // Reopen or loop
      activeTicket.status = "Reported";
      showToast(`Ticket ${activeTicket.id} reset to 'Reported'`, "info");
    } else {
      const nextStatus = flow[currIdx + 1];
      activeTicket.status = nextStatus;
      activeTicket.timeline.push({
        stage: nextStatus,
        time: new Date().toISOString(),
        note: `Simulated milestone transition to ${nextStatus}.`
      });
      showToast(`⚡ Simulation: ${activeTicket.id} advanced to ${nextStatus}`, "success");
    }

    saveState();
    renderAll();
  }

  function simulateEscalation() {
    const activeTicket =
      state.complaints.find((c) => c.status !== "Closed") || state.complaints[0];
    if (activeTicket) {
      activeTicket.isEscalated = true;
      activeTicket.status = "Escalated";
      activeTicket.timeline.push({
        stage: "Escalated",
        time: new Date().toISOString(),
        note: "Simulated 24-hour SLA breach. Escalated to Chief Warden."
      });
      saveState();
      renderAll();
      showToast(`🚨 Simulated SLA breach for ${activeTicket.id}. Warden alerted!`, "danger");
    }
  }

  function simulateSparePartsHold() {
    const activeTicket =
      state.complaints.find((c) => c.status !== "Closed") || state.complaints[0];
    if (activeTicket) {
      activeTicket.sparePartsNeeded = "Replacement heating element & brass washer (Store Requisition)";
      activeTicket.timeline.push({
        stage: "In-Progress (Hold)",
        time: new Date().toISOString(),
        note: "Parts requisition queued. Student notified; SLA paused."
      });
      saveState();
      renderAll();
      showToast(`📦 Simulated spare parts hold for ${activeTicket.id}`, "warning");
    }
  }

  function triggerEscalation(ticketId) {
    const ticket = state.complaints.find((c) => c.id === ticketId);
    if (!ticket) return;

    ticket.isEscalated = true;
    ticket.status = "Escalated";
    ticket.timeline.push({
      stage: "Escalated",
      time: new Date().toISOString(),
      note: "Hosteller initiated 1-click manual escalation to Warden Office due to delay."
    });

    saveState();
    renderAll();
    showToast("⚠️ Ticket escalated directly to Chief Warden & Maintenance Supervisor!", "danger");
  }

  function openFeedbackModal(ticketId) {
    document.getElementById("feedback-ticket-id").value = ticketId;
    document.getElementById("inp-feedback-text").value = "";
    document.getElementById("inp-selected-stars").value = "5";
    updateStarDisplay(5);
    openModal("modal-feedback");
  }

  function handleFeedbackSubmit(e) {
    e.preventDefault();
    const ticketId = document.getElementById("feedback-ticket-id").value;
    const rating = parseInt(document.getElementById("inp-selected-stars").value, 10);
    const feedback = document.getElementById("inp-feedback-text").value.trim();

    const ticket = state.complaints.find((c) => c.id === ticketId);
    if (ticket) {
      ticket.rating = rating;
      ticket.feedback = feedback;
      saveState();
      renderAll();
      showToast("Thank you for your rating! Feedback captured.", "success");
    }
    closeModal("modal-feedback");
  }

  function updateStarDisplay(count) {
    const stars = document.querySelectorAll("#star-rating-box span");
    stars.forEach((s, idx) => {
      s.style.color = idx < count ? "#f59e0b" : "#cbd5e1";
    });
  }

  /* =========================================================================
     UTILITIES & MODALS
     ========================================================================= */

  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("active");
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("active");
  }

  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>●</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function getStageIndex(status) {
    switch (status) {
      case "Reported":
        return 0;
      case "Triaged":
        return 1;
      case "In-Progress":
        return 2;
      case "Escalated":
        return 2;
      case "Verification":
        return 3;
      case "Closed":
        return 4;
      default:
        return 0;
    }
  }

  function getStatusBadgeStyle(status) {
    switch (status) {
      case "Reported":
        return "background:var(--neutral-200); color:var(--neutral-800);";
      case "Triaged":
        return "background:var(--secondary-light); color:var(--secondary);";
      case "In-Progress":
        return "background:var(--primary-light); color:var(--primary); font-weight:700;";
      case "Escalated":
        return "background:#fee2e2; color:#991b1b; font-weight:700;";
      case "Closed":
        return "background:var(--success-light); color:var(--success-text); font-weight:700;";
      default:
        return "";
    }
  }

  function getEmotionLabel(emotion) {
    switch (emotion) {
      case "very-negative":
        return "😫 Very Frustrated";
      case "negative":
        return "😟 Anxious / Stalled";
      case "neutral":
        return "😐 Neutral / Inconvenienced";
      case "positive":
        return "😊 Reassured & Transparent";
      case "very-positive":
        return "🤩 Delighted & Empowered";
      default:
        return emotion;
    }
  }

  function formatTimeAgo(isoString) {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (3600 * 1000));
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (60 * 1000));
      return `${Math.max(1, diffMins)}m ago`;
    }
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  // Public API
  return {
    init,
    openModal,
    closeModal,
    showToast,
    updateJobStatus,
    openCompleteModal,
    openPartsHoldModal,
    openFeedbackModal,
    openReassignModal,
    triggerEscalation
  };
})();

// Launch application on DOM ready
document.addEventListener("DOMContentLoaded", LoopFixApp.init);
