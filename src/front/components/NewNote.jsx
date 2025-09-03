import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

    const token = sessionStorage.getItem("token");
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
    const token = sessionStorage.getItem("token");
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
        handleClose();
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
      <button
        type="button"
        className="btn btn-primary"
        onClick={showMainModal}
      >
        NEW NOTE!
      </button>

      <div className="modal fade" ref={mainModalRef} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">¿Qué deseas publicar?</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div className="modal-body">
              <input
                type="text"
                placeholder="Título de tu nota"
                className="form-control form-control-lg mb-3"
                value={title}
                onChange={handleTitleChange}
              />
              
              <textarea
                ref={textareaRef}
                className="form-control form-control-lg mb-3"
                rows="3"
                placeholder="¿Qué quieres compartir?"
                value={content}
                onChange={handleContentChange}
                style={{ resize: "none", minHeight: "120px" }}
              />

              {selectedTags.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Tags seleccionados:</label>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedTags.map((tagName) => (
                      <span key={tagName} className="badge bg-primary d-flex align-items-center">
                        {tagName}
                        <button
                          type="button"
                          className="btn-close btn-close-white ms-2"
                          style={{ fontSize: '0.6rem' }}
                          onClick={() => removeTag(tagName)}
                          aria-label="Remover tag"
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label mb-0">Selecciona tags:</label>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={showTagModal}
                  >
                    + Crear nuevo tag
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.tag_id || tag.id}
                      type="button"
                      className={`btn ${selectedTags.includes(tag.name) ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                      {selectedTags.includes(tag.name) && ' ✓'}
                    </button>
                  ))}
                  
                  {availableTags.length === 0 && (
                    <div className="text-muted">
                      No hay tags disponibles. <button 
                        type="button" 
                        className="btn btn-link p-0"
                        onClick={showTagModal}
                      >
                        Crear el primer tag
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={publishNote}
                disabled={isLoading || selectedTags.length === 0 || !title.trim() || !content.trim()}
              >
                {isLoading ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={tagModalRef} tabIndex="-1" aria-labelledby="tagModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="tagModalLabel">Crear nuevo tag</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del nuevo tag"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createNewTag()}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={createNewTag}
                disabled={isLoading || !newTagName.trim()}
              >
                {isLoading ? 'Creando...' : 'Crear tag'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" ref={loginModalRef} tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Error de Autenticación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Debes iniciar sesión para poder publicar notas y crear tags.</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default NewNote;