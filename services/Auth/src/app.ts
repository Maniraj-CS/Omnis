import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

const ALLOWED_ORIGINS = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
);

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
   
    if (!origin) return cb(null, true);

   
    if (ALLOWED_ORIGINS.has(origin)) return cb(null, true);

   
    return cb(null, false);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Idempotency-Key", "X-CSRF-Token"],
  maxAge: 600, 
};

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions)); // preflight support
app.use(express.json());
app.use(cookieParser());


// Routes
import authRouter from "./routers/auth.routes.js"


app.use("/api/v1/auth" , authRouter);


export default app