const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const express = require("express");
const bearerToken = require("express-bearer-token");
const mustAuth = require("./middlewares/mustAuth");
const jwt = require("jsonwebtoken");
const firebase = require("firebase");
const cors = require("cors");
const { json } = require("express");
const config = require("./config");
const Order = require("./models/orders");
const app = express();

const JWT_PASSWORD = "supersecretpassword";


firebase.initializeApp(config.firebaseConfig);

app.use(json());
app.use(cors());
app.use(bearerToken());

// Login : [POST] /auth/login
// Orders: [GET] /orders

async function checkEmailAndPassword(email, pass) {
  let auth = await firebase.auth().signInWithEmailAndPassword(email, pass);
  return auth;
}

app.post("/auth/login", async (req, res) => {
  let credentials = req.body;
  try {
    let auth = await checkEmailAndPassword(
      credentials.email,
      credentials.password
    );
   
      let payload = {
        id: auth.user.uid,
        fullname: "Álex Martín",
        profile: "superadmin",
      };

      let token = jwt.sign(payload, JWT_PASSWORD);
      res.json({ token });
   
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});
app.post("/users", (req, res) => {

  // Obtener del request los datos del usuario (p.ej: nombre,a pellidos, email, password, y otros datos adicionaless)
  // Guarda el usuario en firebase con email y password. Firebase me devuelve uid
  // Guardar el resto de datos (nombre, apelidos y otros datos, así como uid) en una tabla de mongo

  /*
  { _id: "id_de_mongo"},
  {uid."id de firebase"},
  {nombre: "nombre del usuario"},
  {apellidos: "apellidos del usuario"},
  {otros: "otros datos del usuario"},
  */
})

app.get("/orders", mustAuth(), async (req, res) => {
  let orders = await Order.find({ uid: req.user.id });
  res.json(orders);
});

app.post("/orders", mustAuth(), async (req, res) => {
  let id = new Date().getTime();
  let title = req.body.title;

  //let newOrder = { id, title, user: req.user.fullname };
  try {
    let newOrder = await new Order({
      title: title,
      uid: req.user.id,
      user: req.user.fullname,
    }).save();

    res.json(newOrder);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

async function connectDatabase() {
  let db = mongoose.connection;


  try {
    await mongoose.connect(config.mongoConfig, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log("Imposible conectar a la base de datos");
    console.log(err);
  }
}

async function init() {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Conectado al puerto ${PORT}`));
}

init();
