<template>
    <h1>Mi perfil</h1>
  
    <h2>NOMBRE:{{ perfil.name }}</h2>
    <h2>CORREO:{{ perfil.email }}</h2>
    <h2>CREADO EN :{{ perfil.created_at }}</h2>
    <button @click="funSalir()">CERRAR SESION</button>
</template>

<script lang="ts" setup>
import { obtenerPerfil } from '@/router/services/auth.service';
import { onMounted, ref } from 'vue';

    const perfil=ref<any>({});

    onMounted(async()=>{
         const{data}=await obtenerPerfil();
         perfil.value=data;
    })

    async function funSalir(){
        localStorage.removeItem("access_token");
        await obtenerPerfil();

    }
</script>