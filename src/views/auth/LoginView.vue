<template>
   <div>
    {{ credenciales }}
    <h1>Ingresar</h1>
    <label for="">Ingrese su correo</label>
    <input type="email" v-model="credenciales.email">
    {{ errors.email }}
    <br>
    <label for="">Ingrese su contraseña</label>
    <input type="password" v-model="credenciales.password">
    {{ errors.password }}
    <br>
    <button @click="login()">Iniciar sesion</button>

   </div>
   
</template>

<script lang="ts" setup>
import { loginConlaravel } from '@/router/services/auth.service'
import { ref } from "vue";
import { useRouter } from 'vue-router';

const credenciales=ref({email:"",password:""});
const errors=ref<any>({});
//para navegar entre paginas
const router=useRouter();

async function login() {

    try{
        const {data} = await loginConlaravel(credenciales.value.email, credenciales.value.password);
    
        console.log(data);
        //alert("Bienvenido....")
        router.push("/admin/usuario");

    }catch(error:any){
        console.log("********:", error.response);
        if(error.response.status===422){
            console.log(error.response.data)
            errors.value=error.response.data.errors;
            alert(error.response.data.message)
        }else{
            alert(error.response.data.message)
        }

    }
    
   
}



</script>
