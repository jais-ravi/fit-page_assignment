import passport from "passport";
import GooglStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import { findOrCreateUser } from "../controllers/authController.js";

dotenv.config();


passport.use(
    new GooglStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:"/api/auth/google/callback",
        },
        async (accessToken,refreshToken,profile,done) => {

            try {
                const user = await findOrCreateUser(profile);
                done(null,user);
            } catch (error) {
                done(error,null)
            }

            
        }
    )
)