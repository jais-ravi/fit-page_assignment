import pool from "../config/db.js";


export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};