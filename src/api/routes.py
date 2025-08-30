from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Notes, Tags
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# PAULO Endpoint para crear un nuevo tag
@api.route('/tags', methods=['POST'])
def create_tag():
    body = request.get_json()
    tag_name = body.get('name')
    if not tag_name:
        return jsonify({"msg": "Missing tag name"}), 400
    existing_tag = Tags.query.filter_by(name=tag_name).first()
    if existing_tag:
        return jsonify({"msg": f"Tag '{tag_name}' already exists"}), 409
    new_tag = Tags(name=tag_name)
    db.session.add(new_tag)
    try:
        db.session.commit()
        return jsonify({
            "tag_id": new_tag.tag_id,
            "name": new_tag.name
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating tag: {str(e)}"}), 500

# PAULO Endpoint para ver todos los tags
@api.route('/tags', methods=['GET'])
def get_tags():
    all_tags = Tags.query.all()
    serialized_tags = []
    for tag in all_tags:
        serialized_tags.append({
            "tag_id": tag.tag_id,
            "name": tag.name
        })
    return jsonify(serialized_tags), 200


# PAULO Endpoint para obtener todas las notas
@api.route('/notes', methods=['GET'])
def get_notes():
    all_notes = Notes.query.all()
    serialized_notes = []
    for note in all_notes:
        serialized_notes.append({
            "note_id": note.note_id,
            "title": note.title,
            "content": note.content
        })

    return jsonify(serialized_notes), 200


# PAULO Endpoint para crear una nueva nota
@api.route('/notes', methods=["POST"])
def create_note():
    body = request.get_json()
    required_fields = ['title', 'content', 'user_id', 'is_anonymous', 'tags']
    if not all(field in body for field in required_fields):
        return jsonify({"msg": "Missing required fields"}), 400

    tag_names = body.get('tags')

    #validamos que los tags sean una lista
    if not isinstance(tag_names, list):
        return jsonify({"msg": "Los tags deben ser una lista"}), 400

    # creamos el objeto de la nueva nota
    new_note = Notes(
        title=body.get('title'),
        content=body.get('content'),
        user_id=body.get('user_id'),
        is_anonymous=body.get('is_anonymous')
    )

    # guardamos el tag en la nota
    for tag_name in tag_names:
        tag = Tags.query.filter_by(name=tag_name).first()
        if not tag:
            return jsonify({"msg": f"El tag '{tag_name}' no existe."}), 400
        new_note.tags.append(tag)

    db.session.add(new_note)
    db.session.commit()

    return jsonify({
        "note_id": new_note.note_id,
        "title": new_note.title,
        "content": new_note.content,
        "user_id": new_note.user_id,
        "is_anonymous": new_note.is_anonymous,
        "tags": [tag.name for tag in new_note.tags]
    }), 201
