const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const express = require("express");
const bearerToken = require("express-bearer-token");
const mustAuth = require("./middlewares/mustAuth");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { json } = require("express");
const Order = require("./models/orders");
const app = express();

const JWT_PASSWORD = "supersecretpassword";

app.use(json());
app.use(cors());
app.use(bearerToken());

// Login : [POST] /auth/login
// Orders: [GET] /orders

app.post("/auth/login", (req, res) => {
  let credentials = req.body;

  if (credentials.email === "alex@test.es" && credentials.password === "test") {
    let payload = {
      id: 1,
      fullname: "Álex Martín",
      profile: "superadmin",
    };

    let token = jwt.sign(payload, JWT_PASSWORD);
    res.json({ token });
  } else {
    res.status(401).json({ mmessage: "Credenciales incorrectas" });
  }
});

app.get("/orders", mustAuth(), async (req, res) => {
	let orders = await Order.find()
  	res.json(orders);
});

app.post("/orders", mustAuth(), async (req, res) => {
  let id = new Date().getTime();
  let title = req.body.title;

  //let newOrder = { id, title, user: req.user.fullname };
  try {
    let newOrder = await new Order({
      title: title,
      user: req.user.fullname,
    }).save();

    res.json(newOrder);
  } catch (e) {
	  res.status(500).json({error: e})
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
