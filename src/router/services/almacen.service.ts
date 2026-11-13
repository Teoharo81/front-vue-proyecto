import api from "./api";
import type { Almacen } from "./interfaces/Almacen";

export async function funListar(){
    return api.get('/almacen');
}

export async function funGuardar(almacen:Almacen){
    return api.post('/almacen',almacen);
}

export async function funMostrar(id:number){
    return api.get(`/almacen/${id}`);
}

export async function funModificar(id:number,almacen:Almacen){
    return api.put(`/almacen/${id}`,almacen);
}

export async function funEliminar(id:number){
    return api.delete(`/almacen/${id}`);
}
