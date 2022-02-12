const { Client } = require("pg");

module.exports = class Server {
  constructor() {
    this.client = new Client({
      connectionString:process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    this.client.connect();
  }
  authUser(username, password) {
    return this.client.query({
      text: "select * from users where username = $1 and password = $2",
      values: [username, password],
    });
  }
  allPosts() {
    return this.client.query("select * from post");
  }
  postBySlug(slug) {
    return this.client.query({
      text: "select * from post where slug = $1",
      values: [slug],
    });
  }
};

// let n = new Server();
// n.allPosts()
// .then((res)=>console.log(res.rows))
