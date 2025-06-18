import express from "express";
import { createReview,getProductReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reviews",  createReview);
router.get("/products/:productId/reviews",getProductReviews);

export default router;
