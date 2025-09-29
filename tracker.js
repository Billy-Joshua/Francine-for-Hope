// script.js - Updated with toggle for Patient Tracker and new Medication Reminder system
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
    const heroText = "Building a Future of Hope";
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
    // Donation Functionality (existing)
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
        let progress = Math.min((totalDonations / 1000000) * 100, 100); // target 1M RWF
        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("donationAmount").value = "";
    }

    // =========================
    // Apply Form (existing)
    // =========================
    const applyForm = document.getElementById("applyForm");
    if(applyForm){
        applyForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const needs = document.getElementById("needs").value;

            const application = { name, phone, needs };
            localStorage.setItem(phone, JSON.stringify(application));

            document.getElementById("applyStatus").innerText = "Application submitted successfully!";
            this.reset();
        });
    }

    // =========================
    // Patient Portal (existing)
    // =========================
    window.checkApplication = function() {
        const phone = document.getElementById("portalPhone").value;
        const data = localStorage.getItem(phone);
        if (data) {
            const app = JSON.parse(data);
            document.getElementById("portalResult").innerHTML = `
              <p><strong>Name:</strong> ${app.name}</p>
              <p><strong>Needs:</strong> ${app.needs}</p>
            `;
        } else {
            document.getElementById("portalResult").innerText = "No application found for this phone number.";
        }
    }

    // =========================
    // Admin Login (existing)
    // =========================
    window.adminLogin = function() {
        const password = document.getElementById("adminPassword").value;
        if (password === "admin123") {
            document.getElementById("adminPanel").style.display = "block";
        } else {
            showToast("Wrong password!");
        }
    }

    // =========================
    // Schedule Chemotherapy (existing)
    // =========================
    const scheduleForm = document.getElementById("scheduleForm");
    if(scheduleForm){
        scheduleForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const patient = document.getElementById("patientName").value;
            const date = document.getElementById("chemoDate").value;
            const li = document.createElement("li");
            li.innerText = `${patient} - Chemotherapy on ${date}`;
            document.getElementById("scheduleList").appendChild(li);
            this.reset();
        });
    }

    // =========================
    // New: Toggle Patient Tracker Visibility (via button in Patient Portal)
    // =========================
    window.toggleTracker = function() {
        const tracker = document.getElementById("patients");
        if (tracker.style.display === "none" || tracker.style.display === "") {
            tracker.style.display = "block";
            showToast("Patient Tracker opened. Add your details if needed.");
        } else {
            tracker.style.display = "none";
            showToast("Patient Tracker closed.");
        }
    }

    // =========================
    // New: Medication Reminder System (simple client-side timer with alert)
    // =========================
    let reminderInterval;
    window.setReminder = function() {
        const timeInput = document.getElementById("reminderTime").value;
        const medName = document.getElementById("medicationName").value;
        if (!timeInput || !medName) {
            showToast("Please enter time and medication name.");
            return;
        }

        const [hours, minutes] = timeInput.split(":").map(Number);
        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        if (reminderTime < now) {
            reminderTime.setDate(reminderTime.getDate() + 1); // Set for next day if time passed
        }

        const timeDiff = reminderTime - now;

        setTimeout(() => {
            alert(`Time to take your medication: ${medName}`);
            showToast(`Reminder: Take ${medName} now!`);
        }, timeDiff);

        document.getElementById("reminderStatus").innerText = `Reminder set for ${timeInput} - ${medName}`;
        document.getElementById("reminderTime").value = "";
        document.getElementById("medicationName").value = "";
    }

});