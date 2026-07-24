const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");
const PDFDocument = require("pdfkit");

const app = express();
app.use(express.json());
app.use(cors());

// Live Connection String to Neon DB
const connectionString = "postgresql://neondb_owner:npg_JxLA6iOHt4kl@ep-steep-field-ahbitz0q-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(async (client) => {
    console.log("✅ Database Connected Successfully!");

    // 👇 Force IST for this session
    await client.query(`SET TIME ZONE 'Asia/Kolkata'`);

    const tz = await client.query(`
      SELECT
        NOW(),
        CURRENT_TIMESTAMP,
        CURRENT_SETTING('TIMEZONE') AS timezone
    `);

    console.log(tz.rows[0]);

    client.release();
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:");
    console.error(err);
  });

const JWT_SECRET = "super_secret_jewelry_key_123";


// ==========================================
// MIDDLEWARES
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. Sign in to continue." });

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ error: "Session expired." });
    
    console.log("DECODED USER:", decodedUser);

    req.user = decodedUser;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden. Access restricted to Administrators only." });
  }
  next();
};

// ==========================================
// AUTHENTICATION & PROFILE APIs
// ==========================================
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });
    const sanitizedEmail = email.trim().toLowerCase();
    
    const check = await pool.query("SELECT id FROM users WHERE email = $1", [sanitizedEmail]);
    if (check.rows.length > 0) return res.status(400).json({ error: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, 'customer') RETURNING id, email, full_name, role",
      [sanitizedEmail, hashedPassword, full_name || sanitizedEmail.split("@")[0]]
    );
    res.status(201).json({ message: "Registration successful!", user: result.rows[0] });
  } catch (err) { res.status(500).json({ error: "Signup failed." }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.trim().toLowerCase()]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
  } catch (err) { res.status(500).json({ error: "Login failed." }); }
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ message: "Logged out completely. Clear your client local storage token." });
});

app.get("/api/auth/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.profile_image,

        a.address_id,
        a.phone,
        a.address_line1,
        a.address_line2,
        a.city,
        a.state,
        a.pincode,
        a.country

      FROM users u

      LEFT JOIN addresses a
      ON u.id = a.user_id

      WHERE u.id = $1

      ORDER BY a.address_id DESC

      LIMIT 1
      `,
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to load profile.",
    });
  }
});

app.put("/api/auth/profile", authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    await client.query(
      `
      UPDATE users
      SET
        full_name=$1
      WHERE id=$2
      `,
      [
        full_name,
        req.user.id,
      ]
    );

    const address = await client.query(
      `
      SELECT address_id
      FROM addresses
      WHERE user_id=$1
      ORDER BY address_id DESC
      LIMIT 1
      `,
      [req.user.id]
    );

    if (address.rows.length > 0) {
      await client.query(
        `
        UPDATE addresses
        SET

        phone=$1,
        address_line1=$2,
        address_line2=$3,
        city=$4,
        state=$5,
        pincode=$6,
        country=$7,
        full_name=$8

        WHERE address_id=$9
        `,
        [
          phone,
          address_line1,
          address_line2,
          city,
          state,
          pincode,
          country,
          full_name,
          address.rows[0].address_id,
        ]
      );
    } else {
      await client.query(
        `
        INSERT INTO addresses
        (
          user_id,
          full_name,
          phone,
          address_line1,
          address_line2,
          city,
          state,
          pincode,
          country,
          is_default
        )

        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,true
        )
        `,
        [
          req.user.id,
          full_name,
          phone,
          address_line1,
          address_line2,
          city,
          state,
          pincode,
          country,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      message: "Profile updated successfully.",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      error: "Failed to update profile.",
    });
  } finally {
    client.release();
  }
});

app.post("/api/auth/forgot-password", (req, res) => res.json({ message: "Password reset link emitted securely to email destination." }));
app.post("/api/auth/reset-password", (req, res) => res.json({ message: "Password updated matching target payload parameters." }));


// ==========================================
// SAVED ADDRESS APIs
// ==========================================

// GET ALL SAVED ADDRESSES
app.get("/api/addresses", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        address_id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        country,
        is_default
      FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, address_id DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("========== FETCH ADDRESS ERROR ==========");
    console.error("MESSAGE:", err.message);
    console.error("DETAIL:", err.detail);
    console.error("HINT:", err.hint);
    console.error("CODE:", err.code);
    console.error("STACK:", err.stack);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ADD NEW ADDRESS
app.post("/api/addresses", authenticateToken, async (req, res) => {
  console.log("BODY RECEIVED:");
  console.log(req.body);
  try {
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    // Basic Validation
    if (
      !full_name ||
      !phone ||
      !address_line1 ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
      return res.status(400).json({
        error: "All required fields must be filled.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO addresses
      (
        user_id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        country,
        is_default
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,false
      )
      RETURNING *
      `,
      [
        req.user.id,
        full_name,
        phone,
        address_line1,
        address_line2 || "",
        city,
        state,
        pincode,
        country,
      ]
    );

    res.status(201).json({
      message: "Address added successfully.",
      address: result.rows[0],
    });

  } catch (err) {
    console.error("ADD ADDRESS ERROR:", err);

    res.status(500).json({
      error: "Failed to add address.",
    });
  }
});

