import api from "./api";

export async function funListar(){
    return await api.get("/usuario", {headers:{Authorization:"Bearer **********************"}});

}

export function funGuardar(){

}

export function funMostar(){

}

export function funModificar(){

}

export function funEliminar(){

}