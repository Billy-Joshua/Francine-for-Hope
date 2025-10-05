document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // Toast Notification (replaces alert for welcome)
    // =========================
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showToast("Welcome to the Francine for Hope Cancer Support Hub!");

    // =========================
    // Hero Typing Effect
    // =========================
    const heroText = "Building a Future of Hope Together";
    const heroElement = document.querySelector(".hero h2");
    let i = 0;
    function typeHeroText() {
        if (i < heroText.length) {
            heroElement.innerHTML += heroText.charAt(i);
            i++;
            setTimeout(typeHeroText, 100);
        }
    }
    if(heroElement) {
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
            if(sectionTop < triggerBottom){
                section.classList.add("show");
            } else {
                section.classList.remove("show");
            }
        });
    }
    window.addEventListener("scroll", checkFade);
    checkFade(); // trigger on load

    // =========================
    // Button Hover Scaling
    // =========================
    const buttons = document.querySelectorAll("button, input[type='submit'], a");
    buttons.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            btn.style.transform = "scale(1.05)";
            btn.style.transition = "transform 0.3s ease";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
        });
    });

    // =========================
    // Light Bulb Toggle (original)
    // =========================
    function light(state) {
        var image = document.getElementById('myImage');
        if (state == 1) {
            image.src = 'image/pic_bulbon.gif';
        } else {
            image.src = 'image/pic_bulboff.gif';
        }
    }
    window.light = light;

    // =========================
    // Hide Elements by Class (original)
    // =========================
    function myFunction() {
        var elements = document.getElementsByClassName('cancer');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }
    window.myFunction = myFunction;

    // =========================
    // Show Current Date (original)
    // =========================
    function showDate() {
        var demo = document.getElementById('demo');
        if(demo) {
            demo.innerHTML = Date();
        }
    }
    window.showDate = showDate;

    // =========================
    // Donation Functionality (enhanced with multiple tiers)
    // =========================
    let totalDonations = 0;
    window.makeDonation = function() {
        const amount = parseInt(document.getElementById("donationAmount").value);
        if (!amount || amount < 1000) {
            showToast("Please enter at least 1000 RWF.");
            return;
        }
        totalDonations += amount;
        document.getElementById("donationStatus").innerText = `Total donations: RWF ${totalDonations}`;
        let progress = Math.min((totalDonations / 1500000) * 100, 100); // Updated target to 1.5M RWF
        document.getElementById("progressBar").style.width = progress + "%";
        if (progress >= 100) {
            showToast("Donation goal reached! Thank you!");
        }
        document.getElementById("donationAmount").value = "";
    }

    // =========================
    // Apply Form (enhanced with validation)
    // =========================
    const applyForm = document.getElementById("applyForm");
    if(applyForm){
        applyForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const needs = document.getElementById("needs").value.trim();

            if (!name || !phone || !needs) {
                showToast("Please fill all fields.");
                return;
            }
            if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
                showToast("Please enter a valid phone number.");
                return;
            }

            const application = { name, phone, needs, timestamp: new Date().toISOString() };
            localStorage.setItem(phone, JSON.stringify(application));

            document.getElementById("applyStatus").innerText = "Application submitted successfully!";
            this.reset();
        });
    }

    // =========================
    // Patient Portal (enhanced with edit option)
    // =========================
    window.checkApplication = function() {
        const phone = document.getElementById("portalPhone").value;
        const data = localStorage.getItem(phone);
        if (data) {
            const app = JSON.parse(data);
            document.getElementById("portalResult").innerHTML = `
                <p><strong>Name:</strong> ${app.name}</p>
                <p><strong>Needs:</strong> ${app.needs}</p>
                <p><strong>Submitted:</strong> ${new Date(app.timestamp).toLocaleString()}</p>
                <button onclick="editApplication('${phone}')">Edit Application</button>
            `;
        } else {
            document.getElementById("portalResult").innerText = "No application found for this phone number.";
        }
    }

    window.editApplication = function(phone) {
        const data = JSON.parse(localStorage.getItem(phone));
        document.getElementById("name").value = data.name;
        document.getElementById("phone").value = data.phone;
        document.getElementById("needs").value = data.needs;
        localStorage.removeItem(phone);
        showToast("Edit your application and resubmit.");
    }

    // =========================
    // Admin Login (enhanced with logout)
    // =========================
    window.adminLogin = function() {
        const password = document.getElementById("adminPassword").value;
        if (password === "admin123") {
            document.getElementById("adminPanel").style.display = "block";
            showToast("Admin logged in.");
        } else {
            showToast("Wrong password!");
        }
    }

    window.adminLogout = function() {
        document.getElementById("adminPanel").style.display = "none";
        document.getElementById("adminPassword").value = "";
        showToast("Admin logged out.");
    }

    // =========================
    // Schedule Chemotherapy (enhanced with cancellation)
    // =========================
    const scheduleForm = document.getElementById("scheduleForm");
    if(scheduleForm){
        scheduleForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const patient = document.getElementById("patientName").value.trim();
            const date = document.getElementById("chemoDate").value;
            if (!patient || !date) {
                showToast("Please fill all fields.");
                return;
            }
            const li = document.createElement("li");
            li.innerHTML = `${patient} - Chemotherapy on ${date} <button onclick="cancelSchedule(this, '${patient}', '${date}')">Cancel</button>`;
            document.getElementById("scheduleList").appendChild(li);
            this.reset();
        });
    }

    window.cancelSchedule = function(button, patient, date) {
        if (confirm(`Cancel ${patient}'s chemotherapy on ${date}?`)) {
            button.parentElement.remove();
            showToast("Appointment cancelled.");
        }
    }

    // =========================
    // Toggle Patient Tracker Visibility (enhanced with patient list)
    // =========================
    window.toggleTracker = function() {
        const tracker = document.getElementById("patients");
        if (tracker.style.display === "none" || tracker.style.display === "") {
            tracker.style.display = "block";
            loadPatientList();
            showToast("Patient Tracker opened. Add or view details.");
        } else {
            tracker.style.display = "none";
            showToast("Patient Tracker closed.");
        }
    }

    function loadPatientList() {
        const patientList = document.getElementById("patientList");
        patientList.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const data = JSON.parse(localStorage.getItem(key));
            if (data.needs) {
                const li = document.createElement("li");
                li.innerText = `${data.name} - ${data.needs} (Phone: ${data.phone})`;
                patientList.appendChild(li);
            }
        }
    }

    // =========================
    // Medication Reminder System (enhanced with multiple reminders and snooze)
    // =========================
    let reminders = [];
    window.setReminder = function() {
        const timeInput = document.getElementById("reminderTime").value;
        const medName = document.getElementById("medicationName").value;
        const dosage = document.getElementById("dosage").value || "As prescribed";
        if (!timeInput || !medName)