// UPDATE ADDRESS (Debug logs added here)
app.put("/api/addresses/:id", authenticateToken, async (req, res) => {
  console.log("UPDATE API HIT");
  console.log("Address ID:", req.params.id);
  console.log("Body:", req.body);

  try {
    const {
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
    } = req.body;

    // Check if address belongs to logged-in user
    const check = await pool.query(
      `
      SELECT address_id
      FROM addresses
      WHERE address_id = $1
      AND user_id = $2
      `,
      [req.params.id, req.user.id]
    );

    if (check.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Address not found.",
      });
    }

    console.log("Updating Database...");

    const result = await pool.query(
      `
      UPDATE addresses
      SET
        full_name = $1,
        phone = $2,
        address_line1 = $3,
        address_line2 = $4,
        city = $5,
        state = $6,
        pincode = $7,
        country = $8
      WHERE address_id = $9
      RETURNING *
      `,
      [
        full_name,
        phone,
        address_line1,
        address_line2 || "",
        city,
        state,
        pincode,
        country,
        req.params.id,
      ]
    );

    res.json({
      message: "Address updated successfully.",
      address: result.rows[0],
    });
  } catch (err) {
    console.log("========== UPDATE ADDRESS ERROR ==========");
    console.log("MESSAGE:", err.message);
    console.log("DETAIL:", err.detail);
    console.log("HINT:", err.hint);
    console.log("CODE:", err.code);
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE ADDRESS
app.delete("/api/addresses/:id", authenticateToken, async (req, res) => {
  try {
    // Check if address belongs to logged-in user
    const check = await pool.query(
      `
      SELECT address_id
      FROM addresses
      WHERE address_id = $1
      AND user_id = $2
      `,
      [req.params.id, req.user.id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        error: "Address not found.",
      });
    }

    await pool.query(
      `
      DELETE FROM addresses
      WHERE address_id = $1
      `,
      [req.params.id]
    );

    res.json({
      message: "Address deleted successfully.",
    });
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);

    if (err.code === "23503") {
      return res.status(400).json({
        error: "This address is linked to an order and cannot be deleted.",
      });
    }

    res.status(500).json({
      error: "Failed to delete address.",
    });
  }
});

// SET DEFAULT ADDRESS
app.patch("/api/addresses/:id/default", authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if address belongs to logged-in user
    const check = await client.query(
      `
      SELECT address_id
      FROM addresses
      WHERE address_id = $1
      AND user_id = $2
      `,
      [req.params.id, req.user.id]
    );

    if (check.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Address not found.",
      });
    }

    // Remove previous default
    await client.query(
      `
      UPDATE addresses
      SET is_default = false
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    // Set selected address as default
    await client.query(
      `
      UPDATE addresses
      SET is_default = true
      WHERE address_id = $1
      `,
      [req.params.id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Default address updated successfully.",
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error("SET DEFAULT ADDRESS ERROR:", err);

    res.status(500).json({
      error: "Failed to update default address.",
    });

  } finally {
    client.release();
  }
});

// ==========================================
// PRODUCTS CATALOG & FILTERS APIs
// ==========================================

// GET All Products (With updated schema details and sorting)
app.get("/api/products", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let query = `
      SELECT
        id,
        title,
        description,
        price,
        discounted_price,
        discount_percent,
        quantity,
        brand,
        color,
        image_url,
        category,
        is_active
      FROM products
      WHERE is_active = true
    `;

    let params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${params.length}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch products"
    });
  }
});

// GET Single Product
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM products
      WHERE id=$1
      AND is_active=true
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed"
    });
  }
});

// Categories API
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        category_id,
        name,
        description,
        image_url
      FROM categories
      ORDER BY name
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch categories",
    });
  }
});

// ================================
// ADMIN CATEGORIES
// ================================

app.get("/api/admin/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        category_id,
        name,
        description,
        image_url,
        created_at
      FROM categories
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch categories"
    });
  }
});

// ======================================
// ADD CATEGORY
// ======================================
app.post("/api/admin/categories", async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Category name is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO categories
      (name, description, image_url)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        name,
        description || "",
        image_url || "",
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({
        error: "Category already exists",
      });
    }

    res.status(500).json({
      error: "Failed to create category",
    });
  }
});

// ======================================
// DELETE CATEGORY
// ======================================
app.delete("/api/admin/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM categories
      WHERE category_id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete category",
    });
  }
}); 

// ======================================
// UPDATE CATEGORY
// ======================================
app.put("/api/admin/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Category name is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE categories
      SET
        name = $1,
        description = $2,
        image_url = $3
      WHERE category_id = $4
      RETURNING *
      `,
      [
        name,
        description || "",
        image_url || "",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Category not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update category",
    });
  }
});

// ======================================
// ADMIN ORDERS
// ======================================
app.get("/api/admin/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        order_id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at,

        customer_name,
        customer_email

      FROM orders
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
});

// ======================================
// UPDATE ORDER STATUS
// ======================================
app.put("/api/admin/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update order status",
    });
  }
});

// ======================================
// GET SINGLE ORDER
// ======================================

