import sqlite3

DB_NAME = "recipes.db"

def get_db():
    return sqlite3.connect(DB_NAME)

def init_db():
    with get_db() as conn:
        cur = conn.cursor()

        # Ingredients
        cur.execute("""
        CREATE TABLE IF NOT EXISTS ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            default_unit TEXT
        )
        """)

        # Ingredient Prices
        cur.execute("""
        CREATE TABLE IF NOT EXISTS ingredient_prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ingredient_id INTEGER,
            price REAL,
            unit_type TEXT,
            unit_quantity REAL,
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
        )
        """)

        # Recipes
        cur.execute("""
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            instructions TEXT,
            servings INTEGER,
            image_path TEXT
        )
        """)

        # Recipe Ingredients
        cur.execute("""
        CREATE TABLE IF NOT EXISTS recipe_ingredients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipe_id INTEGER,
            ingredient_id INTEGER,
            quantity_used REAL,
            unit_used TEXT,
            FOREIGN KEY (recipe_id) REFERENCES recipes(id),
            FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
        )
        """)

        conn.commit()


# --- Ingredients --- #
def add_ingredient(name, unit):
    with get_db() as conn:
        conn.execute(
            "INSERT INTO ingredients (name, default_unit) VALUES (?, ?)",
            (name, unit)
        )

def get_ingredients():
    with get_db() as conn:
        return conn.execute("SELECT * FROM ingredients").fetchall()
    

# --- Ingredient Prices --- #
def add_price(ingredient_id, price, unit_type, unit_quantity):
    with get_db() as conn:
        conn.execute("""
            INSERT INTO ingredient_prices 
            (ingredient_id, price, unit_type, unit_quantity)
            VALUES (?, ?, ?, ?)
        """, (ingredient_id, price, unit_type, unit_quantity))