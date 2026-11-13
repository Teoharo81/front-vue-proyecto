<template>
   
   <v-container fluid>
    
    <v-card elevation="3" rounded="lg">
         <v-card-title class="text-h5-pa-5">
            Gestion de Usuarios
         </v-card-title>  
         <v-divider> </v-divider>

         <v-card-text>
            <v-row>
                <v-col cols="12">

                    <v-text-field label="Ingrese su correo" type="email" prepend-inner-icon="mdi-email" variant="outlined" density="comfortable" v-model="usuario.email"> </v-text-field>
                  
                </v-col>

                <v-col cols="12" md="4">

                    <v-text-field label="Ingrese su nombre" type="text" prepend-inner-icon="mdi-account" variant="outlined" density="comfortable" v-model="usuario.name"> </v-text-field>
                  
                </v-col>

                 <v-col cols="12" md="4">

                    <v-text-field label="Ingrese su contraseña" type="password" prepend-inner-icon="mdi-lock" variant="outlined" density="comfortable" v-model="usuario.password"> </v-text-field>
                  
                </v-col>

                <v-col cols="12" >

                    <v-btn color="primary" prepend-icon="mdi-content-save" @click="funGuardarUsuario()"> </v-btn>
                    <v-btn color="grey" class="ml-2" variant="outlined">Cancelar </v-btn>
                </v-col>


            </v-row>



        </v-card-text>

        <v-divider> </v-divider>

        <v-data-table :headers="headers" :items="usuarios.data || []" class="elevation-0" item-value="id">

            <template v-slot:item.actions="{item}">
                <v-btn icon="mdi-pencil" color="primary" size="small" variant="text"> </v-btn>
                <v-btn icon="mdi-delete" color="error" size="small" variant="text"> </v-btn>
                        

            </template>

            <template  v-slot:no-data>
                <v-alert>No existen usuarios registrados </v-alert>

            </template>

         </v-data-table>    

    </v-card>


   

   </v-container>  

    <div>
        <label for="">Ingrese su correo</label>
        <input type="email" v-model="usuario.email">
        <br>
        <label for="">Ingrese su nombre</label>
        <input type="text" v-model="usuario.name">
        <br>
        <label for="">Ingrese su contraseña</label>
        <input type="password" v-model="usuario.password">
        <br>
        <v-btn color="primary" @click="funGuardarUsuario()">
         Guardar Usuario
        </v-btn>
    </div>

    <table border="1">
        <thead>
            <tr>
                <td>ID</td>
                <td>NOMBRE</td>
                <td>CORREO</td>
                <td>ACCIONES</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in usuarios.data" key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><button @click="funEditarUsuario(user)">Editar</button>
                    <button @click="funEliminar(user.id)">Eliminar</button>
                </td>
                   
            </tr>
        </tbody>
        




    </table>

    <pre>{{ usuarios }}</pre>
</template>

<script lang="ts" setup>
import { funListar, funGuardar,funModificar } from '@/router/services/usuario.service'
import { onMounted, ref } from "vue";

const headers=[
    {title:"ID", key:"id"},
    {title:"NOMBRE", key:"name"},
    {title:"CORREO", key:"email"},
    {title:"ACCIONES", key:"actions"},
]
const usuarios=ref<any>([]);
const usuario=ref({id:0,email:"",name:"",password:""});


async function funListarUsuarios() {
    const{data}=await funListar();
    usuarios.value=data;
    
}

async function funGuardarUsuario() {
    if(usuario.value.id){
        await funModificar(usuario.value.id,usuario.value)


    }
    await funGuardar(usuario.value);
    funListarUsuarios()
    usuario.value={id:0,email:"",name:"",password:""}
    
}

async function funEditarUsuario(user:any) {
    usuario.value=user;

    
}

async function funEliminar(id:number) {
    if(confirm("Esta seguro de eliminar el registro")){
        await funEliminar(id)

        funListarUsuarios()
    }
    
}

onMounted(()=>{
    funListarUsuarios()
})



</script>