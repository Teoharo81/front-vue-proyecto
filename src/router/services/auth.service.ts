import api from "./api";

//conectar con laravel
export async function loginConlaravel(email:string, password:string) {
    const respuesta=await api.post("v1/auth/login",{email,password});
    return respuesta
    
}