const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function render(notes) {
  document.getElementById('notes').innerHTML = notes.map(n => `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div><div style="white-space:pre-wrap">${esc(n.data)}</div>
      <small class="text-muted">${esc(n.date)}</small></div>
      <button type="button" class="close" onclick="deleteNote(${n.id})">&times;</button>
    </li>`).join('');
}

function loadNotes() {
  fetch('/get-notes').then(r => r.json()).then(render);
}

function deleteNote(noteId) {
  fetch('/delete-note', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({noteId})
  }).then(loadNotes);
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('save-note');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const box = document.getElementById('note');
    const err = document.getElementById('note-error');
    err.textContent = '';
    fetch('/add-note', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({note: box.value})
    }).then(async r => {
      if (!r.ok) { err.textContent = (await r.json()).error; return; }
      box.value = '';
      loadNotes();
    });
  });
  loadNotes();
});
