// script.js — Full Extended Version for Francine for Hope Hub
// ==============================================
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

    // =============================================================
    // 📋 APPLICATION FORM HANDLER
    // =============================================================
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
