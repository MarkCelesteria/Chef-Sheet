import database as db

db.init_db()

db.add_ingredient("Egg", "piece")
db.add_ingredient("Rice", "g")

print(db.get_ingredients())