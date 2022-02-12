const { Client } = require("pg");

module.exports = class Server {
  constructor() {
    this.client = new Client({
      port: "5432",
      user: "lplqspoubhwcfp",
      database: "d4dchnmqjoj76a",
      host: "ec2-44-193-188-118.compute-1.amazonaws.com",
      password:
        "e24b21c50e5d12be7fa170cd738e5b60d36b06be7de5de8b919fb5f414559386",
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
