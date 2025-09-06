import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import NewNote from "./NewNote";

export const Navbar = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    return (
        <header className="bg-light border-bottom">
            <div className="container py-3">
                <nav className="d-flex align-items-center justify-content-between">
                    <Link to="/" className="text-decoration-none text-dark">
                        <h1 className="m-0">Logo</h1>
                    </Link>

                    
                    <div className="d-flex align-items-center gap-3">
                        {store.token ? (
                            <>
                                <span className="fw-bold me-2">
                                    Hola {store.user ? store.user.username : '...'}
                                </span>
                                <Link to="/profile" className="btn btn-outline-dark">
                                    Perfil
                                </Link>
                                
                                <NewNote />
                                <button onClick={handleLogout} className="btn btn-outline-danger">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/about" className="nav-link text-secondary">
                                    Sobre nosotros
                                </Link>
                                <Link to="/login" className="nav-link text-secondary">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/RegisterForm">
                                    <button className="btn btn-dark">Registrarse</button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};