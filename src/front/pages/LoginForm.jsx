import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError("El correo y la contraseña son obligatorios");
            return;
        }

        fetch(`${backendUrl}api/token`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error("Email o Contraseña invalida");
            }
            if (!response.ok) {
                throw new Error("Ocurrió un error en el servidor");
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem("token", data.access_token);
            alert("¡Inicio de sesión exitoso!");
            navigate("/"); 
        })
        .catch(error => {
            setError(error.message);
        });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <form onSubmit={handleLogin} className="p-4 border rounded shadow-sm">
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingEmail"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingEmail">Correo electrónico</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingPassword">Contraseña</label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;