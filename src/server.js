import "dotenv/config";
import http from "http";
import app from "./app.js";
import { connectDB } from "./utils/db_connection.js";

const server = http.createServer(app);

async function startServer() {
    await connectDB();
    server.listen(process.env.PORT, () => {
        console.log("express server started on port", process.env.PORT);
    });
}

startServer();
