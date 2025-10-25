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


// Resource Search
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
// Parallax background effect for hero section
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
  }
});
// Scroll to Top Button
const scrollBtn = document.createElement("button");
scrollBtn.textContent = "↑ Top";
scrollBtn.className = "scroll-top";
document.body.appendChild(scrollBtn);

scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

// Motivation Messages
const messages = [
  "Every small donation changes a life ❤️",
  "Early detection saves lives 🌸",
  "You are part of the cure 💪",
  "Hope is stronger than fear 💖"
];
setInterval(() => {
  showToast(messages[Math.floor(Math.random() * messages.length)]);
}, 20000);
// Live Date & Time
setInterval(() => {
  const now = new Date();
  const timeElement = document.getElementById("liveTime");
  if (timeElement) {
    timeElement.textContent = now.toLocaleString('en-US', { timeStyle: 'short', dateStyle: 'medium' });
  }
}, 1000);
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";

  // Limit message length to 50 chars
  if (message.length > 50) {
    message = message.slice(0, 50) + '…';
  }

  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
