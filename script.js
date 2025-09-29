// tracker.js - No major changes needed, but added a note for completeness. Your original code is fine; I've just cleaned up minor formatting.
const patients = loadFromStorage() || [];

const form = document.getElementById('patientForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const diagnosisInput = document.getElementById('diagnosis');
const stageInput = document.getElementById('stage');
const riskInput = document.getElementById('risk');
const notesInput = document.getElementById('notes');
const listEl = document.getElementById('patientList');
const statsEl = document.getElementById('stats');

const searchName = document.getElementById('searchName');
const filterRisk = document.getElementById('filterRisk');
const sortBy = document.getElementById('sortBy');
const seedBtn = document.getElementById('seed');
const clearAllBtn = document.getElementById('clearAll');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importJSON = document.getElementById('importJSON');

render();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addPatientFromForm();
});
searchName.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
filterRisk.addEventListener('change', render);
sortBy.addEventListener('change', render);
seedBtn.addEventListener('click', seedSamples);
clearAllBtn.addEventListener('click', () => {
  if (confirm('Clear all patient data?')) {
    patients.length = 0;
    saveToStorage();
    render();
  }
});

exportBtn.addEventListener('click', () => {
  const data = JSON.stringify(patients, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'patients.json';
  a.click(); URL.revokeObjectURL(url);
});
importBtn.addEventListener('click', () => importJSON.click());
importJSON.addEventListener('change', (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const json = JSON.parse(evt.target.result);
      if (Array.isArray(json)) {
        patients.length = 0;
        json.forEach(p => patients.push(p));
        saveToStorage(); render();
        alert('Imported ' + patients.length + ' records');
      } else alert('JSON must be an array');
    } catch { alert('Invalid JSON'); }
  };
  reader.readAsText(file);
});

function addPatientFromForm() {
  const p = {
    id: Date.now(),
    name: nameInput.value.trim(),
    age: Number(ageInput.value) || 0,
    diagnosis: diagnosisInput.value,
    stage: stageInput.value,
    risk: riskInput.value,
    notes: notesInput.value.trim(),
    addedAt: new Date().toISOString()
  };
  patients.push(p);
  saveToStorage(); form.reset(); render();
}

function render() {
  let view = patients.slice();

  const q = searchName.value.trim().toLowerCase();
  if (q) view = view.filter(px => px.name.toLowerCase().includes(q));

  const r = filterRisk.value;
  if (r) view = view.filter(px => px.risk === r);

  const s = sortBy.value;
  if (s === 'ageAsc') view.sort((a, b) => a.age - b.age);
  else if (s === 'ageDesc') view.sort((a, b) => b.age - a.age);
  else if (s === 'nameAsc') view.sort((a, b) => a.name.localeCompare(b.name));
  else if (s === 'nameDesc') view.sort((a, b) => b.name.localeCompare(a.name));

  listEl.innerHTML = '';
  if (view.length === 0) listEl.innerHTML = '<div class="small">No records</div>';

  view.forEach(p => {
    const div = document.createElement('div');
    div.className = 'patient';
    div.innerHTML = `
      <div>
        <strong>${escapeHtml(p.name)}</strong> <span class="small">(${p.age} yrs) - ${p.diagnosis} - Stage ${p.stage}</span>
        <div class="small">Risk: ${p.risk} • Added: ${new Date(p.addedAt).toLocaleString()}</div>
        <div class="small">${escapeHtml(p.notes || '')}</div>
      </div>
      <div class="controls">
        <button class="btn" onclick="edit(${p.id})">Edit</button>
        <button class="btn" onclick="removePatient(${p.id})">Delete</button>
      </div>`;
    listEl.appendChild(div);
  });

  renderStats(view);
}

function renderStats() {
  if (patients.length === 0) { statsEl.innerHTML = 'No data yet'; return; }
  const ages = patients.map(p => p.age);
  const total = ages.reduce((sum, a) => sum + a, 0);
  const avg = (total / (ages.length || 1)).toFixed(1);
  const byDiag = {};
  patients.forEach(p => { byDiag[p.diagnosis] = (byDiag[p.diagnosis] || 0) + 1; });
  statsEl.innerHTML = `Total records: ${patients.length} · Average age: ${avg} yrs<br>Counts: ${Object.entries(byDiag).map(e => e.join(': ')).join(' | ')}`;
}

function removePatient(id) {
  const idx = patients.findIndex(p => p.id === id);
  if (idx === -1) return;
  if (!confirm('Delete record for ' + patients[idx].name + '?')) return;
  patients.splice(idx, 1);
  saveToStorage(); render();
}
function edit(id) {
  const p = patients.find(x => x.id === id);
  if (!p) return alert('Not found');
  nameInput.value = p.name;
  ageInput.value = p.age;
  diagnosisInput.value = p.diagnosis;
  stageInput.value = p.stage;
  riskInput.value = p.risk;
  notesInput.value = p.notes;
  const idx = patients.findIndex(x => x.id === id);
  if (idx !== -1) patients.splice(idx, 1);
  saveToStorage(); render();
}
function saveToStorage() {
  try { localStorage.setItem('patients.v1', JSON.stringify(patients)); }
  catch (e) { console.warn('Storage failed', e); }
}
function loadFromStorage() {
  try { return JSON.parse(localStorage.getItem('patients.v1') || 'null'); }
  catch { return null; }
}
function seedSamples() {
  const sample = [
    { id: 1, name: 'Alice Mwiza', age: 49, diagnosis: 'Breast', stage: 'II', risk: 'Moderate', notes: 'Family history', addedAt: new Date().toISOString() },
    { id: 2, name: 'Jean Pierre', age: 62, diagnosis: 'Prostate', stage: 'III', risk: 'High', notes: 'Smoker', addedAt: new Date().toISOString() },
    { id: 3, name: 'Fatima U.', age: 35, diagnosis: 'Leukemia', stage: 'I', risk: 'Low', notes: 'Regular follow-up', addedAt: new Date().toISOString() }
  ];
  sample.forEach(s => patients.push(s));
  saveToStorage(); render();
}
function escapeHtml(s) {
  return String(s).replace(/[&<>\"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
window.removePatient = removePatient;
window.edit = edit;
saveToStorage();
render();