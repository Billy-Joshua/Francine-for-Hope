// script.js - Extended and polished version with animated toasts, 
// persistent reminders, and patient tracker enhancements

document.addEventListener("DOMContentLoaded", () => {

    // ===================================================
    // UNIVERSAL TOAST SYSTEM (Animated, Reusable)
    // ===================================================
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerText = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add("show"), 50);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // Toast Styles (auto-injected)
    const style = document.createElement("style");
    style.innerHTML = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 12px 18px;
            border-radius: 8px;
            font-size: 15px;
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
    document.head.appendChild(style);

    showToast("Welcome to Francine for Hope Cancer Support Hub!", "info");

    // ===================================================
    // HERO TYPING EFFECT
    // ===================================================
    const heroText = "Building a Future of Hope";
    const heroElement = document.querySelector(".hero h2");
    if (heroElement) {
        heroElement.textContent = "";
        let i = 0;
        (function typeHero() {
            if (i < heroText.length) {
                heroElement.textContent += heroText.charAt(i);
                i++;
                setTimeout(typeHero, 100);
            }
        })();
    }

    // ===================================================
    // SCROLL FADE-IN ANIMATION
    // ===================================================
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

    // ===================================================
    // HOVER BUTTON EFFECT
    // ===================================================
    document.querySelectorAll("button, input[type='submit'], a").forEach(btn => {
        btn.addEventListener("mouseenter", () => (btn.style.transform = "scale(1.05)"));
        btn.addEventListener("mouseleave", () => (btn.style.transform = "scale(1)"));
    });

    // ===================================================
    // LIGHT BULB TOGGLE
    // ===================================================
    window.light = state => {
        const img = document.getElementById("myImage");
        if (img) img.src = state === 1 ? "image/pic_bulbon.gif" : "image/pic_bulboff.gif";
    };

    // ===================================================
    // HIDE ELEMENTS BY CLASS
    // ===================================================
    window.myFunction = () => {
        document.querySelectorAll(".cancer").forEach(el => (el.style.display = "none"));
    };

    // ===================================================
    // SHOW CURRENT DATE
    // ===================================================
    window.showDate = () => {
        const demo = document.getElementById("demo");
        if (demo) demo.innerHTML = new Date().toLocaleString();
    };

    // ===================================================
    // DONATION TRACKER
    // ===================================================
    let totalDonations = 0;
    window.makeDonation = () => {
        const amount = parseInt(document.getElementById("donationAmount").value);
        if (!amount || amount < 1000) {
            showToast("Please enter at least 1000 RWF.", "error");
            return;
        }
        totalDonations += amount;
        document.getElementById("donationStatus").innerText = `Total donations: RWF ${totalDonations}`;
        const progress = Math.min((totalDonations / 1000000) * 100, 100);
        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("donationAmount").value = "";
        showToast("Donation added. Thank you!", "success");
    };

    // ===================================================
    // APPLY FORM (SAVES TO LOCALSTORAGE)
    // ===================================================
    const applyForm = document.getElementById("applyForm");
    if (applyForm) {
        applyForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const needs = document.getElementById("needs").value;

            localStorage.setItem(phone, JSON.stringify({ name, phone, needs }));
            document.getElementById("applyStatus").innerText = "Application submitted successfully!";
            showToast("Application saved!", "success");
            applyForm.reset();
        });
    }

    // ===================================================
    // PATIENT PORTAL - CHECK APPLICATION
    // ===================================================
    window.checkApplication = () => {
        const phone = document.getElementById("portalPhone").value;
        const data = localStorage.getItem(phone);
        const result = document.getElementById("portalResult");

        if (data) {
            const app = JSON.parse(data);
            result.innerHTML = `<p><strong>Name:</strong> ${app.name}</p>
                                <p><strong>Needs:</strong> ${app.needs}</p>`;
            showToast("Application found!", "success");
        } else {
            result.innerText = "No application found for this phone number.";
            showToast("No record found.", "error");
        }
    };

    // ===================================================
    // ADMIN LOGIN
    // ===================================================
    window.adminLogin = () => {
        const password = document.getElementById("adminPassword").value;
        if (password === "admin123") {
            document.getElementById("adminPanel").style.display = "block";
            showToast("Welcome, Admin!", "success");
        } else {
            showToast("Wrong password!", "error");
        }
    };

    // ===================================================
    // CHEMOTHERAPY SCHEDULER
    // ===================================================
    const scheduleForm = document.getElementById("scheduleForm");
    if (scheduleForm) {
        scheduleForm.addEventListener("submit", e => {
            e.preventDefault();
            const patient = document.getElementById("patientName").value;
            const date = document.getElementById("chemoDate").value;
            const list = document.getElementById("scheduleList");
            const li = document.createElement("li");
            li.innerText = `${patient} - Chemotherapy on ${date}`;
            list.appendChild(li);
            scheduleForm.reset();
            showToast("Schedule added!", "success");
        });
    }

    // ===================================================
    // PATIENT TRACKER TOGGLE
    // ===================================================
    window.toggleTracker = () => {
        const tracker = document.getElementById("patients");
        if (!tracker) return;
        const isHidden = tracker.style.display === "none" || !tracker.style.display;
        tracker.style.display = isHidden ? "block" : "none";
        showToast(isHidden ? "Patient Tracker opened." : "Patient Tracker closed.", "info");
    };

    // ===================================================
    // MEDICATION REMINDER SYSTEM (With LocalStorage + Log)
    // ===================================================
    let reminderLog = JSON.parse(localStorage.getItem("reminderLog") || "[]");

    function updateReminderList() {
        const container = document.getElementById("reminderHistory");
        if (container) {
            container.innerHTML = reminderLog
                .map(r => `<li>${r.time} - ${r.medName}</li>`)
                .join("");
        }
    }

    window.setReminder = () => {
        const timeInput = document.getElementById("reminderTime").value;
        const medName = document.getElementById("medicationName").value;
        if (!timeInput || !medName) {
            showToast("Please enter both time and medication name.", "error");
            return;
        }

        const [hours, minutes] = timeInput.split(":").map(Number);
        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        if (reminderTime < now) reminderTime.setDate(reminderTime.getDate() + 1);

        const diff = reminderTime - now;

        // Save to log
        reminderLog.push({ time: timeInput, medName });
        localStorage.setItem("reminderLog", JSON.stringify(reminderLog));
        updateReminderList();

        document.getElementById("reminderStatus").innerText = `Reminder set for ${timeInput} - ${medName}`;
        showToast(`Reminder set for ${medName}`, "success");

        // Schedule the alert
        setTimeout(() => {
            alert(`⏰ Time to take your medication: ${medName}`);
            showToast(`Time to take: ${medName}`, "info");
        }, diff);

        document.getElementById("reminderTime").value = "";
        document.getElementById("medicationName").value = "";
    };

    // Load existing reminders on start
    updateReminderList();
});
