import pool from './config/db.js';

const products = [
  {
    name: 'Wireless Earbuds',
    description: 'High-quality sound and long-lasting battery life.',
    price: 2499.99,
    discount: 10.0,
    images: [
      'https://images.unsplash.com/photo-1590658006821-04f4008d5717?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww',
    ],
  },
  {
    name: 'Smart Watch Pro',
    description: 'Fitness tracker with AMOLED display and GPS.',
    price: 6999.0,
    discount: 15.0,
    images: [
      'https://images.unsplash.com/photo-1698729616509-060e8f58e6c0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaGVzfGVufDB8fDB8fHww'
    ],
  },
  {
    name: 'Gaming Laptop X',
    description: 'Powerful laptop with RTX graphics and SSD storage.',
    price: 79999.99,
    discount: 5.0,
    images: [
      'https://images.unsplash.com/photo-1684127987312-43455fd95925?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwbGFwdG9wfGVufDB8fDB8fHww',
    ],
  }
];

const seedProducts = async () => {
  try {
    for (const product of products) {
      const { name, description, price, discount, images } = product;

      await pool.query(
        `INSERT INTO products (name, description, price, discount, images)
         VALUES ($1, $2, $3, $4, $5)`,
        [name, description, price, discount, images]
      );

      console.log(`Inserted: ${name}`);
    }

    console.log('Product seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};

seedProducts();