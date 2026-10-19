# Flask Notes App
Single-page notes app (Flask + SQLAlchemy + SQLite). Notes are sent to the
backend with `fetch`, stored in the database and rendered on the same page
without a reload. Includes sign-up / login so each user sees only their notes.

## Run
    pip install -r requirements.txt
    python main.py
Open http://127.0.0.1:5000
