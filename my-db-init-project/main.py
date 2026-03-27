from pymongo import MongoClient
import re
import json
import sys

def is_valid_mongodb_name():
    while True:
        db_name = input("enter DB name to create: ").strip()
        if not db_name:
            print("Database name cannot be empty.")
            continue
        if len(db_name) > 64:
            print("Database name is too long (Max 64 characters).")
            continue
        forbidden_chars = r'[/\. "$]'
        if re.search(forbidden_chars, db_name):
            print("Name contains invalid characters (no spaces, dots, slashes, or quotes).")
            continue
        if db_name.lower() in ['admin', 'local', 'config']:
            print(f"'{db_name}' is a reserved system database name.")
            continue
        break
    return db_name

def product(db):
    try:
        with open("product.json", "r") as f:
            data = json.load(f)
        collection = db["products"]
        collection.delete_many({})
        collection.insert_many(data)
        print("Successfully updated products")
    except Exception as e:
        print(f"failed product: {e}")

def modelproduct(db):
    try:
        with open("modelproduct.json", "r") as f:
            data = json.load(f)
        collection = db["modelProducts"]
        collection.delete_many({})
        collection.insert_many(data)
        print("Successfully updated modelProducts")
    except Exception as e:
        print(f"failed model product: {e}")

def searchproduct(db):
    try:
        with open("searchproduct.json", "r") as f:
            data = json.load(f)
        collection = db["searchPageProduct"]
        collection.delete_many({})
        collection.insert_many(data)
        print("Successfully updated searchPageProduct")
    except Exception as e:
        print(f"failed search product: {e}")

Key = input("enter mongoDB key: ").strip()
dbName = is_valid_mongodb_name()

try:
    client = MongoClient(Key)
    db = client[dbName]
    client.admin.command('ping')
    print(f"Connected to database: {db.name}")

    product(db)
    modelproduct(db)
    searchproduct(db)
    
except Exception as e:
    print(f"Connection failed: {e}")