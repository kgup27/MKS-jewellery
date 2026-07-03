-- ==========================================
-- MKS E-Commerce Database
-- 5: Sample Data
-- ========================================== 
 
 
COPY public.addresses (address_id, user_id, address_line1, city, state, pincode, country, full_name, phone, address_line2, is_default) FROM stdin;
1	dc856d9c-6adf-452c-9cca-c387afc7bb75	12 MG Road	Haldwani	Uttarakhand	263139	India	\N	\N	\N	f
2	842e2264-61c7-4942-bd7f-6f86bd7a9e19	45 Gandhi Nagar	Dehradun	Uttarakhand	248001	India	\N	\N	\N	f
\.

--

COPY public.cart (id, user_id, created_at, updated_at) FROM stdin;
c0000001-0000-0000-0000-000000000001	dc856d9c-6adf-452c-9cca-c387afc7bb75	2026-07-02 15:10:07.544408	2026-07-02 15:10:07.544408
c0000002-0000-0000-0000-000000000002	842e2264-61c7-4942-bd7f-6f86bd7a9e19	2026-07-02 15:10:07.544408	2026-07-02 15:10:07.544408
\.


COPY public.cart_items (id, cart_id, product_id, quantity, price_at_time, subtotal) FROM stdin;
a7d4fb64-1b5b-4833-9a4c-65a3c21de5e2	c0000001-0000-0000-0000-000000000001	541753f3-e331-4cf5-9aac-e11788459482	1	15999.00	15999.00
8a10eb11-c234-4a4d-8d9e-5925845c0a1b	c0000001-0000-0000-0000-000000000001	7c08e56b-725b-4745-917f-2afdb1f686bc	2	2999.00	5998.00
587b2b86-8c54-4206-80b2-dedeed46cd84	c0000002-0000-0000-0000-000000000002	557dae67-9840-4d6f-820d-dd49a6b89177	1	45000.00	45000.00
\.

--

COPY public.categories (category_id, name, description, image_url, created_at) FROM stdin;
1	Rings	Gold and diamond rings	rings.jpg	2026-07-01 15:21:09.49502
2	Necklaces	Traditional and modern necklaces	necklaces.jpg	2026-07-01 15:21:09.49502
3	Earrings	Studs, hoops and jhumkas	earrings.jpg	2026-07-01 15:21:09.49502
4	Bracelets	Gold and silver bracelets	bracelets.jpg	2026-07-01 15:21:09.49502
\.

--

COPY public.order_items (order_item_id, order_id, product_id, quantity, price_at_purchase) FROM stdin;
1	01eecaf7-3fe2-44f5-bfdb-5d7f3e6e96ad	541753f3-e331-4cf5-9aac-e11788459482	1	15999.00
2	6564f3ff-f65d-49f5-a78f-54e9c66bd2f9	7c08e56b-725b-4745-917f-2afdb1f686bc	1	12000.00
3	01eecaf7-3fe2-44f5-bfdb-5d7f3e6e96ad	7c08e56b-725b-4745-917f-2afdb1f686bc	2	15999.00
\.

--

COPY public.orders (order_id, user_id, address_id, total_amount, status, created_at, payment_status, order_status, shipping_address, order_date, updated_at) FROM stdin;
01eecaf7-3fe2-44f5-bfdb-5d7f3e6e96ad	dc856d9c-6adf-452c-9cca-c387afc7bb75	1	15999.00	delivered	2026-07-01 15:28:15.355031	pending	pending	\N	2026-07-02 16:01:05.890324	2026-07-02 16:01:05.890324
6564f3ff-f65d-49f5-a78f-54e9c66bd2f9	842e2264-61c7-4942-bd7f-6f86bd7a9e19	2	14999.00	cancelled	2026-07-01 15:28:15.355031	pending	pending	\N	2026-07-02 16:01:05.890324	2026-07-02 16:01:05.890324
\.


--
COPY public.payments (payment_id, order_id, payment_method, payment_status, paid_at, transaction_id, amount) FROM stdin;
1	01eecaf7-3fe2-44f5-bfdb-5d7f3e6e96ad	UPI	completed	2026-07-01 15:35:41.555609	\N	\N
2	6564f3ff-f65d-49f5-a78f-54e9c66bd2f9	COD	pending	\N	\N	\N
\.

--

