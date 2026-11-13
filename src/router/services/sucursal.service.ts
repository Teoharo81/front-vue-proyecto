import api from "./api";
import type { Sucursal } from "./interfaces/Sucursal";

export async function funListar(){
    return api.get('/sucursal');
}

export async function funGuardar(sucursal:Sucursal){
    return api.post('/sucursal',sucursal);
}

export async function funMostrar(id:number){
    return api.get(`/sucursal/${id}`);
}

export async function funModificar(id:number,sucursal:Sucursal){
    return api.put(`/sucursal/${id}`,sucursal);
}

export async function funEliminar(id:number){
    return api.delete(`/sucursal/${id}`);
}
