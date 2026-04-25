import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import errorMiddleware from "./middleware/error.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/paymentRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Cookie Parser
app.use(cookieParser());


// Routes
app.use("/api/v1/", productRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", orderRoutes);
app.use("/api/v1/", paymentRoutes);
app.use("/api/v1/", cartRoutes);
app.use("/api/v1/", contactRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error Middleware
app.use(errorMiddleware);

export default app;
