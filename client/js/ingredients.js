function unitFromPriceType(priceType) {
  const map = {
    per_kg:    'g',
    per_liter: 'ml',
    per_piece: 'piece',
    per_pack:  'piece',
    per_100g:  'g',
  };
  return map[priceType] || 'g';
}

function renderIngTable() {
  const ings = getIngredients().sort((a, b) => a.name.localeCompare(b.name));
  const wrap = document.getElementById('ing-table-wrap');

  if (!ings.length) {
    wrap.innerHTML = `
      <div class="empty-state">
        <h3>No ingredients yet</h3>
        <p>Add your first ingredient above.</p>
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Priced Per</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${ings.map(_ingRowHTML).join('')}
      </tbody>
    </table>`;
}

function _ingRowHTML(ing) {
  const unitLabel = _priceTypeLabel(ing.priceType);
  return `
    <tr>
      <td><strong>${esc(ing.name)}</strong></td>
      <td class="price-cell">₱${ing.price}</td>
      <td>${unitLabel}</td>
      <td>${ing.unitQty}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-secondary btn-sm" onclick="openIngModal('${ing.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteIngredient('${ing.id}')">Delete</button>
        </div>
      </td>
    </tr>`;
}

function _priceTypeLabel(priceType) {
  const labels = {
    per_piece: 'per piece',
    per_kg:    'per kg',
    per_liter: 'per liter',
    per_pack:  'per pack',
    per_100g:  'per 100g',
  };
  return labels[priceType] || priceType;
}

function openIngModal(id = null) {
  document.getElementById('ing-modal-id').value          = id || '';
  document.getElementById('ing-modal-title').textContent = id ? 'Edit Ingredient' : 'Add Ingredient';
  document.getElementById('ing-modal-name').value        = '';
  document.getElementById('ing-modal-price').value       = '';
  document.getElementById('ing-modal-qty').value         = '';

  if (id) {
    const ing = getIngredients().find(i => i.id === id);
    if (ing) {
      document.getElementById('ing-modal-name').value      = ing.name;
      document.getElementById('ing-modal-price').value     = ing.price;
      document.getElementById('ing-modal-pricetype').value = ing.priceType;
      document.getElementById('ing-modal-qty').value       = ing.unitQty;
    }
  }

  document.getElementById('ing-modal').classList.add('open');
  document.getElementById('ing-modal-name').focus();
}

function closeIngModal() {
  document.getElementById('ing-modal').classList.remove('open');
}

function saveIngredient() {
  const name  = document.getElementById('ing-modal-name').value.trim();
  const price = parseFloat(document.getElementById('ing-modal-price').value);
  const qty   = parseFloat(document.getElementById('ing-modal-qty').value);
  const priceType = document.getElementById('ing-modal-pricetype').value;

  if (!name)            { toast('Name is required'); return; }
  if (!price || price <= 0) { toast('Please enter a valid price'); return; }
  if (!qty   || qty   <= 0) { toast('Please enter a valid quantity'); return; }

  const id  = document.getElementById('ing-modal-id').value;
  const ing = {
    id:        id || uid(),
    name,
    unit:      unitFromPriceType(priceType),
    price,
    priceType,
    unitQty:   qty,
  };

  const ings = getIngredients();
  if (id) {
    const idx = ings.findIndex(i => i.id === id);
    if (idx >= 0) ings[idx] = ing;
  } else {
    ings.push(ing);
  }

  saveIngredients(ings);
  closeIngModal();
  renderIngTable();
  toast(id ? 'Ingredient updated!' : 'Ingredient added!');
}

function deleteIngredient(id) {
  if (!confirm('Delete this ingredient? It may affect existing recipes.')) return;
  saveIngredients(getIngredients().filter(i => i.id !== id));
  renderIngTable();
  toast('Ingredient deleted');
}