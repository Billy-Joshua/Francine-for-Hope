document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Toast Notification
    // =========================
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showToast("Welcome to Francine for Hope – Let's Fight Cancer Together!");

    // =========================
    // Hero Typing Effect
    // =========================
    const heroText = "Building a Future of Hope and Strength";
    const heroElement = document.querySelector(".hero h2");
    let i = 0;
    function typeHeroText() {
        if (i < heroText.length) {
            heroElement.innerHTML += heroText.charAt(i);
            i++;
            setTimeout(typeHeroText, 100);
        }
    }
    if (heroElement) {
        heroElement.innerHTML = "";
        typeHeroText();
    }

    // =========================
    // Fade-in Sections on Scroll
    // =========================
    const sections = document.querySelectorAll("section");
    function checkFade() {
        const triggerBottom = window.innerHeight * 0.9;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) section.classList.add("show");
            else section.classList.remove("show");
        });
    }
    window.addEventListener("scroll", checkFade);
    checkFade();

    // =========================
    // Smooth Scroll for Nav Links
    // =========================
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                if (targetId === 'patients') {
                    target.style.display = target.style.display === 'none' ? 'block' : 'block'; // Ensure visible
                    showToast("Patient Tracker opened");
                }
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // =========================
    // Toggle Patient Tracker
    // =========================
    window.toggleTracker = function() {
        const tracker = document.getElementById('patients');
        const isVisible = tracker.style.display !== 'none';
        tracker.style.display = isVisible ? 'none' : 'block';
        showToast(isVisible ? 'Patient Tracker hidden' : 'Patient Tracker shown');
        if (!isVisible) loadPatientList();
    };

    function loadPatientList() {
        const patientList = document.getElementById('patientList') || document.createElement('ul');
        if (!document.getElementById('patientList')) {
            patientList.id = 'patientList';
            document.getElementById('patients').appendChild(patientList);
        }
        patientList.innerHTML = '';
        const patients = loadFromStorage() || [];
        patients.forEach(patient => {
            const li = document.createElement('li');
            li.innerHTML = `${patient.name} - ${patient.phone} - ${patient.needs} <button onclick="deletePatient('${patient.id}')">Delete</button>`;
            patientList.appendChild(li);
        });
    }

    window.deletePatient = function(id) {
        let patients = loadFromStorage() || [];
        patients = patients.filter(p => p.id !== id);
        saveToStorage(patients);
        loadPatientList();
        showToast('Patient removed.');
    };

    // =========================
    // Scroll to Section
    // =========================
    window.scrollToSection = function(id) {
        const target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (id === 'patients') {
                target.style.display = 'block';
                showToast('Scrolled to Patient Tracker');
            }
        }
    };

    // =========================
    // Donation System
    // =========================
    let totalDonations = 0;
    window.makeDonation = function() {
        const amount = parseInt(document.getElementById("donationAmount").value);
        if (!amount || amount < 1000) {
            showToast("Minimum donation is 1000 RWF.");
            return;
        }
        totalDonations += amount;
        document.getElementById("donationStatus").innerText = `Total Donations: RWF ${totalDonations}`;
        const progress = Math.min((totalDonations / 1500000) * 100, 100); // Target 1.5M RWF
        document.getElementById("progressBar").style.width = `${progress}%`;
        if (progress >= 100) showToast("Donation goal achieved! Thank you!");
        document.getElementById("donationAmount").value = "";
        showToast("Donation successfully added!");
    };

    // =========================
    // Apply Form with Validation
    // =========================
    const applyForm = document.getElementById("applyForm");
    if (applyForm) {
        applyForm.addEventListener("submit", e => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const needs = document.getElementById("needs").value.trim();

            if (!name || !phone || !needs) {
                showToast("All fields are required.");
                return;
            }
            if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
                showToast("Please enter a valid phone number.");
                return;
            }

            const patient = { id: Date.now(), name, phone, needs, timestamp: new Date().toISOString() };
            let patients = loadFromStorage() || [];
            patients.push(patient);
            saveToStorage(patients);
            document.getElementById("applyStatus").innerText = "Application submitted!";
            applyForm.reset();
            showToast("Application sent successfully!");
            if (document.getElementById('patients').style.display !== 'none') loadPatientList();
        });
    }

    // =========================
    // Storage Functions
    // =========================
    function loadFromStorage() {
        try { return JSON.parse(localStorage.getItem('patients.v1') || '[]'); } catch (e) { return []; }
    }

    function saveToStorage(data) {
        localStorage.setItem('patients.v1', JSON.stringify(data));
    }

    // =========================
    // Admin Login
    // =========================
    window.adminLogin = function() {
        const password = document.getElementById("adminPassword").value;
        if (password === "admin123") {
            document.getElementById("adminPanel").style.display = "block";
            showToast("Admin logged in successfully.");
        } else {
            showToast("Incorrect password.");
        }
    };

    // =========================
    // Medication Reminder
    // =========================
    let reminders = [];
    window.setReminder = function() {
        const timeInput = document.getElementById("reminderTime").value;
        const medName = document.getElementById("medicationName").value;
        if (!timeInput || !medName) {
            showToast("Time and medication name are required.");
            return;
        }
        const [hours, minutes] = timeInput.split(":").map(Number);
        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        if (reminderTime <= now) reminderTime.setDate(reminderTime.getDate() + 1);

        const reminderId = Date.now();
        reminders.push({ id: reminderId, time: reminderTime, medName });
        setTimeout(() => {
            alert(`Time to take ${medName}!`);
            showToast(`Reminder: Take ${medName} now!`);
        }, reminderTime - now);

        document.getElementById("reminderStatus").innerText = `Reminder set for ${timeInput} - ${medName}`;
        document.getElementById("reminderTime").value = "";
        document.getElementById("medicationName").value = "";
    };

    // =========================
    // Schedule Chemotherapy
    // =========================
    const scheduleForm = document.getElementById("scheduleForm");
    if (scheduleForm) {
        scheduleForm.addEventListener("submit", e => {
            e.preventDefault();
            const patient = document.getElementById("patientName").value.trim();
            const date = document.getElementById("chemoDate").value;
            if (!patient || !date) {
                showToast("Patient name and date are required.");
                return;
            }
            const li = document.createElement("li");
            li.innerHTML = `${patient} - ${date} <button onclick="cancelAppointment(this, '${patient}', '${date}')">Cancel</button>`;
            document.getElementById("scheduleList").appendChild(li);
            scheduleForm.reset();
            showToast("Appointment scheduled!");
        });
    }

    window.cancelAppointment = function(button, patient, date) {
        if (confirm(`Cancel ${patient}'s appointment on ${date}?`)) {
            button.parentElement.remove();
            showToast("Appointment cancelled.");
        }
    };

    // =========================
    // Resource Viewer
    // =========================
    window.viewResource = function(category) {
        const resources = {
            "treatment": "Detailed guide on cancer treatments...",
            "support": "List of support groups and contacts...",
            "nutrition": "Nutritional advice for cancer patients..."
        };
        document.getElementById("resourceContent").innerText = resources[category] || "Resource not available.";
        showToast(`Viewing ${category} resources.`);
    };
});