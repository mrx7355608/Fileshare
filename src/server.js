import "dotenv/config";
import http from "http";
import app from "./app.js";

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log("express server started on port", process.env.PORT);
});
