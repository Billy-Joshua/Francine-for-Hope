// Enhanced JS: smooth scroll for nav, fixed tracker click
document.addEventListener("DOMContentLoaded", () => {
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  showToast("Welcome to Francine for Hope – Let's Fight Cancer Together!");

  // Typing effect
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

  // Fade-in on scroll
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

  // Smooth scroll for all nav links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (targetId === 'patients') {
        target.style.display = 'block'; // Show if hidden
        showToast("Patient Tracker opened");
      }
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Toggle Tracker button
  window.toggleTracker = function() {
    const tracker = document.getElementById('patients');
    tracker.style.display = tracker.style.display === 'none' ? 'block' : 'none';
    showToast(tracker.style.display === 'block' ? 'Tracker shown' : 'Tracker hidden');
  };

  // Scroll to section function for Get Involved
  window.scrollToSection = function(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  // Donation
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

  // Apply Form
  const applyForm = document.getElementById("applyForm");
  if (applyForm) {
    applyForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const needs = document.getElementById("needs").value;
      localStorage.setItem(phone, JSON.stringify({ name, phone, needs }));
      document.getElementById("applyStatus").innerText = "Submitted!";
      applyForm.reset();
      showToast("Application sent!");
    });
  }

  // Other functions remain similar...
  // (Admin login, schedule, reminder, patient tracker logic as before - no changes needed)
  // Patient Tracker code here (same as previous)
  const patients = loadFromStorage() || [];
  // ... (rest of patient tracker JS unchanged)

  function loadFromStorage() {
    try { return JSON.parse(localStorage.getItem('patients.v1') || 'null'); } catch { return null; }
  }
  // Add other functions like addPatientFromForm, render, etc., from previous script
});