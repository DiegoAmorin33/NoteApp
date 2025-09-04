import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";

export const NewNote = () => {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = "https://glorious-cod-5g5ggj5wjj7whv5qp-3001.app.github.dev/";

  const mainModalRef = useRef(null);
  const tagModalRef = useRef(null);
  const loginModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
    if (mainModalRef.current) {
      new window.bootstrap.Modal(mainModalRef.current);
    }
    if (tagModalRef.current) {
      new window.bootstrap.Modal(tagModalRef.current);
    }
    if (loginModalRef.current) {
      new window.bootstrap.Modal(loginModalRef.current);
    }
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${backendUrl}api/tags`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTags(data);
      } else {
        console.error("Error al obtener los tags.");
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const showMainModal = () => {
    const modal = new window.bootstrap.Modal(mainModalRef.current);
    modal.show();
  };

  const hideMainModal = () => {
    const modal = window.bootstrap.Modal.getInstance(mainModalRef.current);
    if (modal) modal.hide();
  };

  const showTagModal = () => {
    const modal = new window.bootstrap.Modal(tagModalRef.current);
    modal.show();
  };

  const hideTagModal = () => {
    const modal = window.bootstrap.Modal.getInstance(tagModalRef.current);
    if (modal) modal.hide();
  };

  const showLoginModal = () => {
    const modal = new window.bootstrap.Modal(loginModalRef.current);
    modal.show();
  };

  const hideLoginModal = () => {
    const modal = window.bootstrap.Modal.getInstance(loginModalRef.current);
    if (modal) modal.hide();
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTagClick = (tagName) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  const removeTag = (tagNameToRemove) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagNameToRemove));
  };

  const handleClose = () => {
    setContent("");
    setTitle("");
    setSelectedTags([]);
    setNewTagName("");
    hideMainModal();
  };

  const createNewTag = async () => {
    if (!newTagName.trim()) {
      alert("El nombre del tag no puede estar vacío");
      return;
    }

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      hideTagModal();
      showLoginModal();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (response.ok) {
        const newTag = await response.json();
        setAvailableTags(prev => [...prev, newTag]);
        setSelectedTags(prev => [...prev, newTag.name]);
        setNewTagName("");
        hideTagModal();
      } else {
        const errorData = await response.json();
        alert(`Error creando tag: ${errorData.msg || errorData.error}`);
      }
    } catch (error) {
      console.error("Error creando tag:", error);
      alert("Error al crear el tag");
    } finally {
      setIsLoading(false);
    }
  };

  const publishNote = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      showLoginModal();
      return;
    }

    if (selectedTags.length === 0) {
      alert("Debes seleccionar al menos un tag para publicar la nota.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("El título y contenido son obligatorios");
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      is_anonymous: false,
      tags: selectedTags,
    };

    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        alert("¡Nota publicada exitosamente!");
        const modalElement = document.getElementById("exampleModal");
        if (modalElement) {
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
        handleClose(); // Reseteamos los inputs
        navigate("/"); // Redirigimos al usuario a la página de inicio
      } else {
        const errorData = await response.json();
        alert(`Error al publicar: ${errorData.msg || errorData.error}`);
      }
    } catch (error) {
      console.error("Error publicando nota:", error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {/* 🔽 Aquí sigue todo tu JSX original (botón de New Note, modales, etc.) */}
      <button className="btn btn-primary mt-3" onClick={showMainModal}>
        New Note
      </button>

      {/* Modal principal */}
      <div className="modal fade" ref={mainModalRef} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nueva Nota</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Título"
                value={title}
                onChange={handleTitleChange}
              />
              <textarea
                ref={textareaRef}
                className="form-control mb-2"
                rows="3"
                placeholder="Escribe tu nota aquí..."
                value={content}
                onChange={handleContentChange}
              ></textarea>
              <div className="mb-2">
                <strong>Tags:</strong>
                <div className="d-flex flex-wrap mt-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag.id}
                      className={`btn btn-sm m-1 ${selectedTags.includes(tag.name) ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                    </button>
                  ))}
                  {selectedTags.map(tag => (
                    !availableTags.some(t => t.name === tag) && (
                      <span key={tag} className="badge bg-secondary m-1">
                        {tag}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          onClick={() => removeTag(tag)}
                          style={{ fontSize: "0.6rem" }}
                        ></button>
                      </span>
                    )
                  ))}
                  <button className="btn btn-sm btn-success m-1" onClick={showTagModal}>
                    + Nuevo Tag
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleClose}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={publishNote} disabled={isLoading}>
                {isLoading ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear nuevo Tag */}
      <div className="modal fade" ref={tagModalRef} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear nuevo Tag</h5>
              <button type="button" className="btn-close" onClick={hideTagModal}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del Tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={hideTagModal}>
                Cancelar
              </button>
              <button className="btn btn-success" onClick={createNewTag} disabled={isLoading}>
                {isLoading ? "Creando..." : "Crear Tag"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={loginModalRef} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Error</h5>
              <button type="button" className="btn-close" onClick={hideLoginModal}></button>
            </div>
            <div className="modal-body">
              Debes iniciar sesión para realizar esta acción.
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={hideLoginModal}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNote;