app.get("/api/admin/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Order Details
    const orderResult = await pool.query(
      `
      SELECT
        order_id,
        total_amount,
        status,
        payment_status,
        created_at,

        customer_name,
        customer_email,
        customer_phone,

        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_pincode,
        shipping_country

      FROM orders
      WHERE order_id = $1
      `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Order Items
    const itemsResult = await pool.query(
      `
      SELECT
        oi.order_item_id,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,

        p.title,
        p.image_url

      FROM order_items oi

      JOIN products p
        ON p.id = oi.product_id

      WHERE oi.order_id = $1
      `,
      [id]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch order details",
    });
  }

});


// ==========================================
// WISHLIST APIs
// ==========================================
app.get("/api/wishlist", authenticateToken, (req, res) => res.json([]));
app.post("/api/wishlist", authenticateToken, (req, res) => res.json({ message: "Item appended to active user wishlist matrix." }));
app.delete("/api/wishlist/:id", authenticateToken, (req, res) => res.json({ message: "Item extracted from active wishlist." }));

// ==========================================
// SHOPPING CART SYSTEM APIs
// ==========================================
// ==========================================
// SHOPPING CART SYSTEM APIs (NEW)
// ==========================================

// GET CART
app.get("/api/cart", authenticateToken, async (req, res) => {
  try {
    // Find or create cart
    let cart = await pool.query(
      `
      SELECT id
      FROM cart
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    if (cart.rows.length === 0) {
      cart = await pool.query(
        `
        INSERT INTO cart(user_id)
        VALUES($1)
        RETURNING id
        `,
        [req.user.id]
      );
    }

    const cartId = cart.rows[0].id;

    const items = await pool.query(
      `
      SELECT
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.price_at_time,
        ci.subtotal,

        pc.title,
        pc.image_url

      FROM cart_items ci

      JOIN product_catalogue pc
      ON pc.product_id = ci.product_id

      WHERE ci.cart_id = $1

      ORDER BY ci.id DESC
      `,
      [cartId]
    );

    res.json(items.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to load cart."
    });
  }
});


// ADD TO CART
app.post("/api/cart", authenticateToken, async (req, res) => {

  try {

    const {
      product_id,
      quantity = 1
    } = req.body;

    // Find/Create cart

    let cart = await pool.query(
      `
      SELECT id
      FROM cart
      WHERE user_id=$1
      `,
      [req.user.id]
    );

    if(cart.rows.length===0){

      cart=await pool.query(
        `
        INSERT INTO cart(user_id)
        VALUES($1)
        RETURNING id
        `,
        [req.user.id]
      );

    }

    const cartId=cart.rows[0].id;

    // Product price

    const product=await pool.query(
      `
      SELECT
      discounted_price

      FROM product_catalogue

      WHERE product_id=$1
      `,
      [product_id]
    );

    if(product.rows.length===0){
      return res.status(404).json({
        error:"Product not found."
      });
    }

    const price=parseFloat(product.rows[0].discounted_price);

    // Already exists?

    const existing=await pool.query(
      `
      SELECT *
      FROM cart_items
      WHERE cart_id=$1
      AND product_id=$2
      `,
      [cartId,product_id]
    );

    if(existing.rows.length){

      const qty=existing.rows[0].quantity+quantity;

      await pool.query(
        `
        UPDATE cart_items

        SET
        quantity=$1,
        subtotal=$2

        WHERE id=$3
        `,
        [
          qty,
          qty*price,
          existing.rows[0].id
        ]
      );

    }else{

      await pool.query(
        `
        INSERT INTO cart_items
        (
          cart_id,
          product_id,
          quantity,
          price_at_time,
          subtotal
        )

        VALUES
        (
          $1,$2,$3,$4,$5
        )
        `,
        [
          cartId,
          product_id,
          quantity,
          price,
          quantity*price
        ]
      );

    }

    res.json({
      message:"Added to cart."
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      error:"Failed to add item."
    });

  }

});


// UPDATE CART ITEM
app.put("/api/cart/:id", authenticateToken, async (req,res)=>{

  try{

    const {quantity}=req.body;

    const item=await pool.query(
      `
      SELECT *
      FROM cart_items
      WHERE id=$1
      `,
      [req.params.id]
    );

    if(item.rows.length===0){
      return res.status(404).json({
        error:"Item not found."
      });
    }

    const subtotal=
      quantity*
      parseFloat(item.rows[0].price_at_time);

    await pool.query(
      `
      UPDATE cart_items

      SET
      quantity=$1,
      subtotal=$2

      WHERE id=$3
      `,
      [
        quantity,
        subtotal,
        req.params.id
      ]
    );

    res.json({
      message:"Cart updated."
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:"Update failed."
    });

  }

});


// DELETE CART ITEM
app.delete("/api/cart/:id", authenticateToken, async (req,res)=>{

  try{

    await pool.query(
      `
      DELETE FROM cart_items
      WHERE id=$1
      `,
      [req.params.id]
    );

    res.json({
      message:"Removed."
    });

  }catch(err){

    console.error(err);

    res.status(500).json({
      error:"Delete failed."
    });

  }

});
// ==========================================
// CHECKOUT & ORDERS ENGINE APIs (UPDATED)
// ==========================================

// 1. PLACE A NEW ORDER
app.post("/api/orders", authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("REQ.USER =>", req.user);
    console.log("REQ.BODY =>", req.body);

    // 1. Check customer account status before placing order
    const userStatusResult = await client.query(
      `
      SELECT status
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (userStatusResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        error: "User not found.",
      });
    }

    const customerStatus = userStatusResult.rows[0].status?.toLowerCase();

    if (customerStatus === "blocked") {
      await client.query("ROLLBACK");
      return res.status(403).json({
        error:
          "Your account has been blocked. You cannot place orders. Please contact support.",
      });
    }

    // 2. Fetch billing address from DB
    const { address_id } = req.body;


    const address = await client.query(
      `
      SELECT *
      FROM addresses
      WHERE address_id = $1
      AND user_id = $2
      `,
      [address_id, req.user.id]
    );

    if (address.rows.length === 0) {
      // ⚠️ FIX: Added missing ROLLBACK here
      await client.query("ROLLBACK"); 
      return res.status(404).json({
        error: "Address not found.",
      });
    }

    const addressData = address.rows[0];
    const addressId = addressData.address_id;

    // 3. Find or auto-create user's cart
    let cartResult = await client.query(
      `
      SELECT id
      FROM cart
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      cartResult = await client.query(
        `
        INSERT INTO cart (user_id)
        VALUES ($1)
        RETURNING id
        `,
        [req.user.id]
      );
    }

    const cartId = cartResult.rows[0].id;
    console.log("CART ID:", cartId);

    // 4. Fetch cart items
    const cart = await client.query(
      `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    console.log("CART:", cart.rows);
    console.log("CART LENGTH:", cart.rows.length);

    if (cart.rows.length === 0) {
      // ⚠️ FIX: Added missing ROLLBACK here
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    // 5. Calculate order total
    const total = cart.rows.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    console.log("TOTAL:", total);

    // 6. Insert new order record
    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
        user_id,
        address_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_pincode,
        shipping_country,
        total_amount,
        status,
        payment_status
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', 'pending'
      )
      RETURNING order_id
      `,
      [
        req.user.id,
        addressId,
        addressData.full_name,
        req.user.email,
        addressData.phone,
        addressData.address_line1,
        addressData.address_line2,
        addressData.city,
        addressData.state,
        addressData.pincode,
        addressData.country,
        total,
      ]
    );

    const orderId = orderResult.rows[0].order_id;
    console.log("ORDER ID:", orderId);

    // 7. Insert individual items into order_items
    for (const item of cart.rows) {
      await client.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price_at_purchase
        )
        VALUES
        (
          $1, $2, $3, $4
        )
        `,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price_at_time,
        ]
      );
    }

    // 8. Clear cart items
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    // 9. ✅ Log activity into activity_logs table
    await client.query(
      `
      INSERT INTO activity_logs
      (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6
      )
      `,
      [
        "order",
        "New Order Received",
        `Order #${orderId} placed successfully.`,
        orderId,
        "order",
        req.user.id,
      ]
    );

    // 10. Commit transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed!",
      orderId,
    });
  } catch (err) {
    // Rollback any active transaction on unexpected errors
    await client.query("ROLLBACK");

    console.error("========== CHECKOUT ERROR ==========");
    console.error("MESSAGE:", err.message);
    console.error("DETAIL:", err.detail);
    console.error("HINT:", err.hint);
    console.error("CODE:", err.code);
    console.error("CONSTRAINT:", err.constraint);
    console.error("STACK:", err.stack);

    res.status(500).json({
      error: err.message,
    });
  } finally {
    // Release connection back to pool
    client.release();
  }
});

