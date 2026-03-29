function renderCards() {
  const search  = (document.getElementById('search-input')?.value || '').toLowerCase();
  const all     = getRecipes();
  const recipes = all.filter(r => r.title.toLowerCase().includes(search));
  const list    = document.getElementById('cards-list');

  _renderStats(all);

  if (!recipes.length) {
    list.innerHTML = _emptyState(search);
    return;
  }

  list.innerHTML = recipes
    .map((r, i) => _recipeCardHTML(r, i))
    .join('');
}

// --- Private helpers --- //

function _renderStats(all) {
  const costs = all.map(r => calcRecipeCost(r));
  const avg   = costs.length ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;
  const min   = costs.length ? Math.min(...costs) : null;

  document.getElementById('stat-row').innerHTML = `
    <div class="stat-pill">
      <div class="stat-pill-val">${all.length}</div>
      <div class="stat-pill-label">Recipes</div>
    </div>
    <div class="stat-pill">
      <div class="stat-pill-val">${getIngredients().length}</div>
      <div class="stat-pill-label">Ingredients</div>
    </div>
    <div class="stat-pill">
      <div class="stat-pill-val" style="color:var(--green)">₱${avg.toFixed(2)}</div>
      <div class="stat-pill-label">Avg Cost</div>
    </div>
    <div class="stat-pill">
      <div class="stat-pill-val" style="color:var(--green);font-size:18px">
        ${min !== null ? '₱' + min.toFixed(2) : '—'}
      </div>
      <div class="stat-pill-label">Cheapest</div>
    </div>
  `;
}

function _emptyState(search) {
  return `
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <h3>${search ? 'No results found' : 'No recipes yet'}</h3>
      <p>${search ? 'Try a different search term.' : 'Click "+ Add Recipe" to create your first recipe!'}</p>
    </div>`;
}

function _recipeCardHTML(r, index) {
  const cost      = calcRecipeCost(r);
  const photoHTML = r.photo
    ? `<img src="${r.photo}" alt="${esc(r.title)}" loading="lazy">`
    : `<div class="card-photo-placeholder">
         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
           <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
           <circle cx="12" cy="13" r="4"/>
         </svg>
         <span>No Photo</span>
       </div>`;

  return `
    <div class="recipe-card" style="animation-delay:${index * 40}ms">
      <div class="card-photo">${photoHTML}</div>
      <div class="card-body">
        <div class="card-title">${esc(r.title)}</div>
        <div class="card-desc">${esc(r.desc || 'No description provided.')}</div>
        <div class="card-footer">
          <button class="btn btn-primary btn-sm btn-pill" onclick="viewRecipe('${r.id}')">View Recipe →</button>
          <span class="card-cost">₱${cost.toFixed(2)}</span>
          <span class="card-servings">${r.servings} serving${r.servings !== 1 ? 's' : ''}</span>
          <div class="card-actions">
            <button class="btn btn-secondary btn-sm" onclick="openRecipeForm('${r.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRecipe('${r.id}')">✕</button>
          </div>
        </div>
      </div>
    </div>`;
}

function deleteRecipe(id) {
  if (!confirm('Delete this recipe?')) return;
  saveRecipes(getRecipes().filter(r => r.id !== id));
  toast('Recipe deleted');
  renderCards();
}