

<template>
        <nav>
        <RouterLink to="/">INICIO</RouterLink> |
        <RouterLink to="/about">ACERCA DE NOSOTROS</RouterLink> |
        <RouterLink to="/auth/login">Ingresar</RouterLink>
      </nav>
 
  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>


<style scoped>

</style>
