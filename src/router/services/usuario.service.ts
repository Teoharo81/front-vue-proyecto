import api from "./api";

export async function funListar(){
    return await api.get("/usuario");

}

export async function funGuardar(datos:any){
    return await api.post("/usuario",datos);

}

export async function funMostar(id:number){
    return await api.get("/usuario/"+id);

}

export async function funModificar(id:number,datos:any){
    return await api.put("/usuario/"+id,datos);

}

export async function funEliminar(id:number){
    return await api.delete("/usuario/"+id);


}