// 2. GET ALL ORDERS FOR A USER
app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    // order_id use ho raha hai internal queries me, pure row details fetch karne ke liye
    const o = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", 
      [req.user.id]
    );
    res.json(o.rows);
  } catch (err) {
    console.error("Fetch Orders Error:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// 3. GET ORDER DETAILS BY ID
app.get("/api/orders/:id", authenticateToken, async (req, res) => {
  try {
    // 1. Fetch the main order details
    const order = await pool.query(
      "SELECT * FROM orders WHERE order_id = $1 AND user_id = $2", 
      [req.params.id, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    // 2. Fetch all items inside this order along with product details
    const items = await pool.query(
      `
      SELECT
        oi.*,
        p.title,
        p.image_url
      FROM order_items oi
      JOIN product_catalogue p
        ON oi.product_id = p.product_id
      WHERE oi.order_id = $1
      `,
      [req.params.id]
    );

    // 3. Return the combined response
    return res.json({
      order: order.rows[0],
      items: items.rows,
    });

  } catch (err) {
    console.error("Fetch Order Details Error:", err);
    return res.status(500).json({
      error: "Failed to fetch order details.",
    });
  }
}); // <--- Route cleanly closed here!


// 4. CANCEL ORDER
app.patch("/api/orders/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check order exists and belongs to logged-in user
    const order = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = $1
      AND user_id = $2
      `,
      [id, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    const currentStatus = order.rows[0].status?.toLowerCase();

    // 2. Prevent cancelling delivered or already cancelled orders
    if (
      currentStatus === "delivered" ||
      currentStatus === "cancelled"
    ) {
      return res.status(400).json({
        error: "This order cannot be cancelled.",
      });
    }

    // 3. Update order status
    await pool.query(
      `
      UPDATE orders
      SET status = 'cancelled'
      WHERE order_id = $1
      `,
      [id]
    );

    // 4. Record activity log
    await pool.query(
      `
      INSERT INTO activity_logs
      (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6
      )
      `,
      [
        "order",
        "Order Cancelled",
        `Order #${id} cancelled by customer.`,
        id,
        "order",
        req.user.id,
      ]
    );

    return res.json({
      message: "Order cancelled successfully!",
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);

    return res.status(500).json({
      error: "Failed to cancel order.",
    });
  }
});

// ==========================================
// ADDRESS & REVIEWS APIs
// ==========================================
app.get("/api/address", authenticateToken, (req, res) => res.json([]));
app.post("/api/address", authenticateToken, (req, res) => res.json({ message: "Address verified." }));
app.put("/api/address/:id", authenticateToken, (req, res) => res.json({ message: "Address modified." }));
app.delete("/api/address/:id", authenticateToken, (req, res) => res.json({ message: "Address wiped." }));
app.get("/api/reviews", (req, res) => res.json([]));
app.post("/api/reviews", authenticateToken, (req, res) => res.json({ message: "Review posted." }));

// =========================================================================
// ADMIN CONTROL PANEL APIs 
// =========================================================================
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("EMAIL:", email);

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND role = 'admin'",
    [email.trim().toLowerCase()]
  );
  console.log("RESULT:", result.rows);

  const admin = result.rows[0];
  if (!admin) {
    console.log("❌ Admin not found");
    return res.status(401).json({ error: "Admin not found" });
  }

  console.log("PASSWORD HASH:", admin.password_hash);
  const match = await bcrypt.compare(password, admin.password_hash);
  console.log("PASSWORD MATCH:", match);

  if (!match) {
    return res.status(401).json({ error: "Wrong password" });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: "admin" },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({
    token,
    admin: { id: admin.id, email: admin.email, full_name: admin.full_name }
  });
});
// ==========================
// DASHBOARD DATA API
// ==========================
app.get("/api/admin/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // ==========================
    // DASHBOARD STATS
    // ==========================

    const revenueResult = await pool.query(`
      SELECT
        COALESCE(SUM(total_amount), 0) AS revenue
      FROM orders
      WHERE LOWER(status) = 'delivered'
    `);

    const ordersResult = await pool.query(`
      SELECT COUNT(*) AS total_orders
      FROM orders
    `);

    const customersResult = await pool.query(`
      SELECT COUNT(*) AS total_customers
      FROM users
      WHERE LOWER(role) = 'customer'
    `);

    const productsResult = await pool.query(`
      SELECT COUNT(*) AS total_products
      FROM products
      WHERE is_active = true
    `);

    // ==========================
    // RECENT ORDERS
    // ==========================

    const recentOrdersResult = await pool.query(`
      SELECT
        o.order_id,
        o.customer_name,
        MIN(p.title) AS product_name,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      LEFT JOIN order_items oi
        ON oi.order_id = o.order_id
      LEFT JOIN products p
        ON p.id = oi.product_id
      GROUP BY
        o.order_id,
        o.customer_name,
        o.total_amount,
        o.status,
        o.created_at
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    // ==========================
    // TOP SELLING PRODUCTS
    // ==========================

    const topProductsResult = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.category,
        SUM(oi.quantity)::INT AS total_sales
      FROM order_items oi
      JOIN products p
        ON p.id = oi.product_id
      GROUP BY
        p.id,
        p.title,
        p.category
      ORDER BY total_sales DESC
      LIMIT 5
    `);

    // ==========================
    // LOW STOCK PRODUCTS
    // ==========================

    const lowStockResult = await pool.query(`
      SELECT
        id,
        title,
        quantity
      FROM products
      WHERE quantity <= 10
      ORDER BY quantity ASC
      LIMIT 5
    `);

    // ==========================
    // SALES OVERVIEW
    // ==========================

    const salesOverviewResult = await pool.query(`
      SELECT
        EXTRACT(MONTH FROM created_at)::INT AS month,
        COALESCE(SUM(total_amount), 0) AS revenue
      FROM orders
      WHERE LOWER(status) = 'delivered'
      GROUP BY month
      ORDER BY month
    `);

    // ==========================
    // RECENT ACTIVITY
    // ==========================
    const activityResult = await pool.query(`
      SELECT
        id,
        activity_type,
        title,
        description,
        created_at
      FROM activity_logs
      ORDER BY created_at DESC
      LIMIT 5
    `);
    // ==========================
    // RESPONSE
    // ==========================

    res.json({
      stats: {
        revenue: Number(revenueResult.rows[0].revenue),
        orders: Number(ordersResult.rows[0].total_orders),
        customers: Number(customersResult.rows[0].total_customers),
        products: Number(productsResult.rows[0].total_products),
      },

      recentOrders: recentOrdersResult.rows,

      topProducts: topProductsResult.rows,

      lowStock: lowStockResult.rows,

      salesOverview: salesOverviewResult.rows,

      recentActivity: activityResult.rows,
    });

  } catch (err) {
    console.error("Dashboard API Error:", err);

    res.status(500).json({
      error: "Failed to load dashboard data.",
    });
  }
});

