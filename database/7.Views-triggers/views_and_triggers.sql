-- ==========================================
-- MKS E-Commerce Database
-- 7: Views and Triggers
-- ==========================================


-- Views

CREATE VIEW public.low_stock_products AS
 SELECT p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    p.stock_quantity,
        CASE
            WHEN (p.stock_quantity = 0) THEN 'OUT OF STOCK'::text
            ELSE ' LOW STOCK'::text
        END AS alert
   FROM (public.products p
     JOIN public.categories c ON ((p.category_id = c.category_id)))
  WHERE (p.stock_quantity < 5)
  ORDER BY p.stock_quantity;


ALTER VIEW public.low_stock_products OWNER TO postgres;



CREATE VIEW public.order_summary AS
 SELECT o.order_id,
    u.full_name AS customer_name,
    u.email,
    o.total_amount,
    o.status,
    o.created_at AS order_date,
    count(oi.order_item_id) AS total_items
   FROM ((public.orders o
     JOIN public.users u ON ((o.user_id = u.id)))
     JOIN public.order_items oi ON ((o.order_id = oi.order_id)))
  GROUP BY o.order_id, u.full_name, u.email, o.total_amount, o.status, o.created_at;


ALTER VIEW public.order_summary OWNER TO postgres;


CREATE VIEW public.product_catalogue AS
 SELECT p.product_id,
    p.name AS product_name,
    c.name AS category_name,
    p.base_price,
    p.discount_price,
    p.metal_type,
    p.gemstone,
    p.stock_quantity,
    p.image_url,
        CASE
            WHEN (p.stock_quantity = 0) THEN 'Out of Stock'::text
            WHEN (p.stock_quantity < 5) THEN 'Low Stock'::text
            ELSE 'In Stock'::text
        END AS stock_status
   FROM (public.products p
     JOIN public.categories c ON ((p.category_id = c.category_id)));


ALTER VIEW public.product_catalogue OWNER TO postgres;

CREATE VIEW public.product_review_summary AS
 SELECT p.product_id,
    p.name AS product_name,
    count(r.id) AS total_reviews,
    round(avg(r.rating), 1) AS average_rating,
    max(r.created_at) AS last_reviewed_at
   FROM (public.products p
     LEFT JOIN public.reviews r ON ((p.product_id = r.product_id)))
  GROUP BY p.product_id, p.name;


ALTER VIEW public.product_review_summary OWNER TO postgres;

CREATE VIEW public.revenue_summary AS
 SELECT count(DISTINCT order_id) AS total_orders,
    sum(total_amount) AS total_revenue,
    round(avg(total_amount), 2) AS avg_order_value,
    count(DISTINCT user_id) AS unique_customers
   FROM public.orders o
  WHERE ((status)::text <> 'cancelled'::text);


ALTER VIEW public.revenue_summary OWNER TO postgres;


CREATE VIEW public.user_cart_summary AS
 SELECT u.id AS user_id,
    u.full_name,
    c.id AS cart_id,
    count(ci.id) AS total_items,
    COALESCE(sum(ci.subtotal), (0)::numeric) AS cart_total
   FROM ((public.users u
     LEFT JOIN public.cart c ON ((u.id = c.user_id)))
     LEFT JOIN public.cart_items ci ON ((c.id = ci.cart_id)))
  GROUP BY u.id, u.full_name, c.id;


ALTER VIEW public.user_cart_summary OWNER TO postgres;



-- ==========================================
-- Trigger Functions
-- ==========================================


CREATE FUNCTION public.decrease_stock_on_order() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE product_id = NEW.product_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.decrease_stock_on_order() OWNER TO postgres;



CREATE FUNCTION public.restore_stock_on_cancel() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only runs when status changes TO cancelled
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE products p
        SET stock_quantity = stock_quantity + oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.order_id
          AND p.product_id = oi.product_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.restore_stock_on_cancel() OWNER TO postgres;



CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;




-- Triggers


CREATE TRIGGER trigger_decrease_stock AFTER INSERT ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.decrease_stock_on_order();

--

CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

--

CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

--

CREATE TRIGGER trigger_restore_stock AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.restore_stock_on_cancel();

