import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { setUpSocketHandler } from "./socket/socketHandle";

dotenv.config();

import app from "./app";

const server = http.createServer(app);

const PORT = process.env["PORT"] || 8080;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

setUpSocketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