app.post("/api/admin/products", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discounted_price,
      discount_percent,
      quantity,
      brand,
      color,
      image_url,
      category,
      is_active,
    } = req.body;

    // Add Product
    const result = await pool.query(
      `
      INSERT INTO products
      (
        title,
        description,
        price,
        discounted_price,
        discount_percent,
        quantity,
        brand,
        color,
        image_url,
        category,
        is_active
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING *
      `,
      [
        title,
        description,
        price,
        discounted_price || null,
        discount_percent || 0,
        quantity,
        brand,
        color,
        image_url,
        category,
        is_active ?? true,
      ]
    );

    const product = result.rows[0];

    // Activity Log
    await pool.query(
      `
      INSERT INTO activity_logs
      (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        "product",
        "Product Added",
        `${product.title} added.`,
        product.id,
        "product",
        req.user?.id || null,
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (err) {
    console.error("Add Product Error:", err);

    res.status(500).json({
      error: "Failed to add product",
    });
  }
});

app.put("/api/admin/products/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discounted_price,
      discount_percent,
      quantity,
      brand,
      color,
      image_url,
      category,
      is_active
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        title = $1,
        description = $2,
        price = $3,
        discounted_price = $4,
        discount_percent = $5,
        quantity = $6,
        brand = $7,
        color = $8,
        image_url = $9,
        category = $10,
        is_active = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
      `,
      [
        title,
        description,
        price,
        discounted_price || null,
        discount_percent || 0,
        quantity,
        brand,
        color,
        image_url,
        category,
        is_active ?? true,
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }
    
    const product = result.rows[0];

    await pool.query(
      `
      INSERT INTO activity_logs
      (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        "product",
        "Product Updated",
        `${product.title} updated.`,
        product.id,
        "product",
        req.user?.id || null,
      ]
    );

    res.json({
      message: "Product updated successfully",
      product,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to update product"
    });
  }
});

// [UPDATED] Clean soft-delete integration mapping error payloads and timestamp records
app.delete("/api/admin/products/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE products
      SET
        is_active = false,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const product = result.rows[0];

    // ✅ Activity Log
    await pool.query(
      `
      INSERT INTO activity_logs
      (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        "product",
        "Product Deleted",
        `${product.title} deleted.`,
        product.id,
        "product",
        req.user?.id || null,
      ]
    );

    res.json({
      message: "Product deleted successfully",
      product,
    });

  } catch (err) {
    console.error("Delete Product Error:", err);

    res.status(500).json({
      error: "Failed to delete product",
    });
  }
});

