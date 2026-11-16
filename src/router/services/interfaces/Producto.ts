
export interface Producto{
    id?:number,
    nombre:string,
    descripcion?:string,
    precio_venta_actual:string;
    imagen?: string;
    estado:string;
    categoria_id:number;
    created_at?:string | null;
    update_At?:string | null
}
