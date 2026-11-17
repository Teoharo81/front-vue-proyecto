import api from "./api";
import type { Producto } from "./interfaces/Producto";

export async function funListar(page:number=1,limit:number=10){
    return api.get(`/producto?page=${page}&limit=${limit}`);
}

export async function funGuardar(prod:Producto){
    return api.post('/producto',prod);
}

export async function funMostrar(id:number){
    return api.get(`/producto/${id}`);
}

export async function funModificar(id:number,prod:Producto){
    return api.put(`/producto/${id}`,prod);
}

export async function funEliminar(id:number){
    return api.delete(`/producto/${id}`);
}
