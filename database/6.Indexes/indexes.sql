-- ==========================================
-- MKS E-Commerce Database
-- 6: Indexes
-- ==========================================

CREATE INDEX idx_addresses_user ON public.addresses USING btree (user_id);


--


CREATE INDEX idx_cart_user ON public.cart USING btree (user_id);


--


CREATE INDEX idx_cartitems_cart ON public.cart_items USING btree (cart_id);


--


CREATE INDEX idx_categories_name ON public.categories USING btree (name);


--


CREATE INDEX idx_orderitems_order ON public.order_items USING btree (order_id);


--


CREATE INDEX idx_orderitems_product ON public.order_items USING btree (product_id);


--


CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--


CREATE INDEX idx_orders_user ON public.orders USING btree (user_id);


--


CREATE INDEX idx_payments_order ON public.payments USING btree (order_id);


--


CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--


CREATE INDEX idx_products_name ON public.products USING btree (name);


--


CREATE INDEX idx_products_price ON public.products USING btree (base_price);


--


CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);


--


CREATE INDEX idx_reviews_user ON public.reviews USING btree (user_id);


--


CREATE INDEX idx_users_email ON public.users USING btree (email);


--


CREATE INDEX idx_wishlist_user ON public.wishlist USING btree (user_id);


--


CREATE INDEX idx_wishlistitems_wishlist ON public.wishlist_items USING btree (wishlist_id);

