import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import  session  from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser"

import "./config/passport.js"
import reviewRoutes from "./routes/reviewRoutes.js";
import authRouters from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({origin: process.env.FRONTEND_URL, credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)
app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res)=>{
    res.status(200).json({message:"Server is Running!"})
})
app.use("/api",reviewRoutes);
app.use("/api/auth",authRouters);
app.use("/api/products", productRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})