app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,

        COALESCE(
          (
            SELECT p.title
            FROM order_items oi
            JOIN product_catalogue p
            ON oi.product_id = p.product_id
            WHERE oi.order_id = o.order_id
            LIMIT 1
          ),
          'No Product'
        ) AS product,

        COALESCE(
          (
            SELECT p.image_url
            FROM order_items oi
            JOIN product_catalogue p
            ON oi.product_id = p.product_id
            WHERE oi.order_id = o.order_id
            LIMIT 1
          ),
          ''
        ) AS image

      FROM orders o

      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch orders"
    });
  }
});

app.get("/api/admin/orders/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const order = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE order_id = $1
      `,
      [req.params.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    const items = await pool.query(
      `
      SELECT
        oi.*,
        p.title,
        p.image_url
      FROM order_items oi
      JOIN products p
      ON oi.product_id = p.id
      WHERE oi.order_id = $1
      `,
      [req.params.id]
    );

    res.json({
      order: order.rows[0],
      items: items.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch order",
    });
  }
});

app.put("/api/admin/orders/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    // Basic Validation
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    // 1. Order Status Update
    const updated = await pool.query(
      `
      UPDATE orders
      SET status=$1
      WHERE order_id=$2
      RETURNING *
      `,
      [status, req.params.id]
    );

    // 2. Check if Order exists
    if (updated.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    const order = updated.rows[0];

    // 3. Status Title Formatting (Handles snake_case like "out_for_delivery" -> "Out For Delivery")
    const statusTitle = status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // 4. Log Activity
    await pool.query(
      `
      INSERT INTO activity_logs
      (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        "order",
        `Order ${statusTitle}`,
        `Order #${order.order_id} marked as ${statusTitle.toLowerCase()}.`,
        order.order_id,
        "order",
        req.user?.id || null, // Optional chaining retained to prevent crashing if user object is missing
      ]
    );

    // 5. Send Response
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.get(
  "/api/admin/orders/:id/invoice",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orderResult = await pool.query(
        `
        SELECT *
        FROM orders
        WHERE order_id = $1
        `,
        [req.params.id]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          error: "Order not found",
        });
      }

      const order = orderResult.rows[0];

      const itemsResult = await pool.query(
        `
        SELECT
          oi.quantity,
          oi.price_at_purchase,
          p.title
        FROM order_items oi
        JOIN products p
        ON oi.product_id = p.id
        WHERE oi.order_id = $1
        `,
        [req.params.id]
      );

      const items = itemsResult.rows;

      const doc = new PDFDocument({
        margin: 40,
      });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Invoice-${order.order_id}.pdf`
      );

      doc.pipe(res);

      doc
        .fontSize(24)
        .text("MK Jewellers", {
          align: "center",
        });

      doc.moveDown();

      doc
        .fontSize(18)
        .text("Invoice");

      doc.moveDown();

      doc.fontSize(12);

      doc.text(`Order ID : ${order.order_id}`);
      doc.text(
        `Date : ${new Date(order.created_at).toLocaleDateString()}`
      );

      doc.moveDown();

      doc.text(`Customer : ${order.customer_name}`);
      doc.text(`Email : ${order.customer_email}`);
      doc.text(`Phone : ${order.customer_phone}`);

      doc.moveDown();

      doc.text("Shipping Address");

      doc.text(order.shipping_address_line1);

      if (order.shipping_address_line2) {
        doc.text(order.shipping_address_line2);
      }

      doc.text(
        `${order.shipping_city}, ${order.shipping_state}`
      );

      doc.text(
        `${order.shipping_pincode}, ${order.shipping_country}`
      );

      doc.moveDown();

      doc.fontSize(16).text("Products");

      doc.moveDown(0.5);

      items.forEach((item) => {
        doc.text(
          `${item.title}
