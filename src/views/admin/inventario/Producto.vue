<template>
    <v-container fluid class="py-6">
     <v-card rounded="lg" elevation="3">
      <v-toolbar flat color="transparent" density="comfortable">
        <v-icon icon="mdi-store-outline" color="primary" class="ms-4"></v-icon>
        <v-toolbar-title class="font-weight-bold">Gestión de productos</v-toolbar-title>

        <v-btn
          color="primary"
          rounded="lg"
          prepend-icon="mdi-plus"
          @click="abrirCrear"
        >
          Nuevo producto
        </v-btn>
      </v-toolbar>

      <v-card-subtitle>
        {{ productos.length }}
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <v-text-field
          v-model="buscar"
          label="Buscar por nombre, dirección o teléfono"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="mb-4"
        ></v-text-field>
      

        <v-data-table-server v-model:items-per-page="itemsPerPage"
           :headers="headers"
           :items="productos"
           v-model:page="page"
           :items-length="30"
           :loading="cargando"
           item-value="name"
          @update:options="listarProductos"
         
          hover
          no-data-text="No hay sucursales registradas"
        >
        
        
          <template v-slot:item.imagen="{ item }">
            <img :src="`https://backinventarios.blumbit.net/${item.imagen}`" alt="" width="30">    
          </template>


         <template v-slot:item.actions="{ item }">
                 <v-btn 
                  icon="mdi-pencil"
                 color="primary"
                 size="small"
                  variant="text"
                 @click="abrirEditar(item)"
                 />
                
                 <v-btn
                  icon="mdi-delete"
                  color="error"
                  size="small"
                  variant="text"
                  @click="abrirEliminar(item)"
                 
                 />
              
          </template>

        </v-data-table-server>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-form ref="formRef" @submit.prevent="guardar">
        {{ form }}
        <v-card rounded="lg">
          <v-card-title class="font-weight-bold">
            <v-icon color="primary" icon="mdi-warehouse-cog"/>
            {{ form.id ? 'Editar producto' : 'Nuevo Producto' }}
          </v-card-title>
          <v-card-subtitle>
            {{
              editando
                ? 'Modifica los datos del almacén'
                : 'Registra un nuevo almacén'
            }}
          </v-card-subtitle>

          <v-divider></v-divider>

          <v-card-text>
            <v-text-field
              v-model="form.nombre"
              label="nombre"
              placeholder="ej. Laptop Asus20.0"
              prepend-inner-icon="mdi-warehouse"
              :rules="[obligatorio]"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.nombre"
              autofocus
            ></v-text-field>

            <v-text-field
              v-model="form.precio_venta_actual"
              label="Descripción"
              placeholder="ej. desc..."
              prepend-inner-icon="mdi barcode"
              :rules="[obligatorio]"
              variant="outlined"
              density="comfortable"
              rows="2"
              auto-grow
              :error-messages="errores.precio_venta_actual"
              />

             <v-text-field
              v-model="form.precio_venta_actual"
              label="Precio"
              placeholder="ej.30.00"
              prepend-inner-icon="mdi-warehouse"
              :rules="[obligatorio]"
              variant="outlined"
              density="comfortable"
              :error-messages="errores.precio_venta_actual"
              autofocus
            />
            
           <v-radio-group  v-model="form.categoria_id">
              <v-radio :label="cat.nombre" :value="cat.id" v-for="cat in categorias"></v-radio>
           
            </v-radio-group>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-btn variant="text" @click="cerrar">Cancelar</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              type="submit"
              color="primary"
              prepend-icon="mdi-content-save"
              :loading="guardando"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    </v-container>



   
</template>

<script lang="ts" setup>
import type { Producto } from '@/router/services/interfaces/Producto';
import { onMounted,ref } from 'vue';
import { funGuardar, funListar, funModificar } from '@/router/services/Producto.service'
import * as catService from '@/router/services/categoria.service'

  const itemsPerPage = ref(10)



const productos=ref<Producto[]>([]);
const headers = [
  { title: 'ID', key: 'id',with: 70 },
  { title: 'NOMBRE', key: 'nombre' },
  { title: 'PRECIO VENTA', key: 'precio_venta_actual' },
  { title: 'IMAGEN', key: 'imagen' },
  { title: 'CATEGORIA', key: 'categoria.nombre' },
  { title: 'REGISTRADO', key: 'created_at' },
  { title: 'ACCIONES', key: 'actions' ,align:'end' as const, sortable:false},
];
const cargando=ref(false);

const buscar=ref('');
const errores = ref<Record<string, string | string[]>>({});
const dialog = ref<boolean>(false);
const guardando=ref(false);

const snackbar = ref({ show: false, text: '', color: 'success' });

const page=ref(1)
const formRef=ref<any>(null);
  
function obligatorio(valor:unknown){
  return(valor!==null&& valor !==undefined && String(valor).trim() !== '')
      || 'este campo es obligatorio';
}

function cerrarDialogo(){
  dialog.value=false;
  form.value=vacio();
  errores.value={};
}



const categorias=ref<any>([]);

onMounted(()=>{
    listarProductos()
    listarCategorias()


})

async function listarProductos(){
    cargando.value=true;
    const {data} =await funListar(page.value,itemsPerPage.value);
    productos.value=data.data
    cargando.value=false;
}

async function listarCategorias(){
    cargando.value=true;
    const {data} =await catService.funListar();
    categorias.value=data
    cargando.value=false;
}



const vacio = ():Producto=>({
     id:0,
     nombre: '',
     descripcion: '',
     precio_venta_actual: '',
     imagen:'',
     estado:true,
     categoria_id:-1
    
    
    
    });


const form =ref<Producto>(vacio());


function abrirCrear() {
  form.value = { nombre: '', direccion: '', telefono: '' };
  errores.value = {};
  editando.value = false;
  dialog.value = true;
}

function abrirEditar(){

}

function abrirEliminar(){
  
}

async function guardar() {
  errores.value = {};

  const nuevosErrores: Record<string, string[]> = {};
  if (!form.value.nombre.trim()) {
    nuevosErrores.nombre = ['El nombre es obligatorio'];
  }
  if (!form.value.sucursal_id) {
    nuevosErrores.sucursal_id = ['Selecciona una sucursal'];
  }
  if (Object.keys(nuevosErrores).length) {
    errores.value = nuevosErrores;
    return;
  }

  const payload: Producto = {
    nombre: form.value.nombre.trim(),
    precio_venta_actual:form.value.precio_venta_actual.trim(),
    descripcion:form.value.descripcion?.trim() || "",
    categoria_id: form.value.categoria_id,
    estado: true
  };

  guardando.value = true;
  try {
    if (form.value.id) {
      await funModificar (form.value.id, payload);
      notificar('Almacén actualizado correctamente');
    } else {
      await funGuardar (payload);
      notificar('Almacén registrado correctamente');
    }




    dialog.value = false;
    await listarProductos();
  } catch (error: any) {
    aplicarErrores(error);
  } finally {
    guardando.value = false;
  }
}

function notificar(text: string, color = 'success') {
  snackbar.value = { show: true, text, color };
}

function aplicarErrores(error: any) {
  const data = error?.response?.data;
  if (error?.response?.status === 422 && data?.errors) {
    errores.value = data.errors;
    notificar(data.message ?? 'Revisa los datos del formulario', 'warning');
  } else {
    notificar(data?.message ?? 'Ocurrió un error inesperado', 'error');
  }
}


</script>
