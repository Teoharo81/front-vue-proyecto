import api from "./api";
import type { Categoria } from "./interfaces/Categoria";



export async function funListar(){
    return  api.get('/categoria');

}

export async function funGuardar(categoria:Categoria){
    return api.post('/categoria',categoria);

}

export async function funMostar(id:number){
    return api.get('/categoria/${id}');

}

export async function funModificar(id:number,categoria:Categoria){
    return api.put('/categoria/${id}',categoria);

}

export async function funEliminar(id:number){
    return api.delete("/categoria/${id}");


}