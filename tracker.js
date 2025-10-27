
// Author: Joshua Billy Ishimwe
// Description: Handles UI animation, patient portal, admin features,
// donation tracking, medication reminders, and real-time interactivity.
// ==============================================

document.addEventListener("DOMContentLoaded", () => {

    // =============================================================
    // 🔔 TOAST SYSTEM (Animated + Persistent + Reusable)
    // =============================================================
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 50); // smooth fade-in
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 500); // remove after fade-out
        }, 4000);
    }

    // Inject toast styles
    const toastStyle = document.createElement("style");
    toastStyle.innerHTML = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.85);
            color: white;
            padding: 14px 20px;
            border-radius: 8px;
            font-size: 15px;
            font-family: 'Segoe UI', sans-serif;
            box-shadow: 0 3px 12px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
            z-index: 9999;
        }
        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        .toast.success { background: #198754; }
        .toast.error { background: #dc3545; }
        .toast.info { background: #0dcaf0; }
    `;
    document.head.appendChild(toastStyle);

    showToast("🌿 Welcome to Francine for Hope Cancer Support Hub!", "info");

    // =============================================================
    // 🖋 HERO SECTION TYPING EFFECT
    // =============================================================
    const heroText = "Building a Future of Hope and Healing...";
    const heroElement = document.querySelector(".hero h2");
    if (heroElement) {
        heroElement.textContent = "";
        let i = 0;
        (function typeEffect() {
            if (i < heroText.length) {
                heroElement.textContent += heroText.charAt(i);
                i++;
                setTimeout(typeEffect, 90);
            }
        })();
    }

    // =============================================================
    // 🌫️ FADE-IN EFFECT ON SCROLL
    // =============================================================
    const sections = document.querySelectorAll("section");
    function checkFade() {
        const triggerBottom = window.innerHeight * 0.85;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            section.classList.toggle("show", sectionTop < triggerBottom);
        });
    }
    window.addEventListener("scroll", checkFade);
    checkFade();

    // =============================================================
    // 🖱️ BUTTON HOVER ANIMATION
    // =============================================================
    document.querySelectorAll("button, input[type='submit'], a").forEach(btn => {
        btn.addEventListener("mouseenter", () => (btn.style.transform = "scale(1.05)"));
        btn.addEventListener("mouseleave", () => (btn.style.transform = "scale(1)"));
    });

    // =============================================================
    // 💡 LIGHT BULB FUNCTION
    // =============================================================
    window.light = function(state) {
        const bulb = document.getElementById("myImage");
        if (bulb) bulb.src = state === 1 ? "image/pic_bulbon.gif" : "image/pic_bulboff.gif";
    };

    // =============================================================
    // ❌ HIDE ELEMENTS BY CLASS
    // =============================================================
    window.myFunction = function() {
        document.querySelectorAll(".cancer").forEach(el => (el.style.display = "none"));
        showToast("Cancer awareness section hidden.", "info");
    };

    // =============================================================
    // 📅 SHOW CURRENT DATE
    // =============================================================
    window.showDate = function() {
        const demo = document.getElementById("demo");
        if (demo) demo.innerText = new Date().toLocaleString();
    };

    // =============================================================
    // 💰 DONATION MANAGEMENT SYSTEM
    // =============================================================
    let totalDonations = parseInt(localStorage.getItem("totalDonations")) || 0;

    function updateDonationUI() {
        const status = document.getElementById("donationStatus");
        const bar = document.getElementById("progressBar");
        if (status) status.innerText = `Total donations: RWF ${totalDonations.toLocaleString()}`;
        if (bar) bar.style.width = `${Math.min((totalDonations / 1000000) * 100, 100)}%`;
    }
    updateDonationUI();

    window.makeDonation = function() {
        const input = document.getElementById("donationAmount");
        const amount = parseInt(input.value);
        if (!amount || amount < 1000) {
            showToast("Minimum donation is 1,000 RWF.", "error");
            return;
        }
        totalDonations += amount;
        localStorage.setItem("totalDonations", totalDonations);
        updateDonationUI();
        showToast("💖 Thank you for your generosity!", "success");
        input.value = "";
    };

 // 📋 APPLICATION FORM HANDLER

    const applyForm = document.getElementById("applyForm");
    if (applyForm) {
        applyForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const needs = document.getElementById("needs").value;

            if (!name || !phone || !needs) {
                showToast("All fields are required.", "error");
                return;
            }

            localStorage.setItem(phone, JSON.stringify({ name, phone, needs, date: new Date() }));
            document.getElementById("applyStatus").innerText = "Application submitted successfully!";
            showToast("Application saved successfully.", "success");
            applyForm.reset();
        });
    }

    // =============================================================
    // 🧍 PATIENT PORTAL LOOKUP
    // =============================================================
    window.checkApplication = function() {
        const phone = document.getElementById("portalPhone").value;
        const data = localStorage.getItem(phone);
        const result = document.getElementById("portalResult");

        if (!result) return;

        if (data) {
            const app = JSON.parse(data);
            result.innerHTML = `
                <p><strong>Name:</strong> ${app.name}</p>
                <p><strong>Needs:</strong> ${app.needs}</p>
                <p><em>Submitted on:</em> ${new Date(app.date).toLocaleString()}</p>
            `;
            showToast("Patient record found!", "success");
        } else {
            result.innerText = "No record found for that phone number.";
            showToast("No record found.", "error");
        }
    };

    // =============================================================
    // 🔐 ADMIN LOGIN / LOGOUT
    // =============================================================
    window.adminLogin = function() {
        const password = document.getElementById("adminPassword").value;
        const panel = document.getElementById("adminPanel");
        if (password === "admin123") {
            panel.style.display = "block";
            localStorage.setItem("adminLogged", "true");
            showToast("Welcome Admin! Access granted.", "success");
        } else {
            showToast("Invalid admin password.", "error");
        }
    };

    window.adminLogout = function() {
        localStorage.removeItem("adminLogged");
        document.getElementById("adminPanel").style.display = "none";
        showToast("Logged out successfully.", "info");
    };

    // Auto-login restore
    if (localStorage.getItem("adminLogged") === "true") {
        const panel = document.getElementById("adminPanel");
        if (panel) panel.style.display = "block";
    }

    // =============================================================
    // 🧾 EXPORT DATA AS JSON (for admin)
    // =============================================================
    window.exportData = function() {
        const allData = { applications: [], donations: totalDonations };
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (/^\d+$/.test(key)) {
                allData.applications.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "francine_hub_data.json";
        link.click();
        showToast("Admin data exported successfully.", "info");
    };

    // =============================================================
    // 💉 CHEMOTHERAPY SCHEDULE MANAGER
    // =============================================================
    const scheduleForm = document.getElementById("scheduleForm");
    const scheduleList = document.getElementById("scheduleList");
    const schedules = JSON.parse(localStorage.getItem("schedules") || "[]");

    function renderSchedules() {
        if (!scheduleList) return;
        scheduleList.innerHTML = "";
        schedules.forEach((s, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${s.patient} — ${s.date} 
                <button onclick="deleteSchedule(${index})">Delete</button>`;
            li.style.background = s.date < new Date().toISOString().split("T")[0] ? "#f8d7da" : "#d1e7dd";
            li.style.margin = "6px 0";
            li.style.padding = "6px 8px";
            li.style.borderRadius = "6px";
            scheduleList.appendChild(li);
        });
        localStorage.setItem("schedules", JSON.stringify(schedules));
    }

    window.deleteSchedule = function(i) {
        schedules.splice(i, 1);
        renderSchedules();
        showToast("Schedule deleted.", "error");
    };

    if (scheduleForm) {
        scheduleForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("patientName").value;
            const date = document.getElementById("chemoDate").value;
            if (!name || !date) {
                showToast("Please fill all fields.", "error");
                return;
            }
            schedules.push({ patient: name, date });
            renderSchedules();
            showToast("Chemotherapy schedule added.", "success");
            scheduleForm.reset();
        });
    }
    renderSchedules();

    // =============================================================
    // 🧍 PATIENT TRACKER TOGGLE
    // =============================================================
    window.toggleTracker = function() {
        const tracker = document.getElementById("patients");
        if (!tracker) return;
        const visible = tracker.style.display === "block";
        tracker.style.display = visible ? "none" : "block";
        showToast(visible ? "Patient Tracker closed." : "Patient Tracker opened.", "info");
    };

    // =============================================================
    // 💊 MEDICATION REMINDER SYSTEM (Persistent + Repeat)
    // =============================================================
    let reminderLog = JSON.parse(localStorage.getItem("reminderLog") || "[]");

    function updateReminderList() {
        const history = document.getElementById("reminderHistory");
        if (!history) return;
        history.innerHTML = reminderLog
            .map(r => `<li>${r.time} - ${r.medName}</li>`)
            .join("") || "<li>No reminders yet.</li>";
    }

    window.setReminder = function() {
        const timeInput = document.getElementById("reminderTime").value;
        const medName = document.getElementById("medicationName").value;
        const repeat = document.getElementById("repeatDaily")?.checked;

        if (!timeInput || !medName) {
            showToast("Enter medication name and time.", "error");
            return;
        }

        const [hours, minutes] = timeInput.split(":").map(Number);
        const now = new Date();
        let reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        if (reminderTime < now) reminderTime.setDate(reminderTime.getDate() + 1);

        const diff = reminderTime - now;
        reminderLog.push({ time: timeInput, medName });
        localStorage.setItem("reminderLog", JSON.stringify(reminderLog));
        updateReminderList();

        setTimeout(() => {
            alert(`💊 Time to take your medication: ${medName}`);
            showToast(`Time to take ${medName}`, "info");
            if (repeat) window.setReminder(timeInput, medName);
        }, diff);

        document.getElementById("reminderStatus").innerText =
            `Reminder set for ${timeInput} (${medName})${repeat ? " - Daily" : ""}`;
        showToast("Medication reminder saved!", "success");
        document.getElementById("reminderTime").value = "";
        document.getElementById("medicationName").value = "";
    };

    updateReminderList();

    // =============================================================
    // 🌅 END OF SCRIPT
    // =============================================================
    console.log("✅ Francine for Hope Hub script loaded successfully.");
});

