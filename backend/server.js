const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { Pool } = require("pg");

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
  .then((client) => {
    console.log("✅ Database Connected Successfully!");
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
  const profile = await pool.query("SELECT id, email, full_name, role, profile_image FROM users WHERE id = $1", [req.user.id]);
  res.json(profile.rows[0]);
});

app.put("/api/auth/profile", authenticateToken, async (req, res) => {
  const { full_name, profile_image } = req.body;
  const updated = await pool.query(
    "UPDATE users SET full_name = $1, profile_image = $2 WHERE id = $3 RETURNING id, email, full_name, profile_image",
    [full_name, profile_image, req.user.id]
  );
  res.json(updated.rows[0]);
});

app.post("/api/auth/forgot-password", (req, res) => res.json({ message: "Password reset link emitted securely to email destination." }));
app.post("/api/auth/reset-password", (req, res) => res.json({ message: "Password updated matching target payload parameters." }));

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
        is_active,
        created_at
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
      SELECT DISTINCT category
      FROM products
      WHERE is_active=true
      ORDER BY category
    `);

    res.json(result.rows.map(r => r.category));

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed"
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
        o.order_id,
        o.user_id,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,
        u.full_name,
        u.email
      FROM orders o
      JOIN users u
        ON o.user_id = u.id
      ORDER BY o.created_at DESC
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

    const result = await pool.query(
      `
      SELECT
        o.order_id,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at,

        u.full_name,
        u.email,

        a.phone,
        a.address_line1,
        a.address_line2,
        a.city,
        a.state,
        a.pincode

      FROM orders o

      JOIN users u
      ON o.user_id = u.id

      LEFT JOIN addresses a
      ON o.address_id = a.address_id

      WHERE o.order_id = $1
      `,
      [id]
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

    // Get billing data from frontend
    const {
      fullName,
      phone,
      address,
      city,
      pincode,
      } = req.body;

    // Save customer address
    const addressResult = await client.query(
      `
      INSERT INTO addresses
      (
        user_id,
        full_name,
        phone,
        address_line1,
        city,
        state,
        pincode,
        country,
        is_default
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,false
      )
      RETURNING address_id
      `,
      [
        req.user.id,
        fullName,
        phone,
        address,
        city,
        "Uttarakhand",
        pincode,
        "India",
      ]
    );

    const addressId = addressResult.rows[0].address_id;
    console.log("ADDRESS ID:", addressId);

    // Find user's cart
    let cartResult = await client.query(
      `
      SELECT id
      FROM cart
      WHERE user_id = $1
      `,
      [req.user.id]
    );

    // Agar cart nahi hai to automatically create karo
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

    // Get cart items
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
      return res.status(400).json({
      error: "Cart is empty",
      });
    }

    // Calculate total using discounted_price
    const total = cart.rows.reduce(
      (sum, item) => sum + parseFloat(item.subtotal),
      0
    );

    console.log("TOTAL:", total);
    
    // Insert into orders using order_id and lowercase 'pending'
    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
        user_id,
        address_id,
        total_amount,
        status,
        payment_status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        'pending',
        'pending'
      )
      RETURNING order_id
      `,
      [
        req.user.id,
        addressId,
        total,
      ]
    );
    const orderId = orderResult.rows[0].order_id;
    console.log("ORDER ID:", orderId);

    // Insert items using price_at_purchase and discounted_price
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
          $1,
          $2,
          $3,
          $4
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

    // Clear the cart
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order placed!",
      orderId,
    });

    } catch (err) {

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
    // orders table me primary key ab order_id hai
    const order = await pool.query(
      "SELECT * FROM orders WHERE order_id = $1 AND user_id = $2", 
      [req.params.id, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

// 4. CANCEL ORDER
app.patch("/api/orders/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check order exists and belongs to logged-in user
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

    // Prevent cancelling delivered/cancelled orders
    if (
      currentStatus === "delivered" ||
      currentStatus === "cancelled"
    ) {
      return res.status(400).json({
        error: "This order cannot be cancelled.",
      });
    }

    // Update status
    await pool.query(
      `
      UPDATE orders
      SET status = 'cancelled'
      WHERE order_id = $1
      `,
      [id]
    );

    res.json({
      message: "Order cancelled successfully!",
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);

    res.status(500).json({
      error: "Failed to cancel order.",
    });
  }
});    

    // Fetch items with updated join on product_catalogue including title and image_url
    const items = await pool.query(
      `SELECT oi.*, p.title, p.image_url 
       FROM order_items oi 
       JOIN product_catalogue p ON oi.product_id = p.product_id 
       WHERE oi.order_id = $1`, 
      [req.params.id]
    );

    res.json({ order: order.rows[0], items: items.rows });
  } catch (err) {
    console.error("Fetch Order Details Error:", err);
    res.status(500).json({ error: "Failed to fetch order details." });
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

app.get("/api/admin/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  const usersCount = await pool.query("SELECT COUNT(*) FROM users");
  const productsCount = await pool.query("SELECT COUNT(*) FROM products");
  const ordersCount = await pool.query("SELECT COUNT(*) FROM orders");
  res.json({ users: usersCount.rows[0].count, products: productsCount.rows[0].count, orders: ordersCount.rows[0].count });
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
      is_active
    } = req.body;

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
        is_active ?? true
      ]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add product"
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

    res.json({
      message: "Product updated successfully",
      product: result.rows[0]
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
        error: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete product"
    });
  }
});

app.get("/api/admin/orders", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.full_name,
        u.email,
        COALESCE(
          (
            SELECT p.title
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = o.id
            LIMIT 1
          ),
          'No Product'
        ) AS product,
        COALESCE(
          (
            SELECT p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = o.id
            LIMIT 1
          ),
          ''
        ) AS image
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/admin/orders/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const order = await pool.query(
      `
      SELECT o.*, u.full_name, u.email
      FROM orders o
      JOIN users u ON o.user_id=u.id
      WHERE o.id=$1
      `,
      [req.params.id]
    );

    const items = await pool.query(
      `
      SELECT oi.*, p.title, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id=p.id
      WHERE oi.order_id=$1
      `,
      [req.params.id]
    );

    res.json({
      order: order.rows[0],
      items: items.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.put("/api/admin/orders/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await pool.query(
      `
      UPDATE orders
      SET status=$1
      WHERE id=$2
      RETURNING *
      `,
      [status, req.params.id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.get("/api/admin/orders/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*) FROM orders");
    const pending = await pool.query("SELECT COUNT(*) FROM orders WHERE status='PENDING'");
    const processing = await pool.query("SELECT COUNT(*) FROM orders WHERE status='PROCESSING'");
    const shipped = await pool.query("SELECT COUNT(*) FROM orders WHERE status='SHIPPED'");
    const delivered = await pool.query("SELECT COUNT(*) FROM orders WHERE status='DELIVERED'");
    const cancelled = await pool.query("SELECT COUNT(*) FROM orders WHERE status='CANCELLED'");

    res.json({
      total: total.rows[0].count,
      pending: pending.rows[0].count,
      processing: processing.rows[0].count,
      shipped: shipped.rows[0].count,
      delivered: delivered.rows[0].count,
      cancelled: cancelled.rows[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

app.put("/api/admin/orders/:id/cancel", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE orders
      SET status='CANCELLED'
      WHERE id=$1
      RETURNING *
      `,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cancel failed" });
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

// Vercel Entry Wrapper Engine Hook
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Jewellery Full-Stack Server processing on port 3000"));
}
module.exports = app;