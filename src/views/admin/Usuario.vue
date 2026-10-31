<template>
    <h1>Lista de Usuarios</h1>
    {{ usuarios }}
</template>

<script lang="ts" setup>
import { funListar } from '@/router/services/usuario.service'
import { onMounted, ref } from "vue";

const usuarios=ref([]);

async function funListarUsuarios() {
    const{data}=await funListar();
    usuarios.value=data;
    
}
onMounted(()=>{
    funListarUsuarios()
})



</script>