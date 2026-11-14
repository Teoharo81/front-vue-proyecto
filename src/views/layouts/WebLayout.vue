<template>
    <v-app>
      <v-app-bar color="primary" elevation="4" height="70">
        <v-container class="s-flex align-center">
         <v-toolbar-title class="font-weight-bold">
            Mi Aplicacion
         </v-toolbar-title>

         <v-spacer></v-spacer>

         <v-btn to="/inicio" variant="text" color="white">
           INICIO
         </v-btn >

         <v-btn to="/about" variant="text" color="white">
           ACERCA DE NOSOTROS
         </v-btn>

         <v-btn to="/auth/login" variant="text" color="white">
            INGRESAR
         </v-btn>

        </v-container>
      </v-app-bar>

      <v-main>
        <v-container>
          <RouterView/>
        </v-container>
      </v-main>

    </v-app>
        
    
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';

</script>