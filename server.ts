import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import clerkWebhook from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import appRoutes from "./routes/index.js";
const app = express();
const port = process.env.PORT || 3000;
// Connect to MongoDB
await connectDB();   
app.post('/api/clerk', express.raw({ type: 'application/json' }),clerkWebhook) 
// Middleware
app.use(cors())
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/v1", appRoutes)
app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
await makeAdmin()
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});