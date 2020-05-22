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
        <label>Usuario: <input type="text" v-model="user" ></label>
        <label>Contraseña <input type="password" v-model="pass"></label>
        <button @click="login">Login</button>
    </div>
    <div v-else>
      <button @click="getOrders">Realizar llamada autenticada</button>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      isAuth: false,
      user: "alex@test.es",
      pass: "test"
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
      let response = await this.$http.get("https://pizza-delicious-api.herokuapp.com/orders", config)
      console.log(response.data)
    },
    checkAuth(){
      this.isAuth = window.localStorage.getItem("token")
    },
    logout(){
      window.localStorage.removeItem("token")
      this.checkAuth()
    },
    async login(){
      let loginData = {
        email: this.user,
        password: this.pass
      }
      try{
        let response = await this.$http.post("https://pizza-delicious-api.herokuapp.com/auth/login", loginData)
        window.localStorage.setItem("token",response.data.token)
        this.checkAuth()
      }catch(e){
        console.log("Se ha producido un error")
      }
    }
  },
}
</script>