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

function calcIngCost(ing, qty) {
  if (!ing || !ing.price || !ing.unitQty) return 0;
  return (qty / ing.unitQty) * ing.price;
}

function calcRecipeCost(recipe) {
  const ings = getIngredients();
  const map = Object.fromEntries(ings.map(i => [i.id, i]));
  return recipe.ingredients.reduce(
    (sum, ri) => sum + calcIngCost(map[ri.ingId], ri.qty),
    0
  );
}