<template>
   <div>
    <h1>Ingresar</h1>
    <button click="login()">Iniciar sesion</button>

   </div>
   
</template>

<script lang="ts" setup>
import { loginConlaravel } from '@/router/services/auth.service'

async function login() {
    const {data} = await loginConlaravel("prueba@mail.com","admin54321");
    
    console.log(data);
}



</script>
