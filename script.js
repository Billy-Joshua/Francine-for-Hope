// script.js - Main JavaScript for Francine for Hope website

// Toast Notification Function
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Document Ready Event Listener
document.addEventListener("DOMContentLoaded", () => {
  showToast("Welcome to Francine for Hope – Let's Fight Cancer Together!");

  // Hero Typing Effect
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
  if (heroElement) {
    heroElement.innerHTML = "";
    typeHeroText();
  }

  // Fade-in Sections on Scroll
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

  // Smooth Scroll Function
  window.scrollToSection = function(id) {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile Menu Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.querySelector(".navbar ul");
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  // AI Screening Tool Logic
  const aiForm = document.getElementById("aiForm");
  if (aiForm) {
    aiForm.addEventListener("submit", e => {
      e.preventDefault();
      const symptoms = document.getElementById("symptoms").value.toLowerCase().trim();
      const resultDiv = document.getElementById("aiResult");
      resultDiv.innerHTML = '';

      let advice = "No specific matches found. Advice: Consult a doctor for any concerns.";
      // Simple rule-based "AI" detection (based on common symptoms from Wikipedia)
      if (symptoms.includes("lump") || symptoms.includes("swelling")) {
        advice = "Possible breast cancer risk (lumps/swelling). Advice: Get a mammogram; early detection is key.";
      } else if (symptoms.includes("cough") || symptoms.includes("breathlessness")) {
        advice = "Possible lung cancer risk (persistent cough/breath issues). Advice: Quit smoking, see a doctor for CT scan.";
      } else if (symptoms.includes("fatigue") || symptoms.includes("weight loss")) {
        advice = "General cancer indicator (unexplained fatigue/weight loss). Advice: Blood tests recommended; maintain healthy diet.";
      } else if (symptoms.includes("pain") || symptoms.includes("bleeding")) {
        advice = "Possible colon/liver cancer (abdominal pain/bleeding). Advice: Colonoscopy or liver scan; avoid alcohol.";
      } else if (symptoms.includes("skin change") || symptoms.includes("mole")) {
        advice = "Possible skin cancer (skin changes/moles). Advice: Use sunscreen, dermatologist visit.";
      } else if (symptoms.includes("urination issues") || symptoms.includes("blood in urine")) {
        advice = "Possible prostate cancer (urination problems). Advice: PSA test; regular checkups for men over 50.";
      } else if (symptoms.includes("jaundice") || symptoms.includes("abdominal pain")) {
        advice = "Possible liver cancer (jaundice/pain). Advice: Hepatitis vaccination; liver function tests.";
      }

      resultDiv.innerHTML = `<p>${advice}</p><p>Note: This is not medical advice. See a professional.</p>`;
      showToast("AI advice generated!");
      aiForm.reset();
    });
  }

  // Donation Function

  let totalDonations = 0;
  window.makeDonation = function() {
    const amount = parseInt(document.getElementById("donationAmount").value);
    if (!amount || amount < 1000) return showToast("Minimum 1000 RWF");
    totalDonations += amount;
    document.getElementById("donationStatus").innerText = `Total: RWF ${totalDonations}`;
    const progress = Math.min((totalDonations / 1000000) * 100, 100);
    document.getElementById("progressBar").style.width = `${progress}%`;
    document.getElementById("donationAmount").value = "";
    showToast("Donation added!");
  };

  // Apply Form Submission
  const applyForm = document.getElementById("applyForm");
  if (applyForm) {
    applyForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const needs = document.getElementById("needs").value.trim();
      if (!name || !phone || !needs) return showToast("All fields required");
      // Placeholder for storage or API
      document.getElementById("applyStatus").innerText = "Application submitted!";
      applyForm.reset();
      showToast("Application sent!");
    });
  }

  // Patient Portal Check

  window.checkApplication = function() {
    const phone = document.getElementById("portalPhone").value.trim();
    // Placeholder for retrieval
    document.getElementById("portalResult").innerHTML = `<p>Application for ${phone}: Details here.</p>`;
    showToast("Application checked!");
  };

  // Admin Login
  window.adminLogin = function() {
    const password = document.getElementById("adminPassword").value;
    if (password === "admin123") {
      document.getElementById("adminPanel").style.display = "block";
      showToast("Logged in!");
    } else {
      showToast("Wrong password");
    }
  };

  // Chemo Schedule

  const scheduleForm = document.getElementById("scheduleForm");
  if (scheduleForm) {
    scheduleForm.addEventListener("submit", e => {
      e.preventDefault();
      const patient = document.getElementById("patientName").value;
      const date = document.getElementById("chemoDate").value;
      const li = document.createElement("li");
      li.textContent = `${patient} - ${date}`;
      document.getElementById("scheduleList").appendChild(li);
      scheduleForm.reset();
      showToast("Schedule added!");
    });
  }

  // Patient Tracker Toggle

  window.toggleTracker = function() {
    const tracker = document.getElementById("patients");
    tracker.style.display = tracker.style.display === "none" ? "block" : "none";
    showToast(tracker.style.display === "block" ? "Tracker opened" : "Tracker closed");
  };

  // Medication Reminder
  window.setReminder = function() {
    const time = document.getElementById("reminderTime").value;
    const name = document.getElementById("medicationName").value;
    if (!time || !name) return showToast("Fields required");
    document.getElementById("reminderStatus").textContent = `Reminder set for ${time} - ${name}`;
    // Placeholder timer
    showToast("Reminder set!");
  };



  const searchInput = document.getElementById("resourceSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".resource-card");
      cards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
      });
    });
  }
});
// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});
// ===== Admin Login Function =====
function adminLogin() {
    const passwordInput = document.getElementById("adminPassword").value;
    const adminPanel = document.getElementById("adminPanel");
    
    // Replace 'securePassword123' with your real secure password
    const correctPassword = "MyHospital123";

    if (passwordInput === correctPassword) {
        alert("Login successful! Welcome.");
        adminPanel.style.display = "block";
    } else {
        alert("Incorrect password. Try again.");
        adminPanel.style.display = "none";
    }

    // Clear password field
    document.getElementById("adminPassword").value = "";
}

