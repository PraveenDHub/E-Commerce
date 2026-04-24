import app from './app.js';
import {connectDB} from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB();


process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
})

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejection`);
    server.close(()=>{
        process.exit(1);
    })
})