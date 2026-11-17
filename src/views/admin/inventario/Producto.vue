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
    </v-container>

    <h1>Productos</h1>
    <pre>{{ productos }} </pre>
</template>

<script lang="ts" setup>
import type { Producto } from '@/router/services/interfaces/Producto';
import { onMounted,ref } from 'vue';
import { funListar } from '@/router/services/Producto.service'

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

const page=ref(1)

onMounted(()=>{
    listarProductos()


})

async function listarProductos(){
    cargando.value=true;
    const {data} =await funListar(page.value,itemsPerPage.value);
    productos.value=data.data
    cargando.value=false;
}

const vacio = ():Producto=>({
     id:0,
     nombre: '',
     descripcion: '',
     precio_venta_actual: '',
     imagen:'',
     estado:'',
     categoria_id:-1
    
    
    
    });


const form =ref<Producto>(vacio());


function abrirCrear() {
  form.value = { nombre: '', direccion: '', telefono: '' };
  errores.value = {};
  editando.value = false;
  dialog.value = true;
}

</script>
