const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const qs = require("querystring");

const server = http.createServer();

server.on("request", async (req, res) => {
  const parts = url.parse(req.url, true);

  res.writeHead(200, { "content-type": "text/html" });
  switch (parts.pathname) {
    case "/message":
      if (req.method === "POST") {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        const message = qs.parse(data);
        const ws = fs.createWriteStream(path.join(__dirname, "messages.json"), {
          flags: "a+",
        });
        ws.write(JSON.stringify(message));
      }
    case "/contact":
      const rs = fs.createReadStream(
        path.join(__dirname, "contact.html"),
        "utf-8"
      );
      rs.pipe(res);
      break;
    default:
      const rs1 = fs.createReadStream(
        path.join(__dirname, "index.html"),
        "utf-8"
      );
      rs1.pipe(res);
  }
});

server.on("error", (error) => {
  console.error(error.message);
});

server.listen(3000);
