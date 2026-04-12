import "./config/dotenv.js";
import express from "express";
import productRoutes from "./routes/productRoutes.js";
import errorMiddleware from "./middleware/error.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import paymentRoutes from "./routes/paymentRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Cookie Parser
app.use(cookieParser());
// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
);

// Routes
app.use("/api/v1/", productRoutes);
app.use("/api/v1/", userRoutes);
app.use("/api/v1/", orderRoutes);
app.use("/api/v1/", paymentRoutes);
app.use("/api/v1/", cartRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error Middleware
app.use(errorMiddleware);

export default app;
