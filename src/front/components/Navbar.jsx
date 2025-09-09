import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import NewNote from "./NewNote";
import { Dropdown } from 'react-bootstrap';
import logo from "../assets/img/logo3.png";

export const Navbar = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    return (
        <header className="navbar-custom">
            <div className="container d-flex align-items-center justify-content-between py-3">

                {/* Logo */}
                <Link to="/" className="navbar-logo text-decoration-none">
                    <img
                        src={logo}
                        alt="Logo MyApp"
                        className="d-inline-block align-top"
                        style={{ height: "40px" }}
                    />
                </Link>

                {/* Menu */}
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    {store.token ? (
                        <>
                            <span className="username me-2">
                                Hola {store.user ? store.user.username : '...'}
                            </span>

                            {/* Favoritos */}
                            <Dropdown>
                                <Dropdown.Toggle id="favoritesDropdown">
                                    Favoritos ({store.favorites.length})
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    {store.favorites.length === 0 && (
                                        <Dropdown.ItemText className="text-muted">
                                            No tienes favoritos
                                        </Dropdown.ItemText>
                                    )}
                                    {store.favorites.map(note => (
                                        <Dropdown.Item
                                            as={Link}
                                            to={`/noteDetail/${note.note_id}`}
                                            key={note.note_id}
                                        >
                                            {note.title || "Sin título"}
                                        </Dropdown.Item>
                                    ))}
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                        as={Link}
                                        to="/favorites"
                                        className="text-warning fw-bold"
                                    >
                                        Ver todos mis favoritos ⭐
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Perfil */}
                            <Link to="/profile" className="btn btn-outline-primary btn-sm">
                                Perfil
                            </Link>

                            {/* Nueva nota */}
                            <NewNote />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger btn-sm"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/about" className="nav-link navbar-link">
                                Sobre nosotros
                            </Link>
                            <Link to="/login" className="btn btn-outline-primary btn-sm">
                                Iniciar Sesión
                            </Link>
                            <Link to="/RegisterForm" className="btn btn-primary btn-sm">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
