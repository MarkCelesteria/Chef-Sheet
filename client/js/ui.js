let _toastTimer = null;

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

// --- Navigation --- //

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');

  const tabs = document.querySelectorAll('.nav-tab');
  if (name === 'home') {
    if (tabs[0]) tabs[0].classList.add('active');
    renderCards();
  } else if (name === 'ingredients') {
    if (tabs[1]) tabs[1].classList.add('active');
    renderIngTable();
  }

  window.scrollTo(0, 0);
}