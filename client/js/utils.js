function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const UNIT_TO_BASE = {
  g:      1,
  kg:     1000,
  ml:     1,
  liter:  1000,
  tbsp:   15,
  tsp:    5,
  cup:    240,
  piece:  1,
};

const PRICE_TYPE_UNIT = {
  per_piece: 'piece',
  per_kg:    'kg',
  per_liter: 'liter',
  per_pack:  'piece',
  per_100g:  'g',
};

const PRICE_TYPE_MULTIPLIER = {
  per_piece: 1,
  per_kg:    1000, 
  per_liter: 1000, 
  per_pack:  1,
  per_100g:  100, 
};

function calcIngCost(ing, qty, recipeUnit) {
  if (!ing || !ing.price || !ing.unitQty) return 0;

  const recipeMultiplier = UNIT_TO_BASE[recipeUnit] ?? 1;
  const recipeQtyInBase  = qty * recipeMultiplier;
  const priceMultiplier  = PRICE_TYPE_MULTIPLIER[ing.priceType] ?? 1;
  const unitQtyInBase    = ing.unitQty * priceMultiplier;

  if (unitQtyInBase === 0) return 0;
  return (recipeQtyInBase / unitQtyInBase) * ing.price;
}

function calcRecipeCost(recipe) {
  const ings = getIngredients();
  const map  = Object.fromEntries(ings.map(i => [i.id, i]));
  return recipe.ingredients.reduce(
    (sum, ri) => sum + calcIngCost(map[ri.ingId], ri.qty, ri.unit),
    0
  );
}