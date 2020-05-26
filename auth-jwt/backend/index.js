const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const express = require("express");
const bearerToken = require("express-bearer-token");
const mustAuth = require("./middlewares/mustAuth");
const jwt = require("jsonwebtoken");
const firebase = require("firebase");
const cors = require("cors");
const { json } = require("express");
const Order = require("./models/orders");
const app = express();

const JWT_PASSWORD = "supersecretpassword";

const firebaseConfig = {
  apiKey: "AIzaSyDepPtuqXIYAXQCLjx4myMMsn4UyrNn6TQ",
  authDomain: "fir-ad324.firebaseapp.com",
  databaseURL: "https://fir-ad324.firebaseio.com",
  projectId: "fir-ad324",
  storageBucket: "fir-ad324.appspot.com",
  messagingSenderId: "749478724956",
  appId: "1:749478724956:web:4fb0f9f091f2d70f9a2d99",
};

firebase.initializeApp(firebaseConfig);

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
  let dbURL =
    "mongodb+srv://demo-user:test@demo-auth-cluster-x1sq0.mongodb.net/test?retryWrites=true&w=majority";
  try {
    await mongoose.connect(dbURL, {
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
