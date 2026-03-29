document.addEventListener('DOMContentLoaded', () => {

  seedIfEmpty();
  initPhotoPicker();

  document.getElementById('ing-modal').addEventListener('click', function (e) {
    if (e.target === this) closeIngModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeIngModal();
  });

  renderCards();

});