// ====== script.js - Enhanced Version for Francine for Hope ======

// Toast Notification Utility
function showToast(message, duration = 3000, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// ====== HERO TYPING EFFECT ======
function typeText(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ====== FADE-IN SECTIONS ON SCROLL ======
function initFadeInSections() {
    const sections = document.querySelectorAll("section");
    function checkFade() {
        const triggerBottom = window.innerHeight * 0.9;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            section.classList.toggle("show", sectionTop < triggerBottom);
        });
    }
    window.addEventListener("scroll", checkFade);
    checkFade();
}

// ====== SMOOTH SCROLL ======
function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
}

// ====== MOBILE MENU ======
function initMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.querySelector(".navbar ul");
    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle("active");
        menuToggle.classList.toggle("open");
    });
}

// ====== AI SCREENING TOOL ======
function initAIScreening() {
    const aiForm = document.getElementById("aiForm");
    if (!aiForm) return;

    aiForm.addEventListener("submit", e => {
        e.preventDefault();
        const symptoms = document.getElementById("symptoms").value.toLowerCase().trim();
        const resultDiv = document.getElementById("aiResult");
        resultDiv.innerHTML = "";

        let advice = "No specific matches found. Consult a doctor for guidance.";
        const rules = [
            { keywords: ["lump", "swelling"], text: "Possible breast cancer risk. Advice: Mammogram recommended." },
            { keywords: ["cough", "breathlessness"], text: "Possible lung cancer risk. Advice: Consult doctor for CT scan." },
            { keywords: ["fatigue", "weight loss"], text: "General cancer indicator. Advice: Blood tests recommended." },
            { keywords: ["pain", "bleeding"], text: "Possible colon/liver cancer. Advice: Colonoscopy or liver scan advised." },
            { keywords: ["skin change", "mole"], text: "Possible skin cancer. Advice: Dermatologist visit." },
            { keywords: ["urination issues", "blood in urine"], text: "Possible prostate cancer. Advice: PSA test for men over 50." },
            { keywords: ["jaundice", "abdominal pain"], text: "Possible liver cancer. Advice: Liver function tests and vaccination." }
        ];

        rules.some(rule => {
            if (rule.keywords.some(k => symptoms.includes(k))) {
                advice = rule.text;
                return true;
            }
        });

        resultDiv.innerHTML = `<p>${advice}</p><p><strong>Note:</strong> This is for awareness, not medical advice.</p>`;
        showToast("AI advice generated!", 3000, "success");
        aiForm.reset();
    });
}

