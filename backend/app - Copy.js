import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import errorMiddleware from './middleware/error.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

dotenv.config({path: './backend/config/config.env'});

const app = express();


// Middleware
app.use(express.json());
// Cookie Parser
app.use(cookieParser());
// File Upload
app.use(fileUpload({useTempFiles: true,tempFileDir: '/tmp/'}));

// Routes
app.use('/api/v1/', productRoutes);
app.use('/api/v1/',userRoutes);
app.use('/api/v1/',orderRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error Middleware
app.use(errorMiddleware);

export default app;