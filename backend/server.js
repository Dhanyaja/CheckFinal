import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import deckRouter from "./routes/deckRoute.js";
import cardRouter from "./routes/cardRoute.js";
import analyticsRouter from "./routes/analyticsRoute.js";
import 'dotenv/config';
import path from "path";

// app config
const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/deck", deckRouter)
app.use("/api/card", cardRouter)
app.use("/api/analytics", analyticsRouter);


// ✅ Serve static files from React frontend build
app.use(express.static(path.join(__dirname, "client", "build")));

// ✅ Serve index.html for all unmatched routes (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});




app.get('/', (req, res) => {
    res.send("API working")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})

// mongodb+srv://dhanyaja2003:Dha_2003@cluster0.coau0dy.mongodb.net/?