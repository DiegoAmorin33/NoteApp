import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Obtener perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`${backendUrl}api/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
        setBio(profile.bio || "");
      } else {
        console.error("Error fetching profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Actualizar bio del usuario
  const updateBio = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`${backendUrl}api/profile/bio`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      if (response.ok) {
        setIsEditingBio(false);
        setUserProfile((prev) => ({ ...prev, bio }));
      } else {
        console.error("Error updating bio:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  // Obtener notas del usuario
  const fetchUserNotes = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`${backendUrl}api/profile/notes`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const notes = await response.json();
        setUserNotes(notes);
      } else {
        console.error("Error fetching user notes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserNotes();
  }, []);

  return (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div
        style={{
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          paddingTop: "20px",
          paddingBottom: "40px",
        }}
      >
        <section id="content" className="container">
          <div className="page-heading">
            <div className="media clearfix">
              <div className="media-left pr30"></div>
              <div className="media-body va-m">
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="profile-picture-upload">
                      <div
                        className="profile-picture-container mt-3"
                        style={{
                          width: "150px",
                          height: "150px",
                          border: "2px dashed #ccc",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f8f9fa",
                          cursor: "pointer",
                          position: "relative",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div className="text-center">
                          <i className="fa fa-camera fa-2x text-muted mb-2"></i>
                          <p className="text-muted small mb-0">Postear</p>
                          <p className="text-muted small">
                            Foto de Perfil (avatar predeterminado?)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <h4 className="mb-1">
                          {userProfile ? userProfile.username : "Cargando..."}
                        </h4>
                        <p className="text-muted">
                          {userProfile
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : "Perfil"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="profile-description">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label htmlFor="profileDescription" className="form-label mb-0">
                          <strong>Sobre mi</strong>
                        </label>
                        {!isEditingBio ? (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setIsEditingBio(true)}
                          >
                            Editar
                          </button>
                        ) : (
                          <div>
                            <button className="btn btn-sm btn-success me-2" onClick={updateBio}>
                              Guardar
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setIsEditingBio(false);
                                setBio(userProfile?.bio || "");
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                      <textarea
                        id="profileDescription"
                        className="form-control"
                        rows="6"
                        placeholder="Un poco sobre mi!"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        readOnly={!isEditingBio}
                        style={{
                          resize: "vertical",
                          minHeight: "140px",
                          borderColor: "#dee2e6",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          backgroundColor: isEditingBio ? "#fff" : "#f8f9fa",
                          cursor: isEditingBio ? "text" : "default",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Notas del usuario */}
                <div className="row mt-5 justify-content-center">
                  {loading ? (
                    <div className="col-12 text-center">
                      <p>Cargando notas...</p>
                    </div>
                  ) : userNotes.length === 0 ? (
                    <div className="col-12 text-center">
                      <p>Aquí van tus notas!</p>
                    </div>
                  ) : (
                    userNotes.map((note) => (
                      <div
                        key={note.note_id}
                        className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center"
                      >
                        <Link to={`/noteDetail/${note.note_id}`} className="text-decoration-none">
                          <div
                            className="card h-100"
                            style={{
                              width: "100%",
                              maxWidth: "24rem",
                              cursor: "pointer",
                              transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-5px)";
                              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.12)";
                            }}
                          >
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title text-dark">{note.title}</h5>
                              <p className="card-text flex-grow-1 text-muted">
                                {note.content.length > 100
                                  ? `${note.content.substring(0, 100)}...`
                                  : note.content}
                              </p>
                              <div className="mt-auto">
                                <span className="btn btn-primary btn-sm">Ver más</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;