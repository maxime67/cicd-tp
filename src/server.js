const express = require("express");
const { getGreeting } = require("./greeting");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/hello/:name?", (req, res) => {

  const name = req.params.name;

  res.send(getGreeting(name));
});

app.post("/hello", (req, res) => {
  const name = req.headers["x-name"];

  res.send(getGreeting(name));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
