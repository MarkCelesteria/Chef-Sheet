const KEYS = {
  recipes:     'rc_recipes',
  ingredients: 'rc_ingredients',
};

function _load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function _save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getRecipes()      { return _load(KEYS.recipes); }
function getIngredients()  { return _load(KEYS.ingredients); }
function saveRecipes(d)    { _save(KEYS.recipes, d); }
function saveIngredients(d){ _save(KEYS.ingredients, d); }

function seedIfEmpty() {
  if (getIngredients().length > 0) return;

  const ings = [
    { id: uid(), name: 'Egg',               unit: 'piece', price: 250, priceType: 'per_piece', unitQty: 30 },
    { id: uid(), name: 'All-purpose Flour', unit: 'g',     price: 55,  priceType: 'per_kg',    unitQty: 1  },
    { id: uid(), name: 'Sugar',             unit: 'g',     price: 60,  priceType: 'per_kg',    unitQty: 1  },
    { id: uid(), name: 'Butter',            unit: 'g',     price: 180, priceType: 'per_kg',    unitQty: 1  },
    { id: uid(), name: 'Milk',              unit: 'ml',    price: 70,  priceType: 'per_liter', unitQty: 1  },
    { id: uid(), name: 'Rice',              unit: 'g',     price: 60,  priceType: 'per_kg',    unitQty: 1  },
    { id: uid(), name: 'Chicken Breast',    unit: 'g',     price: 220, priceType: 'per_kg',    unitQty: 1  },
    { id: uid(), name: 'Garlic',            unit: 'piece', price: 12,  priceType: 'per_piece', unitQty: 1  },
    { id: uid(), name: 'Onion',             unit: 'piece', price: 10,  priceType: 'per_piece', unitQty: 1  },
    { id: uid(), name: 'Cooking Oil',       unit: 'ml',    price: 120, priceType: 'per_liter', unitQty: 1  },
  ];
  saveIngredients(ings);

  const rice   = ings.find(i => i.name === 'Rice');
  const garlic = ings.find(i => i.name === 'Garlic');
  const oil    = ings.find(i => i.name === 'Cooking Oil');
  const egg    = ings.find(i => i.name === 'Egg');

  saveRecipes([{
    id: uid(),
    title: 'Garlic Fried Rice',
    desc: 'Classic Filipino sinangag — crispy garlic fried rice that goes with anything.',
    instructions:
      '1. Heat oil in a pan over medium-high heat.\n' +
      '2. Fry garlic until golden and crispy.\n' +
      '3. Add rice and stir-fry for 5-7 minutes.\n' +
      '4. Season with salt and pepper.\n' +
      '5. Serve hot with eggs or any ulam.',
    servings: 2,
    photo: null,
    ingredients: [
      { ingId: rice.id,   qty: 300, unit: 'g'     },
      { ingId: garlic.id, qty: 5,   unit: 'piece'  },
      { ingId: oil.id,    qty: 30,  unit: 'ml'     },
      { ingId: egg.id,    qty: 2,   unit: 'piece'  },
    ],
  }]);
}