<template>
    <v-container class="login-container fill-height d-flex align-center justify-center"
        fluid>

        <v-card width="450" max-width="95%" elevation="12" rounded="xl" class="pa-6">
            <div class="text-center mb-6">
              
                <v-avatar color="primary" size="75" class="mb-4">
                    <v-icon icon="mdi-account-circle" size="45" color="white"></v-icon>
                </v-avatar>    
                   <h2>Ingresar</h2>
                   <h2 class="text-h4 font-weight-bold text-primary">Bienvenido</h2>   

            </div>

             <v-divider></v-divider>   

                <v-form @submit.prevent="login">
                    <v-text-field v-model="credenciales.email" label="Correo Electronico" type="email" prepend-inner-icon="mdi-email-outline" variant="outlined" color="primary" class="mb-2"></v-text-field>
                    <v-text-field v-model="credenciales.password" label="Contraseña" type="password" prepend-inner-icon="mdi-lock-outline" variant="outlined" color="primary" class="mb-2"></v-text-field>
                    <v-btn type="submit" color="primary" block size="large" rounded="lg" elevation="3" class="mt-4">
                        Iniciar sesion
                    </v-btn>   
                </v-form>
   

        </v-card>  

        
    </v-container>

   <div>
    {{ credenciales }}
   
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
        localStorage.setItem("access_token",data.access_token)
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

<style>
.login-container{
    min-height: 100vh;
}

</style>


