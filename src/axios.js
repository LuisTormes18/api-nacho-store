const axios = require("axios");

const fetchData = axios.create({
  baseURL: "https://api-dev.dondemand.io/api/v3/companies/119/",
});

module.exports = fetchData;