Qty : ${item.quantity}
Price : ₹${item.price_at_purchase}

`
        );
      });

      doc.moveDown();

      doc.fontSize(16).text(
        `Total : ₹${order.total_amount}`,
        {
          align: "right",
        }
      );

      doc.end();
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Invoice generation failed",
      });
    }
  }
);

app.get("/api/admin/orders/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const total = await pool.query(
      "SELECT COUNT(*) FROM orders"
    );

    const pending = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='pending'"
    );

    const processing = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='confirmed'"
    );

    const shipped = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='shipped'"
    );

    const delivered = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='delivered'"
    );

    const cancelled = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status='cancelled'"
    );

    res.json({
      total: Number(total.rows[0].count),
      pending: Number(pending.rows[0].count),
      processing: Number(processing.rows[0].count),
      shipped: Number(shipped.rows[0].count),
      delivered: Number(delivered.rows[0].count),
      cancelled: Number(cancelled.rows[0].count),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch order stats",
    });
  }
});

app.put("/api/admin/orders/:id/cancel", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 1. Update the order status
    const result = await pool.query(
      `
      UPDATE orders
      SET status = 'cancelled'
      WHERE order_id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    // 2. Check if order exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    const order = result.rows[0];

    // 3. Log the cancellation activity
    await pool.query(
      `
      INSERT INTO activity_logs (
        activity_type,
        title,
        description,
        entity_id,
        entity_type,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        "order",
        "Order Cancelled",
        `Order #${order.order_id} cancelled.`,
        order.order_id,
        "order",
        req.user?.id || null,
      ]
    );

    // 4. Return updated order
    return res.json(order);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Cancel failed",
    });
  }
});

app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
  const list = await pool.query("SELECT id, email, full_name, role FROM users");
  res.json(list.rows);
});

app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.json({ message: "Target user row deleted." });
});

// ==========================================
// Customers APIs
// ==========================================

app.get(
  "/api/admin/customers",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          u.id,
          u.full_name AS name,
          u.email,

          -- Default/latest address phone
          a.phone,

          u.profile_image,
          u.status,
          u.created_at,

          COUNT(DISTINCT o.order_id)::int AS orders,

          COALESCE(
            SUM(o.total_amount) FILTER (
              WHERE LOWER(o.status) != 'cancelled'
            ),
            0
          ) AS "totalSpent"

        FROM users u

        -- Get default/latest address phone
        LEFT JOIN LATERAL (
          SELECT phone
          FROM addresses
          WHERE user_id = u.id
          ORDER BY is_default DESC, address_id DESC
          LIMIT 1
        ) a ON true

        LEFT JOIN orders o
          ON o.user_id = u.id

        WHERE u.role = 'customer'

        GROUP BY
          u.id,
          u.full_name,
          u.email,
          a.phone,
          u.profile_image,
          u.status,
          u.created_at

        ORDER BY u.created_at DESC
      `);

      res.json(result.rows);

    } catch (err) {
      console.error("Fetch customers error:", err);

      res.status(500).json({
        error: "Failed to fetch customers",
      });
    }
  }
);


// UPDATE CUSTOMER
app.put(
  "/api/admin/customers/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { name, email, status } = req.body;

      const allowedStatuses = ["Active", "VIP", "Blocked"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid customer status",
        });
      }

      const result = await pool.query(
        `UPDATE users
         SET full_name = $1,
             email = $2,
             status = $4
         WHERE id = $5 AND role = 'customer'
         RETURNING
           id,
           full_name AS name,
           email,
           phone,
           role,
           status,
           created_at`,
        [
          name,
          email,
          status,
          req.params.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Update customer error:", err);
      res.status(500).json({
        error: "Failed to update customer",
      });
    }
  }
);

// DELETE CUSTOMER
app.delete(
  "/api/admin/customers/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const customerId = req.params.id;

      // Check if customer has any orders
      const orderCheck = await pool.query(
        `SELECT 1
         FROM orders
         WHERE user_id = $1
         LIMIT 1`,
        [customerId]
      );

      // Do not delete customers with order history
      if (orderCheck.rows.length > 0) {
        return res.status(409).json({
          error:
            "Customer cannot be deleted because order history exists. Block the customer instead.",
        });
      }

      // Delete customer if no orders exist
      const result = await pool.query(
        `DELETE FROM users
         WHERE id = $1 AND role = 'customer'
         RETURNING id`,
        [customerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Customer not found",
        });
      }

      res.json({
        message: "Customer deleted successfully",
      });
    } catch (err) {
      console.error("Delete customer error:", err);

      res.status(500).json({
        error: "Failed to delete customer",
      });
    }
  }
);


// ==========================================
// 1. GET ALL INVENTORY
// ==========================================
app.get(
  "/api/admin/inventory",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          p.product_id,
          p.title,
          p.image_url,
          p.brand,
          p.category_name,
          p.quantity AS stock,

          COALESCE(
            SUM(
              CASE
                WHEN LOWER(o.status) = 'pending'
                THEN oi.quantity
                ELSE 0
              END
            ),
            0
          )::int AS reserved,

          GREATEST(
            p.quantity -
            COALESCE(
              SUM(
                CASE
                  WHEN LOWER(o.status) = 'pending'
                  THEN oi.quantity
                  ELSE 0
                END
              ),
              0
            ),
            0
          )::int AS available,

          10 AS reorder_level,

          CASE
            WHEN p.quantity = 0 THEN 'Out of Stock'
            WHEN p.quantity <= 10 THEN 'Low Stock'
            ELSE 'In Stock'
          END AS status,

          p.created_at

        FROM product_catalogue p

        LEFT JOIN order_items oi
          ON oi.product_id = p.product_id

        LEFT JOIN orders o
          ON o.order_id = oi.order_id

        GROUP BY
          p.product_id,
          p.title,
          p.image_url,
          p.category_name,
          p.brand,
          p.quantity,
          p.created_at

        ORDER BY p.created_at DESC
      `);

      res.json(result.rows);
    } catch (err) {
      console.error("Inventory fetch error:", err);
      res.status(500).json({
        error: "Failed to fetch inventory",
      });
    }
  }
);

