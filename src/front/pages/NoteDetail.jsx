import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const NoteDetail = () => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchNoteAndComments = async () => {
      try {
        setLoading(true);
        
        console.log("Fetching note with ID:", id);
        
        const noteResponse = await fetch(`${backendUrl}api/notes/${id}`);
        console.log("Note response status:", noteResponse.status);
        
        if (noteResponse.ok) {
          const noteData = await noteResponse.json();
          console.log("Note data:", noteData);
          setNote(noteData);
        } else {
          console.error("Error al obtener la nota:", noteResponse.status);
          if (noteResponse.status === 404) {
            alert("La nota no existe.");
          }
          return;
        }
        
        const commentsResponse = await fetch(`${backendUrl}api/notes/${id}/comments`);
        console.log("Comments response status:", commentsResponse.status);
        
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          console.log("Comments data:", commentsData);
          setComments(commentsData);
        } else {
          console.error("Error al obtener los comentarios:", commentsResponse.status);
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
        alert("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchNoteAndComments();
    }
  }, [id, backendUrl]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handlePostComment = async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    if (!commentText.trim()) {
      alert("El comentario no puede estar vacío.");
      return;
    }

    const commentData = {
      comment: commentText,
    };

    try {
      console.log("Posting comment to note ID:", id);
      const response = await fetch(`${backendUrl}api/notes/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      console.log("Comment post response status:", response.status);

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setCommentText("");
        alert("Comentario publicado exitosamente.");
      } else if (response.status === 404) {
        alert("La nota no existe. No se puede comentar.");
      } else if (response.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        sessionStorage.removeItem("token");
      } else {
        const errorData = await response.json();
        alert(`Error al publicar el comentario: ${errorData.msg || errorData.error || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("Ocurrió un error inesperado.");
    }
  };

  // Función para manejar la edición de comentarios
  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedContent(currentContent);
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  // Función para guardar comentario editado
  const handleSaveEdit = async (commentId) => {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      alert("Debes iniciar sesión para editar comentarios.");
      return;
    }

    if (!editedContent.trim()) {
      alert("El comentario no puede estar vacío.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: editedContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(comments.map(comment => 
          comment.comment_id === commentId ? updatedComment : comment
        ));
        setEditingCommentId(null);
        setEditedContent("");
        alert("Comentario actualizado exitosamente.");
      } else if (response.status === 401) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        sessionStorage.removeItem("token");
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar el comentario: ${errorData.msg || errorData.error}`);
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      alert("Ocurrió un error inesperado.");
    }
  };

  const getCurrentUserId = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub ? payload.sub.toString() : null;
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // Verificar si el usuario actual es el autor del comentario
  const isCommentAuthor = (commentUserId) => {
    return currentUserId && commentUserId.toString() === currentUserId;
  };

  if (loading) {
    return <div className="text-center mt-5">Cargando nota...</div>;
  }

  if (!note) {
    return <div className="text-center mt-5">La nota no existe.</div>;
  }

  return (
    <div className="row">
      <div className="col-6 m-auto bg-danger-subtle rounded-strong">
        <h1 className="ms-5">{note.title}</h1>
        <p className="m-2">{note.content}</p>
        
        <div>
          {note.tags && note.tags.map((tag, index) => (
            <button key={index} type="button" className="btn btn-outline-primary m-1">
              {tag}
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
          {comments.map((comment) => (
            <div key={comment.comment_id} className="card mb-2">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {comment.first_name} {comment.last_name} (@{comment.username})
                  </h6>
                  {isCommentAuthor(comment.user_id) && editingCommentId !== comment.comment_id && (
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEditComment(comment.comment_id, comment.content)}
                    >
                      Editar
                    </button>
                  )}
                </div>
                
                {editingCommentId === comment.comment_id ? (
                  <>
                    <textarea
                      className="form-control mb-2"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows="3"
                    />
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSaveEdit(comment.comment_id)}
                      >
                        Guardar
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="card-text">{comment.content}</p>
                )}
                
                <small className="text-muted">
                  {new Date(comment.created_at).toLocaleString()}
                  {comment.updated_at && comment.updated_at !== comment.created_at && 
                    ` · Editado: ${new Date(comment.updated_at).toLocaleString()}`
                  }
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;