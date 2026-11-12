import dotenv from "dotenv/config"


import app from "./app.js"
import "./config/redis.js"
import db  from "./config/db.js"


const PORT = Number(process.env.PORT)


async function startServer() {
  try {

    await db.connect();

    const server = app.listen(PORT, () => {
      console.log(`App running on Port: ${PORT}`);
    });

    const shutdown = (signal: NodeJS.Signals) => {
      console.log(`${signal} received. Shutting down...`);
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();