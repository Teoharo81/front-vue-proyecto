import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import Usuario from '@/views/admin/Usuario.vue'
import Inicio from '@/views/web/Inicio.vue'
import WebLayout from '@/views/layouts/WebLayout.vue'
import AppLayout from '@/views/layouts/AppLayout.vue'
import Perfil from '@/views/admin/Perfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component:WebLayout,
      children:[
      {
         path: '/',
         name: 'home',
         component: Inicio,
       },

      {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/web/Nosotros.vue'),
      },

      {
      path:'/auth',
      children:[
        {
        path:'login',
        name:'login',
        component:LoginView,    
        meta: {redirectIfAuth: true}                                              
        }
       ]
      },
      ]
    },

    {
      path:'/admin',
      component:AppLayout,
      meta: {requireAuth:true},
      children:[
        {
          path: 'perfil',
          name: 'Perfil',
          component: Perfil

        },
        {
           path:'usuario',
           component:Usuario
        }

      ]

    }
    
  ],

});

//guards
router.beforeEach((to,from)=>{

  console.log("VENGO DE:", from.path)
  console.log("ESTOY EN :", to.path)
  const token= localStorage.getItem("access_token");

  if(to.meta.requireAuth){
    if(!token){
      return{name: 'Login'}
    }else{
      return true;
    }
  }

  if(to.meta.redirectIfAuth && token){
    return{name: 'Perfil'}
  }


  return true;

})

export default router
