import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from '../hooks/useGlobalReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
    const { actions } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError("El correo y la contraseña son obligatorios");
            return;
        }

        try {
            const loggedIn = await actions.login(email, password);
            if (loggedIn) {
                alert("¡Inicio de sesión exitoso!");
                const token = localStorage.getItem("token");
                await actions.getUser(token);
                navigate("/profile");
            } else {
                setError("Email o Contraseña inválida");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const googleToken = credentialResponse.credential;
            const success = await actions.loginWithGoogle(googleToken);
            if (success) {
                alert("¡Inicio de sesión con Google exitoso!");
                navigate("/profile");
            } else {
                setError("Error iniciando sesión con Google");
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row vh-100 d-flex align-items-center">
                <div className="col-md-4 col-lg-4 d-none d-md-block h-100 sidebar-custom-color"></div>
                <div className="col-12 col-md-4 col-lg-4">
                    <form onSubmit={handleLogin} className="p-4">
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <label>Correo electrónico</label>
                        </div>
                        <div className="form-floating mb-3 position-relative">
                            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <label>Contraseña</label>
                            <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary" style={{ cursor: 'pointer', zIndex: 100 }} onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>

                        <button className="w-100 btn btn-lg btn-dark mt-3" type="submit">Entrar</button>

                        <div className="mt-3 text-center">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => setError("Error iniciando sesión con Google")}
                            />
                        </div>

                        <p className="mt-4 text-center">
                            ¿No tienes una cuenta? <Link to="/RegisterForm">Regístrate aquí</Link>
                        </p>
                    </form>
                </div>
                <div className="col-md-4 col-lg-4 d-none d-md-block h-100 sidebar-custom-color"></div>
            </div>
        </div>
    );
};

export default LoginForm;
