let currentDetailId = null;

function viewRecipe(id) {
  currentDetailId = id;

  const r = getRecipes().find(x => x.id === id);
  if (!r) return;

  _renderHero(r);
  _renderCostStrip(r);
  _renderIngredientList(r);
  _renderInstructions(r);

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-detail').classList.add('active');
  window.scrollTo(0, 0);
}

function editCurrentRecipe() {
  openRecipeForm(currentDetailId);
}

function deleteCurrentRecipe() {
  if (!confirm('Delete this recipe?')) return;
  saveRecipes(getRecipes().filter(r => r.id !== currentDetailId));
  toast('Recipe deleted');
  showPage('home');
}

function _renderHero(r) {
  document.getElementById('detail-title').textContent = r.title;
  document.getElementById('detail-desc').textContent  = r.desc || '';
  document.getElementById('detail-badge').textContent =
    `${r.servings} serving${r.servings !== 1 ? 's' : ''}`;

  const photoEl = document.getElementById('detail-photo');
  photoEl.innerHTML = r.photo
    ? `<img src="${r.photo}" alt="${esc(r.title)}">`
    : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity=".3">
         <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
         <circle cx="12" cy="13" r="4"/>
       </svg>`;
}

function _renderCostStrip(r) {
  const total  = calcRecipeCost(r);
  const perSrv = total / Math.max(1, r.servings);

  document.getElementById('detail-cost-strip').innerHTML = `
    <div class="cost-cell">
      <div class="cost-val">₱${total.toFixed(2)}</div>
      <div class="cost-meta">Total Cost</div>
    </div>
    <div class="cost-cell">
      <div class="cost-val green">₱${perSrv.toFixed(2)}</div>
      <div class="cost-meta">Per Serving</div>
    </div>
    <div class="cost-cell">
      <div class="cost-val neutral">${r.ingredients.length}</div>
      <div class="cost-meta">Ingredients</div>
    </div>
    <div class="cost-cell">
      <div class="cost-val neutral" style="font-size:24px">${r.servings}</div>
      <div class="cost-meta">Servings</div>
    </div>`;
}

function _renderIngredientList(r) {
  const ingMap = Object.fromEntries(getIngredients().map(i => [i.id, i]));

  document.getElementById('detail-ing-list').innerHTML = r.ingredients
    .map(ri => {
      const ing  = ingMap[ri.ingId];
      const cost = ing ? calcIngCost(ing, ri.qty) : 0;
      return `
        <div class="ing-row">
          <span class="ing-name">${esc(ing ? ing.name : '?')}</span>
          <span class="ing-qty-cell">${ri.qty}</span>
          <span class="ing-unit-cell">${ri.unit}</span>
          <span class="ing-cost-cell">₱${cost.toFixed(2)}</span>
          <span></span>
        </div>`;
    })
    .join('');
}

function _renderInstructions(r) {
  const block = document.getElementById('detail-instr-block');
  if (r.instructions) {
    block.style.display = 'block';
    document.getElementById('detail-instructions').textContent = r.instructions;
  } else {
    block.style.display = 'none';
  }
}