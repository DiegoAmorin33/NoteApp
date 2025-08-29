import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Profile = () => {
 const { store, dispatch } = useGlobalReducer()

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
                          <p className="text-muted small mb-0">
                            Postear
                          </p>
                          <p className="text-muted small">Foto de Perfil(avatar predeterminado?)</p>
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
                        <h4 className="mb-1">Usuario</h4>
                        <p className="text-muted small">Perfil</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="profile-description">
                      <label
                        htmlFor="profileDescription"
                        className="form-label"
                      >
                        <strong>Sobre mi</strong>
                      </label>
                      <textarea
                        id="profileDescription"
                        className="form-control"
                        rows="6"
                        placeholder="A Little bit about me!"
                        style={{
                          resize: "vertical",
                          minHeight: "140px",
                          borderColor: "#dee2e6",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          backgroundColor: "#fff",
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Editar para conectar con notes*/}
                <div className="row mt-5 justify-content-center">
                  <div className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                    <div
                      className="card h-100"
                      style={{ width: "100%", maxWidth: "24rem" }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">My Skibidi</h5>
                        <h6 className="card-subtitle mb-3 text-body-secondary">
                          Sigma
                        </h6>
                        <p className="card-text flex-grow-1">
                        Sigmasious 16 plus waoooo
                        </p>
                        <div className="mt-auto">
                        <a href="#" class="btn btn-primary">BupBup</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                    <div
                      className="card h-100"
                      style={{ width: "100%", maxWidth: "24rem" }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">My Skibidi</h5>
                        <h6 className="card-subtitle mb-3 text-body-secondary">
                          Sigma
                        </h6>
                        <p className="card-text flex-grow-1">
                        Sigmasious 16 plus waoooo
                        </p>
                        <div className="mt-auto">
                        <a href="#" class="btn btn-primary">BupBup</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6 mb-4 d-flex justify-content-center">
                    <div
                      className="card h-100"
                      style={{ width: "100%", maxWidth: "24rem" }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">My Skibidi</h5>
                        <h6 className="card-subtitle mb-3 text-body-secondary">
                          Sigma
                        </h6>
                        <p className="card-text flex-grow-1">
                          Sigmasious 16 plus waoooo
                        </p>
                        <div className="mt-auto">
                        <a href="#" class="btn btn-primary">BupBup</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