COPY public.products (product_id, category_id, name, description, base_price, metal_type, gemstone, weight_grams, stock_quantity, image_url, created_at, sku, brand, discount_price, rating, is_active, updated_at) FROM stdin;
557dae67-9840-4d6f-820d-dd49a6b89177	2	Kundan Necklace	Traditional kundan set	45000.00	Gold	Kundan	25.00	5	necklace1.jpg	2026-07-01 15:21:37.589174	\N	\N	\N	0.00	t	2026-07-02 16:00:55.80138
b04cbf7f-62e6-40ba-b539-758cb08bc366	3	Diamond Studs	18kt gold diamond studs	12000.00	Gold	Diamond	2.00	15	earring1.jpg	2026-07-01 15:21:37.589174	\N	\N	\N	0.00	t	2026-07-02 16:00:55.80138
4614703c-2120-42de-a746-4c268731bbee	4	Gold Bracelet	Delicate gold chain bracelet	8500.00	Gold	None	6.00	8	bracelet1.jpg	2026-07-01 15:21:37.589174	\N	\N	\N	0.00	t	2026-07-02 16:00:55.80138
7c08e56b-725b-4745-917f-2afdb1f686bc	1	Silver Band Ring	Simple silver band	2999.00	Silver	None	3.00	24	ring2.jpg	2026-07-01 15:21:37.589174	\N	\N	\N	0.00	t	2026-07-02 16:00:55.80138
541753f3-e331-4cf5-9aac-e11788459482	1	Gold Solitaire Ring	22kt gold solitaire ring	15999.00	Gold	Diamond	4.50	20	ring1.jpg	2026-07-01 15:21:37.589174	\N	\N	\N	0.00	t	2026-07-03 15:43:54.930298
\.

--

COPY public.reviews (id, user_id, product_id, rating, review, created_at) FROM stdin;
4b55b56c-5a02-472e-b351-ea29cc8b9e24	dc856d9c-6adf-452c-9cca-c387afc7bb75	541753f3-e331-4cf5-9aac-e11788459482	5	Absolutely stunning ring, very high quality gold!	2026-07-02 15:23:21.640596
e7711034-31bf-4d18-bfb6-c9bb0ef54188	842e2264-61c7-4942-bd7f-6f86bd7a9e19	b04cbf7f-62e6-40ba-b539-758cb08bc366	4	Beautiful diamond studs, fast delivery too.	2026-07-02 15:23:21.640596
2538ca38-11f2-4c9a-ac8c-5a4836dfa2f9	dc856d9c-6adf-452c-9cca-c387afc7bb75	4614703c-2120-42de-a746-4c268731bbee	5	Love the bracelet, perfect as a gift.	2026-07-02 15:23:21.640596
\.

--

COPY public.users (id, full_name, email, password_hash, phone, role, profile_image, is_verified, created_at, updated_at) FROM stdin;
dc856d9c-6adf-452c-9cca-c387afc7bb75	Priya Sharma	priya@gmail.com	hashedpass1	9876543210	CUSTOMER	\N	t	2026-07-01 15:20:45.300977	2026-07-01 15:20:45.300977
842e2264-61c7-4942-bd7f-6f86bd7a9e19	Rahul Mehta	rahul@gmail.com	hashedpass2	9876543211	CUSTOMER	\N	f	2026-07-01 15:20:45.300977	2026-07-01 15:20:45.300977
177e5b03-c856-4833-9e96-20a075dea855	Admin User	admin@mks.com	hashedpass3	9876543212	ADMIN	\N	t	2026-07-01 15:20:45.300977	2026-07-01 15:20:45.300977
\.

--

COPY public.wishlist (id, user_id, created_at) FROM stdin;
a0000001-0000-0000-0000-000000000001	dc856d9c-6adf-452c-9cca-c387afc7bb75	2026-07-02 15:18:20.718476
a0000002-0000-0000-0000-000000000002	842e2264-61c7-4942-bd7f-6f86bd7a9e19	2026-07-02 15:18:20.718476
\.

--

COPY public.wishlist_items (id, wishlist_id, product_id, created_at) FROM stdin;
03a1928d-f47c-4de9-8faf-aef72c038c79	a0000001-0000-0000-0000-000000000001	b04cbf7f-62e6-40ba-b539-758cb08bc366	2026-07-02 15:20:49.713544
a4388d1a-e328-4bc2-b6d7-af5589c0b16b	a0000001-0000-0000-0000-000000000001	4614703c-2120-42de-a746-4c268731bbee	2026-07-02 15:20:49.713544
c9a117c3-4217-41c8-9c15-77a68237e60c	a0000002-0000-0000-0000-000000000002	541753f3-e331-4cf5-9aac-e11788459482	2026-07-02 15:20:49.713544
\.