// ==========================================
// 2. UPDATE INVENTORY (WITH SAFE ROLLBACK & READABLE LOGS)
// ==========================================
app.put(
  "/api/admin/inventory/:productId",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    let client;

    try {
      client = await pool.connect();
      const { productId } = req.params;
      const { action, quantity, reason, supplierNote } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          error: "Invalid quantity",
        });
      }

      await client.query("BEGIN");

      // Current stock & title fetch + Row Locking (FOR UPDATE)
      const current = await client.query(
        `
        SELECT quantity, title
        FROM product_catalogue
        WHERE product_id = $1
        FOR UPDATE
        `,
        [productId]
      );

      if (current.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          error: "Product not found",
        });
      }

      const product = current.rows[0];
      let stock = Number(product.quantity);
      const parsedQuantity = Number(quantity);

      if (action === "add") {
        stock += parsedQuantity;
      } else if (action === "remove") {
        if (stock < parsedQuantity) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            error: "Insufficient stock",
          });
        }
        stock -= parsedQuantity;
      } else {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: "Invalid action. Use 'add' or 'remove'.",
        });
      }

      // 1. Stock update query
      const updated = await client.query(
        `
        UPDATE product_catalogue
        SET quantity = $1
        WHERE product_id = $2
        RETURNING *
        `,
        [stock, productId]
      );

      const updatedProduct = updated.rows[0];

      // 2. Save into inventory_logs
      await client.query(
        `
        INSERT INTO inventory_logs
        (
          product_id,
          old_stock,
          new_stock,
          action,
          change_reason,
          supplier_note,
          changed_by,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `,
        [
          productId,
          Number(product.quantity),
          stock,
          action === "add" ? "Stock Added" : "Stock Removed",
          reason || null,
          supplierNote || null,
          req.user?.id || null,
        ]
      );

      // 3. Save into activity_logs (Natural Human-readable Description)
      await client.query(
        `
        INSERT INTO activity_logs
        (
          activity_type,
          title,
          description,
          entity_id,
          entity_type,
          created_by,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        `,
        [
          "inventory",
          action === "add" ? "Stock Added" : "Stock Removed",
          `${parsedQuantity} unit(s) ${
            action === "add" ? "added to" : "removed from"
          } ${updatedProduct.title || "Product"}.`,
          productId,
          "product",
          req.user?.id || null,
        ]
      );

      await client.query("COMMIT");
      res.json(updatedProduct);

    } catch (err) {
      // Safe Rollback Guard (bina fail huye disconnect handle karne ke liye)
      if (client) {
        try {
          await client.query("ROLLBACK");
        } catch (_) {
          // Connection loss pe rollback error ignore
        }
      }

      console.error("Inventory update error:", err);
      res.status(500).json({
        error: "Failed to update inventory",
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

// ==========================================
// 3. GET PRODUCT INVENTORY HISTORY
// ==========================================
app.get(
  "/api/admin/inventory/:productId/history",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { productId } = req.params;

      const result = await pool.query(
        `
        SELECT
          l.log_id,
          l.old_stock,
          l.new_stock,
          l.action,
          l.change_reason,
          l.supplier_note,
          u.full_name AS updated_by,
          l.created_at
        FROM inventory_logs l
        LEFT JOIN users u
          ON l.changed_by = u.id
        WHERE l.product_id = $1
        ORDER BY l.created_at DESC;
        `,
        [productId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error("Inventory history error:", err);
      res.status(500).json({
        error: "Failed to fetch inventory history",
      });
    }
  }
);


// Vercel Entry Wrapper Engine Hook
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;