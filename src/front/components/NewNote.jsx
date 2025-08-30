import React, { useState, useRef, useEffect } from "react";

export const NewNote = () => {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [availableTags, setAvailableTags] = useState([]);

  // Hook para obtener los tags de la API al cargar el componente
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("https://supreme-space-chainsaw-r4wwrjwvrwxj2ww-3001.app.github.dev/api/tags");
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
    fetchTags();
  }, []);

  // Hook para ajustar el tamaño del textarea cuando cambia el contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  // Manejador del cambio en el textarea
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  //con esto llevo a 0 el textarea si le doy cancelar
  const handleClose = () => {
    setContent("");
  };




  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        NEW NOTE!
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Que deseas publicar?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Escribe el titulo de tu nota"
                className="form-control form-control-lg mb-1"
              />
              <textarea
                ref={textareaRef}
                className="form-control form-control-lg"
                rows="1"
                placeholder="que quieres compartir?"
                value={content}
                onChange={handleContentChange}
                style={{ resize: "none", overflow: "hidden" }}
              />

              <p className="mt-2">Agrega unos tags</p>


              <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">

              <div>
                {availableTags.map((tag) => (
                  <button
                    key={tag.tag_id}
                    type="button"
                    className="btn btn-outline-primary m-1"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              </div>



            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button type="button" className="btn btn-primary">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNote;