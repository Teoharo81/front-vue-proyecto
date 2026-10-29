import axios from "axios"

export const BASE_URL="http://localhost:8000";
//admin@gmail.com
//admin54321

const  BASE_URL_API='${BASE_URL}/api'

const instance=axios.create({
    baseURL:BASE_URL_API,
    timeout:20000
});

//interceptores de peticiones http
export default instance;
