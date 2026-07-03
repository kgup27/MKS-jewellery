-- ==========================================
-- MKS E-Commerce Database
-- 4: Constraints
-- ==========================================

-- Sequence Defaults
ALTER TABLE ONLY public.addresses
    ALTER COLUMN address_id SET DEFAULT nextval('public.addresses_address_id_seq'::regclass);

ALTER TABLE ONLY public.categories
    ALTER COLUMN category_id SET DEFAULT nextval('public.categories_id_seq'::regclass);

ALTER TABLE ONLY public.order_items
    ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);

ALTER TABLE ONLY public.payments
    ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);

-- Primary Keys
ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (address_id);

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT unique_user_cart UNIQUE (user_id);

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT unique_user_wishlist UNIQUE (user_id);

-- Foreign Keys
ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cartitems_cart
    FOREIGN KEY (cart_id)
    REFERENCES public.cart(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cartitems_product
    FOREIGN KEY (product_id)
    REFERENCES public.products(product_id);

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_orderitems_order
    FOREIGN KEY (order_id)
    REFERENCES public.orders(order_id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_orderitems_product
    FOREIGN KEY (product_id)
    REFERENCES public.products(product_id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_address
    FOREIGN KEY (address_id)
    REFERENCES public.addresses(address_id);

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id);

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id)
    REFERENCES public.orders(order_id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES public.categories(category_id);

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id)
    REFERENCES public.products(product_id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT fk_wishlist_user
    FOREIGN KEY (user_id)
    REFERENCES public.users(id)
    ON DELETE CASCADE;

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT fk_wishlistitems_product
    FOREIGN KEY (product_id)
    REFERENCES public.products(product_id);

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT fk_wishlistitems_wishlist
    FOREIGN KEY (wishlist_id)
    REFERENCES public.wishlist(id)
    ON DELETE CASCADE;