import type { Sucursal } from "./Sucursal";

export interface Almacen{
    id?:number,
    nombre:string,
    descripcion:string,
    sucursal_id:number,
    sucursal?:Sucursal
}
