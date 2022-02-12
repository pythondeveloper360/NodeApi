const express = require("express");
const Server = require("./server");

let server = new Server();

const app = express();
app.get("/allposts", (req, res) => {
  server.allPosts().then((result) => {
    res.send(result.rows);
  });
});
app.get("/postBySlug/:slug", (req, res) => {
  if (req.params.slug) {
    server.postBySlug(req.params.slug).then((result) => {
      if (result.rowCount) {
        res.send({ stauts: true, post: result.rows[0] });
      } else {
        res.send({ status: false });
      }
    });
  } else {
    res.send({ status: false });
  }
});

app.post("/authUser", (req, res) => {
  if (req.headers.username && req.headers.password) {
    server
      .authUser(req.headers.username, req.headers.password)
      .then((result) => {
        if (result.rowCount) {
          res.send({ auth: true });
        } else {
          res.send({ auth: false });
        }
      });
  } else {
    res.send({ auth: false });
  }
});

app.listen(process.env.PORT||3000);
