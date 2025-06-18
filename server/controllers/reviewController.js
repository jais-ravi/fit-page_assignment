import pool  from "../config/db.js";

export const createReview = async (req, res) => {
  const { user_id, product_id, rating, review, image } = req.body;

  if (!user_id || !product_id || (!rating && !review)) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, product_id, rating, review, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, product_id, rating, review, image || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating review: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getProductReviews = async (req,res)=>{
    const {productId} = req.params;

    try {
        const review = await pool.query(
            `SELECT r.*, u.name AS user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE product_id = $1`,
            [productId]
        )

        res.json({
            product_id: productId,
            reviews: review.rows,
        })

    } catch (error) {
        console.error("Error in fetching reviews:",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}