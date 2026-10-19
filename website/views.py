from flask import Blueprint, render_template, request, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db

views = Blueprint('views', __name__)


@views.route('/')
@login_required
def home():
    return render_template("home.html", user=current_user)


@views.route('/get-notes')
@login_required
def get_notes():
    notes = Note.query.filter_by(user_id=current_user.id).order_by(Note.id.desc()).all()
    return jsonify([n.to_dict() for n in notes])


@views.route('/add-note', methods=['POST'])
@login_required
def add_note():
    text = ((request.get_json(silent=True) or {}).get('note') or '').strip()
    if not text:
        return jsonify({'error': 'Note is too short!'}), 400
    note = Note(data=text, user_id=current_user.id)
    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict()), 201


@views.route('/delete-note', methods=['POST'])
@login_required
def delete_note():
    note_id = (request.get_json(silent=True) or {}).get('noteId')
    note = db.session.get(Note, note_id) if note_id else None
    if note and note.user_id == current_user.id:
        db.session.delete(note)
        db.session.commit()
    return jsonify({})
