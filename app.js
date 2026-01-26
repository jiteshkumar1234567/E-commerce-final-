const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const User = require("./Models/user-model");

const indexRouter = require("./Routes/index.js");
const ownersRouter = require("./Routes/ownersRouter");
const usersRouter = require("./Routes/usersRouter");
const productsRouter = require("./Routes/productsRouter");
const cartRouter = require("./Routes/cartRouter");
const checkoutRouter = require("./Routes/checkoutRouter");



require("dotenv").config();  // dotenv load karo

const db = require("./config/mongoose-connection");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ------------------------
// SESSION SETUP
// ------------------------
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Make session info available in all EJS views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.owner = req.session.owner || null;
  next();
});

app.use(async (req, res, next) => {
  try {
    if (req.session.user) {
      const user = await User.findById(req.session.user.id);
      // user null check
      res.locals.cartCount = user ? user.cart.length : 0;
    } else {
      res.locals.cartCount = 0;
    }
  } catch (err) {
    console.error("Error fetching user cart:", err);
    res.locals.cartCount = 0; // fallback
  }
  next();
});


// ------------------------
// ROUTES
// ------------------------
app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
