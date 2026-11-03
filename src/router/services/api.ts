import axios from "axios"


//export const BASE_URL="http://localhost:8000";
export const BASE_URL="https://backinventarios.blumbit.net";
//admin@gmail.com
//admin54321

const  BASE_URL_API=`${BASE_URL}/api`

const instance=axios.create({
    baseURL:BASE_URL_API,
    timeout:20000
});

//interceptores(peticion del cliente:equest)
instance.interceptors.request.use((config)=>{
    const token=localStorage.getItem("access_token");

    if(token){
        config.headers.Authorization="Bearer "+token
    }

    return config;
});
//interceptores(respuesta del servidor:response)

instance.interceptors.response.use(
    (resp)=>{
        return resp
    },
    (error)=>{
        if(error.response.status===401){
            localStorage.removeItem("access_token");
            location.href="/auth/login"
        }
        return Promise.reject(error);
    });
    
export default instance;
