<template>
  <div id="app">
    <h1>Cómo hacer una petición autentificada</h1>
    <ul>
      <li>Creamos un formulario y enviamos al servidor usuario y contraseña</li>
      <li>El servidor verifica si esas credenciales son válidas y devuelve un token JWT</li>
      <li>Guardamos el token en mi navegador (localstorage)</li>
      <li>¡Ya podemos realizar llamadas autenticadas!</li>
      <li>Para realizar llamadas autenticadas mandaremos siempre el token almacenado en localStorage</li>
    </ul>
    <br/>
    <div class="formulario" v-if="!isAuth">
        <div v-if="showLogin">
          <h3>Login <small><a href="#" @click="showLogin=false">¿crear cuenta?</a></small></h3>
           <label>Usuario: <input type="text" v-model="user" ></label>
          <label>Contraseña <input type="password" v-model="pass"></label>
          <button @click="login">Login</button>
        </div>
        <div v-else>
          <h3>Crear cuenta <small><a href="#" @click="showLogin=true">¿ya tienes cuenta?</a></small></h3>
          <label>Usuario: <input type="text" v-model="user" ></label>
          <label>Contraseña <input type="password" v-model="pass"></label>
          <button @click="createUser">Crear cuenta</button>
        </div>
    </div>
    <div v-else>
      <button @click="getOrders">Realizar llamada autenticada</button>
      <button @click="logout">Logout</button>

      <ul>
        <li v-for="item in orders">Pedido {{item.title}} de {{item.user}}</li>
      </ul>

    </div>
  </div>
</template>

<script>

// import firebase from 'firebase'

export default {
  name: 'App',
  data(){
    return {
      isAuth: false,
      user: "alex@test.es",
      pass: "test",
      orders: [],
      showLogin: true
    }
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    async getOrders(){
      let config = {
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("token")}`
        }
      }
      let response = await this.$http.get("http://localhost:3000/orders", config)
      this.orders = response.data
    },
   
    checkAuth(){
      this.isAuth = window.localStorage.getItem("token")!= null
    },
    async createUser(){
      try{
        // let auth = await firebase.auth().createUserWithEmailAndPassword(this.user,this.pass)
        // console.log(auth.user.uid)
      }catch(err){
        alert(err.message)
      }
    },
    async logout(){
      window.localStorage.removeItem("token")
      this.checkAuth()
    },
    async login(){
      let loginData = {
        email: this.user,
        password: this.pass
      }
      try{
        let response = await this.$http.post("http://localhost:3000/auth/login", loginData)
        window.localStorage.setItem("token",response.data.token)
        this.checkAuth()
      }catch(e){
        console.log("Se ha producido un error")
      }
    }
  },
}
</script>