// ====== DONATIONS ======
let totalDonations = 0;
function makeDonation() {
    const amount = parseInt(document.getElementById("donationAmount").value);
    if (!amount || amount < 1000) return showToast("Minimum 1000 RWF required!", 2000, "error");

    totalDonations += amount;
    document.getElementById("donationStatus").innerText = `Total: RWF ${totalDonations}`;
    const progress = Math.min((totalDonations / 1000000) * 100, 100);
    document.getElementById("progressBar").style.width = `${progress}%`;
    document.getElementById("donationAmount").value = "";
    showToast("Thank you for your donation!", 2500, "success");
}

// ====== APPLICATION FORM ======
function initApplyForm() {
    const applyForm = document.getElementById("applyForm");
    if (!applyForm) return;

    applyForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const needs = document.getElementById("needs").value.trim();

        if (!name || !phone || !needs) return showToast("All fields are required!", 2000, "error");

        document.getElementById("applyStatus").innerText = "Application submitted successfully!";
        applyForm.reset();
        showToast("Application sent!", 2000, "success");
    });
}

// ====== PATIENT PORTAL ======
function toggleTracker() {
    const tracker = document.getElementById("patients");
    if (!tracker) return;
    tracker.style.display = tracker.style.display === "none" ? "block" : "none";
    showToast(tracker.style.display === "block" ? "Tracker opened" : "Tracker closed");
}

