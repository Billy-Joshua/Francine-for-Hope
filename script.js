window.onload = function() {
  alert("Welcome to the Francine for Hope Cancer Support Hub!");
};

// Donation
let totalDonations = 0;
function makeDonation() {
  const amount = parseInt(document.getElementById("donationAmount").value);
  if (!amount || amount < 1000) {
    alert("Please enter at least 1000 RWF.");
    return;
  }
  totalDonations += amount;
  document.getElementById("donationStatus").innerText = `Total donations: RWF ${totalDonations}`;
  let progress = Math.min((totalDonations / 1000000) * 100, 100); // target 1M RWF
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("donationAmount").value = "";
}

// Apply
document.getElementById("applyForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const needs = document.getElementById("needs").value;

  const application = { name, phone, needs };
  localStorage.setItem(phone, JSON.stringify(application));

  document.getElementById("applyStatus").innerText = "Application submitted successfully!";
  this.reset();
});

// Patient Portal
function checkApplication() {
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

// Admin
function adminLogin() {
  const password = document.getElementById("adminPassword").value;
  if (password === "admin123") {
    document.getElementById("adminPanel").style.display = "block";
  } else {
    alert("Wrong password!");
  }
}

document.getElementById("scheduleForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const patient = document.getElementById("patientName").value;
  const date = document.getElementById("chemoDate").value;
  const li = document.createElement("li");
  li.innerText = `${patient} - Chemotherapy on ${date}`;
  document.getElementById("scheduleList").appendChild(li);
  this.reset();
});
