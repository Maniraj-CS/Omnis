import { Pool } from "pg"


const isProduction = process.env.NODE_ENV === "production";

const DATABASE_URL = isProduction
  ? process.env.DATABASE_URL
  : "postgresql://app_user:local_password@localhost:5432/app_db";


if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

const db = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});


// Check database connection
db.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

db.on("connect", () => {
  console.log("Database connected");
});

export default db