const express = require('express');
const { Client } = require('pg'); 
const app = express();

app.use(express.json());


const connectionString = "postgresql://neondb_owner:npg_JxLA6iOHt4kl@ep-steep-field-ahbitz0q-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

const db = new Client({
    connectionString: connectionString,
});

db.connect((err) => {
    if (err) {
        console.error('PostgreSQL Connection Error :', err.stack);
        return;
    }
    console.log('Successfully connected to your live Cloud PostgreSQL Database! ');
});

app.get('/api/products', async (req, res) => {
    try {
        // Double check your table name in Neon. If it's not "products", change it here.
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows); 
    } catch (err) {
        res.status(500).json({ error: "Failed to grab products", details: err.message });
    }
});

app.listen(3000, () => console.log('Jewelry Server running perfectly on port 3000'));
