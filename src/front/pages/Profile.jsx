import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const navigate = useNavigate();

  // Debug: Verificar todas las variables de entorno
  console.log("🔍 Environment variables:", {
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_BASENAME: import.meta.env.VITE_BASENAME
  });

  // Debug: Verificar todo el localStorage
  console.log("🔍 LocalStorage completo:", {
    token: localStorage.getItem("token"),
    allItems: { ...localStorage }
  });

  // Verificar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token encontrado en useEffect:", token);
    
    if (!token) {
      console.error("❌ NO HAY TOKEN - Redirigiendo a login");
      navigate("/login");
      return;
    }
    
    console.log("✅ Token válido encontrado, cargando datos...");
    // Si hay token, cargar los datos
    fetchUserProfile();
    fetchUserNotes();
  }, [navigate]);

  // Obtener perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token en fetchUserProfile:", token);
      
      if (!token) {
        console.error("❌ No token found in fetchUserProfile");
        return;
      }

      // URL CORRECTA - sin doble slash
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${backendUrl}/api/profile`.replace(/([^:]\/)\/+/g, "$1");
      
      console.log("🌐 Fetching profile from:", url);
      console.log("📋 Headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📊 Profile response status:", response.status);
      console.log("📊 Profile response headers:", Object.fromEntries([...response.headers]));

      if (response.ok) {
        const profile = await response.json();
        console.log("✅ User profile data:", profile);
        setUserProfile(profile);
        setBio(profile.bio || "");
      } else {
        console.error("❌ Error fetching profile:", response.status);
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        
        if (response.status === 401 || response.status === 422) {
          console.log("🗑️ Removing invalid token and redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("❌ Network error fetching user profile:", error);
    }
  };

  // Actualizar bio del usuario
  const updateBio = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token en updateBio:", token);
      
      if (!token) {
        console.error("No token found");
        return;
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${backendUrl}/api/profile/bio`.replace(/([^:]\/)\/+/g, "$1");

      console.log("🌐 Updating bio at:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio: bio }),
      });

      console.log("📊 Bio update response status:", response.status);

      if (response.ok) {
        console.log("✅ Bio updated successfully");
        setIsEditingBio(false);
        setUserProfile((prev) => ({ ...prev, bio: bio }));
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
      const token = localStorage.getItem("token");
      console.log("🔑 Token en fetchUserNotes:", token);
      
      if (!token) {
        console.error("❌ No token found in fetchUserNotes");
        return;
      }

      // URL CORRECTA para las notas del usuario
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const url = `${backendUrl}/api/profile/notes`.replace(/([^:]\/)\/+/g, "$1");
      
      console.log("🌐 Fetching user notes from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📊 Notes response status:", response.status);

      if (response.ok) {
        const notes = await response.json();
        console.log("✅ User notes data:", notes);
        setUserNotes(notes);
      } else {
        console.error("❌ Error fetching notes:", response.status);
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
      }
    } catch (error) {
      console.error("❌ Network error fetching user notes:", error);
    } finally {
      console.log("🏁 Loading complete");
      setLoading(false);
    }
  };

  // Debug: Estado actual del componente
  console.log("📊 Component state:", {
    loading,
    userProfile,
    userNotes: userNotes.length,
    bio,
    isEditingBio
  });

  if (loading && !userProfile) {
    console.log("🌀 Showing loading spinner");
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <div className="ms-3">Cargando perfil...</div>
      </div>
    );
  }

  console.log("🎨 Rendering profile UI");
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
                          {userProfile ? userProfile.username : "Usuario no encontrado"}
                        </h4>
                        <p className="text-muted">
                          {userProfile
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : "Perfil no disponible"}
                        </p>
                        <p className="text-muted small">
                          ID: {userProfile?.id || "N/A"}
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
                      <p>No tienes notas todavía. ¡Crea tu primera nota!</p>
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