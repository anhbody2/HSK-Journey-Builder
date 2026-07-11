import "dotenv/config";
import express, { type Express } from "express";
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
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];

console.log("Current Environment ALLOWED_ORIGINS parsed as2:", allowedOrigins);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve authenticated user for every request
app.use(authMiddleware);

app.use("/api", router);

export default app;
