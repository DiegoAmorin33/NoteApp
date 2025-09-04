const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Función para decodificar y verificar el token JWT
 */
const decodeJWT = (token) => {
    try {
        // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error("Token JWT inválido: no tiene 3 partes");
        }
        
        const payload = JSON.parse(atob(parts[1]));
        console.log("Token payload:", payload);
        return payload;
    } catch (error) {
        console.error("Error decodificando token:", error);
        return null;
    }
};

export const actions = (dispatch) => ({

    login: (email, password) => {
        const opts = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password }),
        };

        console.log("Making login request to:", `${backendUrl}api/token`);

        return fetch(`${backendUrl}api/token`, opts)
            .then(async (resp) => {
                const responseText = await resp.text();
                console.log("Login response status:", resp.status);
                
                if (resp.status === 401) {
                    throw new Error("Credenciales inválidas");
                }
                if (resp.status === 422) {
                    throw new Error("Datos de formulario inválidos");
                }
                if (resp.status === 400) {
                    throw new Error("Solicitud mal formada");
                }
                if (!resp.ok) {
                    throw new Error(`Error en la autenticación: ${resp.status} - ${responseText}`);
                }

                try {
                    const data = JSON.parse(responseText);
                    console.log("Login successful");
                    return data;
                } catch (e) {
                    console.error("Error parsing login response:", e);
                    throw new Error("Respuesta del servidor no válida");
                }
            })
            .then(data => {
                if (!data.access_token) {
                    console.error("No access_token in response:", data);
                    throw new Error("Token no recibido del servidor");
                }
                
                // Debug del token
                const tokenPayload = decodeJWT(data.access_token);
                
                if (!tokenPayload) {
                    throw new Error("Token JWT inválido: no se pudo decodificar");
                }
                
                // ACEPTAR tanto números como strings en el sub
                if (tokenPayload.sub === undefined || tokenPayload.sub === null) {
                    console.error("Token inválido: subject no definido");
                    throw new Error("Token inválido: subject no definido");
                }
                
                // Convertir sub a string si es número (para compatibilidad)
                if (typeof tokenPayload.sub === 'number') {
                    console.log("Converting numeric sub to string:", tokenPayload.sub);
                    tokenPayload.sub = tokenPayload.sub.toString();
                }
                
                sessionStorage.setItem("token", data.access_token);
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.access_token });
                return true;
            })
            .catch(error => {
                console.error("Error durante el login:", error.message);
                dispatch({ type: 'LOGIN_ERROR', payload: error.message });
                return false;
            });
    },

    signup: (userData) => {
        const opts = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(userData),
        };

        console.log("Making signup request to:", `${backendUrl}api/user`);

        return fetch(`${backendUrl}api/user`, opts)
            .then(async (resp) => {
                const responseText = await resp.text();
                console.log("Signup response status:", resp.status);
                
                if (resp.status === 422) {
                    let errorMessage = "Error de validación en el registro";
                    try {
                        const errorData = JSON.parse(responseText);
                        errorMessage = errorData.detail || errorData.error || errorData.msg || errorMessage;
                    } catch (e) {
                        errorMessage = responseText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }
                
                if (resp.status === 400) {
                    throw new Error("Datos de registro inválidos");
                }
                
                if (resp.status === 409) {
                    throw new Error("El usuario ya existe");
                }
                
                if (!resp.ok) {
                    throw new Error(`Error en el registro: ${resp.status} - ${responseText}`);
                }

                try {
                    return JSON.parse(responseText);
                } catch (e) {
                    throw new Error("Respuesta del servidor no válida");
                }
            })
            .then(data => {
                console.log("Signup successful, attempting login...");
                return actions(dispatch).login(userData.email, userData.password);
            })
            .catch(error => {
                console.error("Error durante el registro:", error.message);
                dispatch({ type: 'SIGNUP_ERROR', payload: error.message });
                throw error;
            });
    },

   
    logout: () => {
        console.log("Logging out...");
        sessionStorage.removeItem("token");
        dispatch({ type: 'LOGOUT' });
    },
    
    getUser: (token) => {
        if (!token) {
            console.error("No token provided for getUser");
            dispatch({ type: 'AUTH_ERROR', payload: "Token no proporcionado" });
            return false;
        }

        // Debug: inspeccionar el token
        const tokenPayload = decodeJWT(token);
        
        if (!tokenPayload) {
            console.error("Token inválido: no se pudo decodificar");
            sessionStorage.removeItem("token");
            dispatch({ type: 'LOGOUT' });
            return false;
        }

        if (tokenPayload.sub === undefined || tokenPayload.sub === null) {
            console.error("Token inválido: falta subject (sub)");
            sessionStorage.removeItem("token");
            dispatch({ type: 'LOGOUT' });
            return false;
        }

        // ACEPTAR tanto números como strings en el sub
        if (typeof tokenPayload.sub === 'number') {
            console.log("Numeric sub detected in profile request:", tokenPayload.sub);
        }

        const opts = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        };

        console.log("Making profile request to:", `${backendUrl}api/profile`);

        return fetch(`${backendUrl}api/profile`, opts)
            .then(async (resp) => {
                const responseText = await resp.text();
                
                console.log(`Profile response status: ${resp.status}`);
                console.log(`Profile response text: ${responseText}`);

                if (resp.status === 401) {
                    console.warn("Unauthorized - removing token");
                    sessionStorage.removeItem("token");
                    dispatch({ type: 'LOGOUT' });
                    throw new Error("No autorizado - Sesión expirada");
                }
                
                if (resp.status === 422) {
                    console.warn("Unprocessable Entity - removing token");
                    sessionStorage.removeItem("token");
                    dispatch({ type: 'LOGOUT' });
                    
                    let errorDetail = "Token inválido o expirado";
                    try {
                        const errorData = JSON.parse(responseText);
                        errorDetail = errorData.msg || errorData.detail || errorData.error || errorDetail;
                    } catch (e) {
                        // Mantener el mensaje por defecto
                    }
                    throw new Error(errorDetail);
                }
                
                if (resp.status === 404) {
                    throw new Error("Perfil no encontrado");
                }
                
                if (!resp.ok) {
                    throw new Error(`Error del servidor: ${resp.status} - ${responseText}`);
                }

                try {
                    const data = JSON.parse(responseText);
                    console.log("Profile data received successfully");
                    return data;
                } catch (e) {
                    console.error("Error parsing profile response:", e);
                    throw new Error("Respuesta del servidor no válida");
                }
            })
            .then(data => {
                dispatch({ type: 'SET_USER', payload: data });
                console.log("Profile data set successfully");
                return true;
            })
            .catch(error => {
                console.error("Error fetching user data:", error.message);
                dispatch({ type: 'PROFILE_ERROR', payload: error.message });
                return false;
            });
    },

    /**
     * Función para verificar y renovar token si es necesario
     */
    verifyToken: (token) => {
        console.log("Verifying token...");
        return actions(dispatch).getUser(token);
    }
});