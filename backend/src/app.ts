import cors from "cors";
import express from "express";
import morgan from "morgan";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { gemsRouter } from "./routes/gems.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { usersRouter } from "./routes/users.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/gems", gemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
