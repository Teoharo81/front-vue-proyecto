<template>
    <h1>Lista de Usuarios</h1>

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