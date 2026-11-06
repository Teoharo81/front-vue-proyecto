import api from "./api";

//conectar con laravel
export async function loginConlaravel(email:string, password:string) {
    const respuesta=await api.post("v1/auth/login",{email,password});
    return respuesta;
    
}

export async function obtenerPerfil() {
    return await api.get("v1/auth/profile");
    
    
}
export async function logout() {
    
}

export async function register() {
    
}