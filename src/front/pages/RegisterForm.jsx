import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from '../hooks/useGlobalReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { GoogleLogin } from '@react-oauth/google';

const RegisterForm = () => {
    const { actions } = useGlobalReducer();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    };

    const handleUserSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (user.password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (user.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            const signupSuccess = await actions.signup(user);
            if (signupSuccess) {
                const token = localStorage.getItem("token");
                await actions.getUser(token);
                alert("¡Usuario creado e inicio de sesión exitoso!");
                navigate("/profile");
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
                alert("¡Registro con Google exitoso!");
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
                    <form className="p-4" onSubmit={handleUserSubmit}>
                        <h5 className="mb-3 fw-normal text-center">Formulario de Registro</h5>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="form-floating mb-3">
                            <input onChange={handleChange} name="first_name" type="text" className="form-control" placeholder="Nombre" required />
                            <label>Nombre</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input onChange={handleChange} name="last_name" type="text" className="form-control" placeholder="Apellido" required />
                            <label>Apellido</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input onChange={handleChange} name="username" type="text" className="form-control" placeholder="Nombre de usuario" required />
                            <label>Nombre de Usuario</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input onChange={handleChange} name="email" type="email" className="form-control" placeholder="Correo electrónico" required />
                            <label>Correo electrónico</label>
                        </div>
                        <div className="form-floating mb-3 position-relative">
                            <input onChange={handleChange} name="password" type={showPassword ? "text" : "password"} className="form-control" placeholder="Contraseña" required />
                            <label>Contraseña</label>
                            <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary" style={{ cursor: 'pointer', zIndex: 100 }} onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        <div className="form-floating mb-3 position-relative">
                            <input onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" type={showConfirmPassword ? "text" : "password"} className="form-control" placeholder="Confirmar Contraseña" required />
                            <label>Confirmar Contraseña</label>
                            <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary" style={{ cursor: 'pointer', zIndex: 100 }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>

                        <button className="w-100 btn btn-lg btn-dark mt-3" type="submit">Registrarme</button>

                        <div className="mt-3 text-center">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => setError("Error iniciando sesión con Google")}
                            />
                        </div>

                        <p className="mt-4 text-center">
                            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                        </p>
                    </form>
                </div>
                <div className="col-md-4 col-lg-4 d-none d-md-block h-100 sidebar-custom-color"></div>
            </div>
        </div>
    );
};

export default RegisterForm;
