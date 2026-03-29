let _formIngredients = [];  
let _editingRecipeId = null;
let _formPhotoData   = null; 

function openRecipeForm(id = null) {
  _editingRecipeId = id;
  _formIngredients = [];
  _formPhotoData   = null;

  document.getElementById('form-page-title').textContent = id ? 'Edit Recipe' : 'New Recipe';
  document.getElementById('form-name').value         = '';
  document.getElementById('form-desc').value         = '';
  document.getElementById('form-instructions').value = '';
  document.getElementById('form-servings').value     = 4;
  document.getElementById('photo-file').value        = '';
  _resetPhotoPicker();

  if (id) {
    const r = getRecipes().find(x => x.id === id);
    if (r) {
      document.getElementById('form-name').value         = r.title;
      document.getElementById('form-desc').value         = r.desc || '';
      document.getElementById('form-instructions').value = r.instructions || '';
      document.getElementById('form-servings').value     = r.servings;
      _formIngredients = r.ingredients.map(i => ({ ...i }));
      if (r.photo) {
        _formPhotoData = r.photo;
        _setPickerPhoto(r.photo);
      }
    }
  }

  _populateIngSelect();
  _renderFormIngList();
  _updateFormCost();

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-form').classList.add('active');
  window.scrollTo(0, 0);
}

// --- Photo handling --- //
function handlePhotoUpload(evt) {
  const file = evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    _formPhotoData = e.target.result;
    _setPickerPhoto(_formPhotoData);
  };
  reader.readAsDataURL(file);
}

function _setPickerPhoto(src) {
  const picker = document.getElementById('photo-picker');
  picker.querySelectorAll('img').forEach(img => img.remove());
  document.getElementById('photo-icon').style.display  = 'none';
  document.getElementById('photo-label').style.display = 'none';
  const img = document.createElement('img');
  img.src = src;
  picker.insertBefore(img, picker.querySelector('.photo-overlay'));
}

function _resetPhotoPicker() {
  const picker = document.getElementById('photo-picker');
  picker.querySelectorAll('img').forEach(img => img.remove());
  document.getElementById('photo-icon').style.display  = '';
  document.getElementById('photo-label').style.display = '';
}

// --- Ingredient picker --- //
function _populateIngSelect() {
  const ings = getIngredients().sort((a, b) => a.name.localeCompare(b.name));
  const sel  = document.getElementById('ing-select');
  sel.innerHTML =
    '<option value="">Select ingredient…</option>' +
    ings.map(i => `<option value="${i.id}">${esc(i.name)}</option>`).join('');
  updatePreview();
}

function updatePreview() {
  const id  = document.getElementById('ing-select').value;
  const qty = parseFloat(document.getElementById('ing-qty').value) || 0;
  const ing = getIngredients().find(i => i.id === id);
  const cost = ing ? calcIngCost(ing, qty) : 0;

  document.getElementById('preview-cost').textContent = `₱${cost.toFixed(2)}`;

  if (ing) {
    const unitSel = document.getElementById('ing-unit');
    const match   = [...unitSel.options].find(o => o.value === ing.unit);
    if (match) unitSel.value = ing.unit;
  }
}

function addIngRow() {
  const id  = document.getElementById('ing-select').value;
  const qty = parseFloat(document.getElementById('ing-qty').value);
  const unit = document.getElementById('ing-unit').value;

  if (!id)          { toast('Please select an ingredient'); return; }
  if (!qty || qty <= 0) { toast('Please enter a valid quantity'); return; }

  _formIngredients.push({ ingId: id, qty, unit });
  _renderFormIngList();
  _updateFormCost();
}

function removeIngRow(idx) {
  _formIngredients.splice(idx, 1);
  _renderFormIngList();
  _updateFormCost();
}

// --- Render helpers --- //
function _renderFormIngList() {
  const ingMap = Object.fromEntries(getIngredients().map(i => [i.id, i]));
  const el     = document.getElementById('form-ing-list');

  if (!_formIngredients.length) {
    el.innerHTML = '<div style="padding:16px 12px;color:var(--text-3);font-size:13px;text-align:center;">No ingredients added yet</div>';
    return;
  }

  el.innerHTML = _formIngredients
    .map((ri, i) => {
      const ing  = ingMap[ri.ingId];
      const cost = ing ? calcIngCost(ing, ri.qty) : 0;
      return `
        <div class="ing-row">
          <span class="ing-name">${esc(ing ? ing.name : '?')}</span>
          <span class="ing-qty-cell">${ri.qty}</span>
          <span class="ing-unit-cell">${ri.unit}</span>
          <span class="ing-cost-cell">₱${cost.toFixed(2)}</span>
          <button class="rm-btn" onclick="removeIngRow(${i})" title="Remove">×</button>
        </div>`;
    })
    .join('');
}

function updateFormCost() {
  _updateFormCost();
}

function _updateFormCost() {
  const ingMap = Object.fromEntries(getIngredients().map(i => [i.id, i]));
  const total  = _formIngredients.reduce(
    (s, ri) => s + calcIngCost(ingMap[ri.ingId], ri.qty),
    0
  );
  const srv = Math.max(1, parseInt(document.getElementById('form-servings').value) || 1);

  document.getElementById('form-total-cost').textContent  = `₱${total.toFixed(2)}`;
  document.getElementById('form-per-serving').textContent = `₱${(total / srv).toFixed(2)}`;
  document.getElementById('form-ing-count').textContent   = _formIngredients.length;
}

// --- Save --- //
function saveRecipe() {
  const name = document.getElementById('form-name').value.trim();
  if (!name) { toast('Recipe name is required'); return; }

  const recipe = {
    id:           _editingRecipeId || uid(),
    title:        name,
    desc:         document.getElementById('form-desc').value.trim(),
    instructions: document.getElementById('form-instructions').value.trim(),
    servings:     parseInt(document.getElementById('form-servings').value) || 1,
    photo:        _formPhotoData,
    ingredients:  _formIngredients,
  };

  const recipes = getRecipes();
  if (_editingRecipeId) {
    const idx = recipes.findIndex(r => r.id === _editingRecipeId);
    if (idx >= 0) recipes[idx] = recipe;
  } else {
    recipes.push(recipe);
  }

  saveRecipes(recipes);
  toast(_editingRecipeId ? 'Recipe updated!' : 'Recipe saved!');
  showPage('home');
}