function checkApplication() {
    const phone = document.getElementById("portalPhone").value.trim();
    if (!phone) return showToast("Please enter a phone number.", 2000, "error");
    document.getElementById("portalResult").innerHTML = `<p>Application for ${phone}: Placeholder details</p>`;
    showToast("Application checked!", 2000, "success");
}

function setReminder() {
    const time = document.getElementById("reminderTime").value;
    const name = document.getElementById("medicationName").value.trim();
    if (!time || !name) return showToast("Both fields are required!", 2000, "error");

    document.getElementById("reminderStatus").textContent = `Reminder set for ${time} - ${name}`;
    showToast("Medication reminder set!", 2000, "success");
}

// ====== ADMIN LOGIN ======
function adminLogin() {
    const passwordInput = document.getElementById("adminPassword").value;
    const adminPanel = document.getElementById("adminPanel");
    const correctPassword = "MyHospital123";

    if (passwordInput === correctPassword) {
        adminPanel.style.display = "block";
        showToast("Admin login successful!", 2500, "success");
    } else {
        adminPanel.style.display = "none";
        showToast("Incorrect password.", 2500, "error");
    }

    document.getElementById("adminPassword").value = "";
}

// ====== CHEMO SCHEDULE MANAGER ======
function initScheduleForm() {
    const scheduleForm = document.getElementById("scheduleForm");
    if (!scheduleForm) return;

    scheduleForm.addEventListener("submit", e => {
        e.preventDefault();

        const patientName = document.getElementById("patientName").value.trim();
        const chemoDate = document.getElementById("chemoDate").value;

        if (!patientName || !chemoDate) return showToast("Please fill in all fields!", 2000, "error");

        const scheduleList = document.getElementById("scheduleList");
        const li = document.createElement("li");
        li.className = "schedule-item";
        li.innerHTML = `
            <strong>Patient:</strong> ${patientName} <br>
            <strong>Date:</strong> ${chemoDate}
            <button class="delete-btn">Delete</button>
        `;

        li.querySelector(".delete-btn").addEventListener("click", () => li.remove());
        scheduleList.appendChild(li);
        scheduleForm.reset();
        showToast("Schedule added!", 2000, "success");
    });
}

// ====== RESOURCE SEARCH ======
function initResourceSearch() {
    const searchInput = document.getElementById("resourceSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".resource-card");
        cards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = title.includes(query) ? "block" : "none";
        });
    });
}

// ====== INITIALIZE EVERYTHING ======
document.addEventListener("DOMContentLoaded", () => {
    showToast("Welcome to Francine for Hope – Let's Fight Cancer Together!", 3000, "success");

    const heroElement = document.querySelector(".hero h2");
    if (heroElement) typeText(heroElement, "Building a Future of Hope");
    initFadeInSections();
    initMobileMenu();
    initAIScreening();      
    initApplyForm();
    initScheduleForm();
    initResourceSearch();
});