
<template>
  <v-app>
  <v-navigation-drawer  v-model="drawer" :location="$vuetify.display.mobile ? 'left':undefined ">
     <v-list-item title="Mi empresa" subtitle="Sistma de inventarios"></v-list-item>
      <v-divider></v-divider>
      <v-list-item prepend-icon="mdi-account" to="/admin/perfil" link title="Mi Perfil"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group-outline" to="/admin/usuario" link title="Mis Usuarios "></v-list-item>
      <v-list-item prepend-icon="mdi-circle" to="/admin/categoria" link title="Mis Categorias"></v-list-item>
      <v-list-item prepend-icon="mdi-store-outline" to="/admin/sucursal" link title="Mis Sucursales"></v-list-item>
      <v-list-item prepend-icon="mdi-warehouse" to="/admin/almacen" link title="Mis Almacenes"></v-list-item>

       <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="secondary">
              Cerrar Sesion
            </v-btn>
          </div>
        </template>


  </v-navigation-drawer>
  <v-app-bar color="primary">
         <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
           <v-toolbar-title>Inventarios</v-toolbar-title>

          <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>

  </v-app-bar>

  <v-main>
    <div class="ml-16">
      <RouterView/>
    </div>
   
  </v-main>
             


  <!--
      <nav>
        <RouterLink to="/admin/perfil">Perfil</RouterLink> |
        <RouterLink to="/admin/usuario">GESTION USUARIO</RouterLink> |
        <RouterLink to="/admin/categoria">GESTION CATEGORIAS</RouterLink> 
       
      </nav>
    -->


   

  </v-app>
  
    
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const drawer=ref<any>(null)  

</script>
