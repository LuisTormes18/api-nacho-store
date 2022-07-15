const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");

// Inicializar Expresss
const app = express();
const port = process.env.PORT || 4000;

// cors
app.use(cors());

// Logger
app.use(logger("dev"));

// middelwars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/", express.static(path.join(__dirname) + "/public"));

// Routes
const fetchData = require("./src/axios");

app.get("/api/categories/all/", async (req, res) => {
  fetchData
    .get("branches/131/categories/all")
    .then((resp) => {
      const data = resp.data;
      return res.json({ ok: true, categories: data.data });
    })
    .catch((err) => {
      console.log("error");
      return res.json({ ok: false, categories: [] });
    });
});

app.get("/api/categories/:idCategory", async (req, res) => {
  let id = req.params.idCategory;

  const getProducts = fetchData.get(
    `branches/131/branch-goods?category_id=${id}&with=properties`
  );
  const getCategory = fetchData.get(`categories/${id}`);

  Promise.all([getProducts, getCategory])
    .then((resp) => {
      const [categoryResp, productsResp] = resp;

      return res.json({
        ok: true,
        category: categoryResp.data,
        products: productsResp.data.data,
      });
    })
    .catch((err) => {
      console.log("error");
      return res.json({ ok: false, category: null, products: [] });
    });
});

app.post("/api/auth/send-email", async (req, res) => {
  let body = req.body;
  // const resp = await fetchData.post("branches/131/send-login-code");
  // const data = await resp.data;
  if (body.email === "mail@prueba.com") {
    return res.json({
      ok: true,
      message: "Login successfull",
      existEmail: true,
    });
  }
  res.json({
    ok: true,
    message: "no existe un usuario con ese email",
    existEmail: false,
  });
});
app.post("/api/auth/send-code-login", async (req, res) => {
  let body = req.body;
  // const resp = await fetchData.post("branches/131/send-login-code");
  // const data = await resp.data;
  return res.json({
    ok: true,
    user: {
      id: "12345",
      email: "myemail@hotmail.com",
      name: "Prueba juana",
      phone: "041292345678",
    },
  });
});
app.post("/api/auth/register", async (req, res) => {
  const body = req.body;
  // const resp = await fetchData.post("branches/131/clients");
  // const data = await resp.data;
  res.json({ ok: true, message: "user register successfull" });
});

app.get("/api/horarios", async (req, res) => {
  fetchData
    .get(`branches/131/work-schedules`)
    .then((resp) => {
      const data = resp.data;
      return res.json({ horarios: data.data });
    })
    .catch((err) => {
      console.log("error");
      return res.json({ ok: false, horarios: null });
    });
});

app.get("/api/search-product/", async (req, res) => {
  const { q } = req.query;
  fetchData
    .get(`branches/131/branch-goods/search?q=${q}`)
    .then((resp) => {
      const data = resp.data;
      res.json({ ok: true, result: data });
    })
    .catch((err) => {
      console.log("error");
      return res.json({ ok: false, result: null });
    });
});
// Run server
app.listen(port, () => {
  console.log("Server Runing on port " + port);
});
app.get("*", (req, res) => {
  res.send({ ok: true, message: "WellCome To Api desde heroku!" });
});

module.exports = app;
