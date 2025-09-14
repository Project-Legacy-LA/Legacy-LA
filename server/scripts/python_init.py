import psycopg2
import sys
import os
from dotenv import load_dotenv
from psycopg2 import sql, errors # Import specific modules

# Load environment variables from .env file
load_dotenv()

# --- Configuration loaded from .env ---
SUPERUSER_DB = os.getenv('SUPERUSER_DB', 'postgres')
SUPERUSER_USER = os.getenv('SUPERUSER_USER', 'postgres')
SUPERUSER_PASSWORD = os.getenv('SUPERUSER_PASSWORD')

APP_DB_NAME = os.getenv('DB_NAME')
APP_USER = os.getenv('DB_USER')
APP_PASSWORD = os.getenv('DB_PASSWORD')

# Path to the SQL file that creates your tables and policies.
SQL_SCRIPT_PATH = 'server/models/001_init_v2.sql'
var_dotenv = [SUPERUSER_DB, SUPERUSER_USER, SUPERUSER_PASSWORD, APP_DB_NAME, APP_USER, APP_PASSWORD]
var_str = " ".join(var_dotenv)

print(f"{var_str}")

def create_database_and_user():
    """Connects as a superuser to create the database and user idempotently."""
    conn = None
    try:
        # Connect to the default 'postgres' database
        conn = psycopg2.connect(
            dbname=SUPERUSER_DB,
            user=SUPERUSER_USER,
            password=SUPERUSER_PASSWORD,
            host='localhost'
        )
        conn.autocommit = True  # Required for CREATE DATABASE
        cursor = conn.cursor()

        # --- Create User (Idempotent) ---
        print(f"Ensuring user '{APP_USER}' exists...")
        try:
            # Use sql.Identifier for safety against SQL injection
            create_user_query = sql.SQL("CREATE USER {} WITH PASSWORD %s").format(
                sql.Identifier(APP_USER)
            )
            cursor.execute(create_user_query, (APP_PASSWORD,))
            print(f"User '{APP_USER}' created.")
        except errors.DuplicateObject:
            # This is the expected error if the user already exists.
            print(f"User '{APP_USER}' already exists. Skipping creation.")

        # --- Create Database (Idempotent) ---
        print(f"Ensuring database '{APP_DB_NAME}' exists...")
        try:
            # Use sql.Identifier for safety against SQL injection
            create_db_query = sql.SQL("CREATE DATABASE {}").format(
                sql.Identifier(APP_DB_NAME)
            )
            cursor.execute(create_db_query)
            print(f"Database '{APP_DB_NAME}' created.")
        except errors.DuplicateDatabase:
            # This is the expected error if the database already exists.
            print(f"Database '{APP_DB_NAME}' already exists. Skipping creation.")
        
        # --- Grant Privileges ---
        # This command is safe to run multiple times.
        print(f"Granting all privileges on '{APP_DB_NAME}' to '{APP_USER}'...")
        grant_query = sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
            sql.Identifier(APP_DB_NAME),
            sql.Identifier(APP_USER)
        )
        cursor.execute(grant_query)
        print("Privileges granted.")
        

    except psycopg2.Error as e:
        # Catch any other unexpected errors
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        if conn:
            conn.close()
        sys.exit(1)
    finally:
        if conn:
            conn.close()

def setup_database_schema():
    """Connects to the new database as the new user and executes the SQL script."""
    conn = None
    try:
        # Connect to the newly created database as the new user
        conn = psycopg2.connect(
            dbname=APP_DB_NAME,
            user=APP_USER,
            password=APP_PASSWORD,
            host='localhost'
        )
        cursor = conn.cursor()
        
        print("Executing SQL script to create tables and policies...")
        
        with open(SQL_SCRIPT_PATH, 'r') as f:
            sql_script = f.read()

        cursor.execute(sql_script)
        
        print("SQL script executed successfully. Tables and policies are set up.")

    except FileNotFoundError:
        print(f"Error: The SQL script file was not found at {SQL_SCRIPT_PATH}", file=sys.stderr)
        sys.exit(1)
    except psycopg2.Error as e:
        print(f"An error occurred while executing the SQL script: {e}", file=sys.stderr)
        print("The script was terminated due to the error. You may need to manually clean up.")
        sys.exit(1)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    if not all([SUPERUSER_PASSWORD, APP_DB_NAME, APP_USER, APP_PASSWORD]):
        print("Error: Missing required environment variables. Please check your .env file.", file=sys.stderr)
        sys.exit(1)
    
    create_database_and_user()
    setup_database_schema()
    print("\n PostgreSQL setup is complete. Your collaborator can now connect.")
    print(f" DB Name: {APP_DB_NAME}")
    print(f" User:    {APP_USER}")
    print(f" Password: [set in your .env file]")