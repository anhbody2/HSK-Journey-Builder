import express, { type Express } from "express";
import "dotenv/config";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./lib/auth-middleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
<<<<<<< HEAD
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(",") 
      : "http://localhost:5173",
    credentials: true,
  })
);
=======
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

// 👇 ADD THIS TEMPORARILY TO DEBUG:
console.log("Current Environment ALLOWED_ORIGINS parsed as:", allowedOrigins);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
>>>>>>> f813b4b0fe736b5b722d43a3d97757328e064e9d
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve authenticated user for every request
app.use(authMiddleware);

app.use("/api", router);

export default app;
