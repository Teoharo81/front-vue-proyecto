
<template>
  
      <nav>
        <RouterLink to="/admin/perfil">Perfil</RouterLink> |
        <RouterLink to="/admin/usuario">GESTION USUARIO</RouterLink> |
       
      </nav>





    <RouterView/>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

</script>
