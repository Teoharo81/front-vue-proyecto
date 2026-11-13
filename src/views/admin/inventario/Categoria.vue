<template>
    <h1>Lista de categorias</h1>

    <form @submit.prevent="funGurdarCategoria">

        <label for="">Ingrese nombre</label>
        <input type="text" v-model="categoria.nombre">
        <br>
        <label for="">Ingrese descripcion</label>
        <textarea v-model="categoria.descripcion"></textarea>
        <br>

        <input type="submit" value="guardar categoria">




    </form>

    <v-card    title="Gestion Categorias" >
        <v-data-table :headers="headers":items="categorias" density="compact" v-model:sort-by="sortby" >
            
        <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>

            Categorias
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            rounded="lg"
            text="Nueva categoria"
            border
            @click="dialog=true"
        
          ></v-btn>
        </v-toolbar>
        </template>
            
        </v-data-table>


    </v-card>
       
     <table border="1">
        <tr>
            <td>ID</td>
            <td>NOMBRE</td>
            <td>DESCRIPCION</td>
            <td>ACCION</td>
        </tr>
        <tr v-for="cat in categorias">
            <td>{{ cat.id }}</td>
            <td>{{ cat.nombre }}</td>
            <td>{{ cat.descripcion }}</td>
            <td>
                <button>mostrar</button>
                <button @click="funEditarCategoria(cat)">editar</button>
                <button>eliminar</button>


            </td>
        </tr>

    </table>


    <pre>{{ categorias }} </pre>

    <v-dialog v-model="dialog" max-width="500">
    <v-card
      :subtitle="`${categoria.id ? 'Modificar' : 'Crear'} tu categoria`"
      :title="`${categoria.id ? 'Editar' : 'Agregar'} una categoria`"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="categoria.nombre" label="Nombre"></v-text-field>
          </v-col>

          <v-col cols="12" >
            <v-text-field v-model="categoria.descripcion" label="Descripcion"></v-text-field>
          </v-col>

          
          
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancelar" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Guardar" @click="funGurdarCategoria"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>



</template>

<script lang="ts" setup>

import { funListar,funGuardar,funModificar } from '@/router/services/categoria.service';
import type { Categoria } from '@/router/services/interfaces/Categoria';
import { onMounted, ref } from 'vue';


const categorias=ref<Categoria[]>([]);
const categoria=ref<Categoria>({nombre: "", descripcion: ""})

const dialog = ref<boolean>(false)
const sortby=ref<any>([{key:'id', order:'asc'}])

const headers=[
    {title:"ID", key:"id"},
    {title:"NOMBRE", key:"nombre"},
    {title:"DETALLE", key:"descripcion"},
   
]

onMounted(()=>{
    listarCategorias()
})





async function listarCategorias() {
    const {data}= await funListar();
    categorias.value=data;    
}

async function funGurdarCategoria() {
    try {
          if(categoria.value.id){
            await funModificar(categoria.value.id, categoria.value);
            categoria.value={nombre:"", descripcion:""}
            listarCategorias();

          }else{
            await funGuardar(categoria.value);
            categoria.value= {nombre:"", descripcion:""};
            listarCategorias(); 

          }
          dialog.value=false;

        
    } catch (error) {
        console.log(error);
    }
      
}

async function funEditarCategoria(cat:Categoria) {
    categoria.value=cat;
    
}




</script>