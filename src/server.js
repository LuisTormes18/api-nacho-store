const express = require("express");
const path = require("path");
const cors = require("cors");

const fetchData = require("./axios");

// Inicializar Expresss
const app = express();
const port = process.env.PORT || 4000;

// cors
app.use(cors());

// logger

// middelwars
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname) + "/public"));

// Routes
app.get("/api/categories/all/", async (req, res) => {
  const resp = await fetchData.get("branches/131/categories/all");
  const data = await resp.data;

  res.json({ categories: data.data });
});

app.get("/api/categories/:idCategory", async (req, res) => {
  let id = req.params.idCategory;
  const resp = await fetchData.get(
    `branches/131/branch-goods?category_id=${id}&with=properties`
  );
  const products = await resp.data;
  const categoryResp = await fetchData.get(`categories/${id}`);

  res.json({ category: categoryResp.data, products: products.data });
});
// Rutas de authenticacion
app.post("/api/login", async (req, res) => {
  let body = req.body;
  // const resp = await fetchData.post("branches/131/send-login-code");
  // const data = await resp.data;
  // console.log(body);
  if (body.email === "myemail@hotmail.com") {
    return res.json({
      user: {
        id: "12345",
        email: "myemail@hotmail.com",
        name: "petra juana",
        phone: "58123345676878",
      },
    });
  }
  res.json({ user: null });
});
app.post("/api/register", async (req, res) => {
  const body = req.body;
  // const resp = await fetchData.post("branches/131/clients");
  // const data = await resp.data;
  res.json({
    user: {
      id: "12345",
      email: body.email || "mailprueba@hotmail.com",
      name: body.name || "nombre prueba",
      phone: body.phone || "04123456789",
    },
  });
});
app.get("/api/horarios", async (req, res) => {
  const resp = await fetchData.get(`branches/131/work-schedules`);
  const data = await resp.data;
  res.json({ horarios: data.data });
});
app.get("/api/search-product/", async (req, res) => {
  const { q } = req.query;
  console.log(q);
  const resp = await fetchData.get(`branches/131/branch-goods/search?q=${q}`);
  const data = await resp.data;

  res.json({ result: data });
});
// Run server
app.listen(port, () => {
  console.log("Server Runing on port " + port);
});

module.exports = app;
