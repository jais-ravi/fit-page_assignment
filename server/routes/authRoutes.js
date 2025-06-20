import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getMe } from "../controllers/authController.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    console.log(token)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("Cookie set, sending redirect to:", process.env.FRONTEND_URL);

    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

router.get("/me", getMe);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

export default router;