// ===== Schedule Form Functionality =====
document.getElementById("scheduleForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent form submission reload

    const patientName = document.getElementById("patientName").value.trim();
    const chemoDate = document.getElementById("chemoDate").value;

    if (patientName === "" || chemoDate === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Create a new list item for the schedule
    const scheduleList = document.getElementById("scheduleList");
    const li = document.createElement("li");
    li.className = "schedule-item";
    li.innerHTML = `
        <strong>Patient:</strong> ${patientName} <br>
        <strong>Date:</strong> ${chemoDate} 
        <button class="delete-btn">Delete</button>
    `;

    // Add delete functionality
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });

    scheduleList.appendChild(li);

    // Clear form
    document.getElementById("scheduleForm").reset();
});

// ===== Resource Search Functionality =====
// --------- Toast Notification ---------
function showToast(msg, duration = 3000, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

// --------- Patient Tracker Toggle ---------
function toggleTracker() {
    const tracker = document.getElementById("patients");
    tracker.style.display = tracker.style.display === "block" ? "none" : "block";
    showToast(tracker.style.display === "block" ? "Tracker Opened" : "Tracker Closed", 2000, "success");
}

// --------- Check Application ---------
function checkApplication() {
    const phone = document.getElementById("portalPhone").value.trim();
    if (!phone) return showToast("Enter phone number!", 2000, "error");
    document.getElementById("portalResult").innerHTML = `<p>Application for ${phone}: Sample details here.</p>`;
    showToast("Application checked!", 2000, "success");
}

// --------- Medication Reminder ---------
function setReminder() {
    const time = document.getElementById("reminderTime").value;
    const name = document.getElementById("medicationName").value.trim();
    if (!time || !name) return showToast("Fill all fields!", 2000, "error");
    document.getElementById("reminderStatus").textContent = `Reminder set: ${time} - ${name}`;
    showToast("Reminder set!", 2000, "success");
}

// --------- Patient Tracker Logic ---------
let patients = [];

function renderPatients(list) {
    const container = document.getElementById("patientList");
    container.innerHTML = "";
    list.forEach((p, index) => {
        const div = document.createElement("div");
        div.className = "patient-card";
        div.innerHTML = `
            <p><strong>Name:</strong> ${p.name}</p>
            <p><strong>Age:</strong> ${p.age}</p>
            <p><strong>Diagnosis:</strong> ${p.diagnosis}</p>
            <p><strong>Stage:</strong> ${p.stage}</p>
            <p><strong>Risk:</strong> ${p.risk}</p>
            <p><strong>Notes:</strong> ${p.notes}</p>
            <button onclick="deletePatient(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

// Add patient
document.getElementById("patientForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const stage = document.getElementById("stage").value.trim();
    const risk = document.getElementById("risk").value;
    const notes = document.getElementById("notes").value.trim();

    if(!name) return showToast("Patient name required", 2000, "error");

    patients.push({name, age, diagnosis, stage, risk, notes});
    renderPatients(patients);
    e.target.reset();
    showToast("Patient added!", 2000, "success");
});

// Delete patient
function deletePatient(index) {
    patients.splice(index,1);
    renderPatients(patients);
    showToast("Patient deleted", 2000, "success");
}

// Filter/Search/Sort
document.getElementById("searchName")?.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    renderPatients(patients.filter(p => p.name.toLowerCase().includes(query)));
});

document.getElementById("filterRisk")?.addEventListener("change", e => {
    const value = e.target.value;
    renderPatients(value ? patients.filter(p => p.risk===value) : patients);
});

document.getElementById("sortBy")?.addEventListener("change", e => {
    const val = e.target.value;
    let sorted = [...patients];
    if(val==="ageAsc") sorted.sort((a,b)=>a.age-b.age);
    else if(val==="ageDesc") sorted.sort((a,b)=>b.age-a.age);
    else if(val==="nameAsc") sorted.sort((a,b)=>a.name.localeCompare(b.name));
    else if(val==="nameDesc") sorted.sort((a,b)=>b.name.localeCompare(a.name));
    renderPatients(sorted);
});

// Seed sample patients
document.getElementById("seed")?.addEventListener("click", ()=>{
    patients = [
        {name:"Alice", age:34, diagnosis:"Breast Cancer", stage:"2", risk:"Moderate", notes:"Undergoing chemo"},
        {name:"Bob", age:45, diagnosis:"Lung Cancer", stage:"3", risk:"High", notes:"Needs oxygen"},
        {name:"Celine", age:28, diagnosis:"Skin Cancer", stage:"1", risk:"Low", notes:"Under observation"}
    ];
    renderPatients(patients);
    showToast("Sample patients loaded!", 2000, "success");
});

// Clear all patients
document.getElementById("clearAll")?.addEventListener("click", ()=>{
    patients = [];
    renderPatients(patients);
    showToast("All patients cleared!", 2000, "success");
});

// Export JSON
document.getElementById("exportBtn")?.addEventListener("click", ()=>{
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patients));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download","patients.json");
    dlAnchor.click();
    showToast("Exported patients!",2000,"success");
});

// Import JSON
document.getElementById("importBtn")?.addEventListener("click", ()=>{
    document.getElementById("importJSON").click();
});

document.getElementById("importJSON")?.addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (event)=>{
        patients = JSON.parse(event.target.result);
        renderPatients(patients);
        showToast("Patients imported!",2000,"success");
    };
    reader.readAsText(file);
});




 