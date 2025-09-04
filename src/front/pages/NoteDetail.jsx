import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comment from "../components/Comment";

const NoteDetail = () => {
  const [commentText, setCommentText] = useState("");
  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);

  const { noteId } = useParams();

  useEffect(() => {
    if (!noteId) return; //cada vez que el noteid cambie, cambia el codigo, gracias al useparams
    const fetchNote = async () => {
      try {
        const response = await fetch(`https://supreme-space-chainsaw-r4wwrjwvrwxj2ww-3001.app.github.dev/api/notes/${noteId}`);
        if (response.ok) {
          const data = await response.json();
          setNote(data); //si el fetch fue un exito actualizamos con los datos de notas
        } else {
          console.error("Error al obtener la nota.");
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      }
    };

//para mostrar todos los comentarios
    const fetchComments = async () => {
      try {
        const response = await fetch(`https://supreme-space-chainsaw-r4wwrjwvrwxj2ww-3001.app.github.dev/api/notes/${noteId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Error al obtener los comentarios.");
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      }
    };

    fetchNote();
    fetchComments();
  }, [noteId]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handlePostComment = async () => {
    // Aquí va la lógica para publicar el comentario.
    // Usaremos el noteId de useParams para enviarlo al backend.
    // Por ahora, dejemos esta parte pendiente.
  };

  if (!note) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="row">
      <div className="col-6 m-auto bg-danger-subtle rounded-strong">
        <h1 className="ms-5">{note.title}</h1>
        <p className="m-2">{note.content}</p>
        <div>
          {note.tags && note.tags.map(tag => (
            <button key={tag.tag_id} type="button" className="btn btn-outline-primary m-1">
              {tag.name}
            </button>
          ))}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            <strong>Agregar un comentario</strong>
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="En que estas pensando?"
            value={commentText}
            onChange={handleCommentChange}
          ></textarea>
          <button onClick={handlePostComment} className="btn btn-primary mt-2">
            Publicar
          </button>
        </div>
        <div>
          {comments.map((c, index) => (
            <Comment key={c.id || index} commentData={c} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;