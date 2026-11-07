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
</template>

<script lang="ts" setup>

import { funListar,funGuardar,funModificar } from '@/router/services/categoria.service';
import type { Categoria } from '@/router/services/interfaces/Categoria';
import { onMounted, ref } from 'vue';


const categorias=ref<Categoria[]>([]);
const categoria=ref<Categoria>({nombre: ""})

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
            categoria.value={nombre:""}
            listarCategorias();

          }else{
            await funGuardar(categoria.value);
            categoria.value= {nombre:""};
            listarCategorias(); 

          }

        
    } catch (error) {
        console.log(error);
    }
      
}

async function funEditarCategoria(cat:Categoria) {
    categoria.value=cat;
    
}




</script>