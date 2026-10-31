import express from "express";
import cors from "cors";
import healthRoutes from "./routers/health.routes.js";
import authRoutes from "./routers/auth.routes.js";
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/not-found.middleware.js";
import { env } from "./config/env.js";


const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;