CREATE TABLE public.cart (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cart_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    price_at_time numeric(10,2),
    subtotal numeric(10,2),
    CONSTRAINT check_cartitem_price CHECK ((price_at_time > (0)::numeric)),
    CONSTRAINT check_cartitem_qty CHECK ((quantity > 0)),
    CONSTRAINT check_cartitem_subtotal CHECK ((subtotal > (0)::numeric))
);

CREATE TABLE public.categories (
    category_id integer CONSTRAINT categories_id_not_null NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    image_url text,
    created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.products (
    product_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id integer,
    name character varying(150) NOT NULL,
    description text,
    base_price numeric(10,2) NOT NULL,
    metal_type character varying(50),
    gemstone character varying(50),
    weight_grams numeric(6,2),
    stock_quantity integer DEFAULT 0,
    image_url text,
    created_at timestamp without time zone DEFAULT now(),
    sku character varying(100),
    brand character varying(100),
    discount_price numeric(10,2),
    rating numeric(3,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_price_positive CHECK ((base_price > (0)::numeric)),
    CONSTRAINT check_stock_nonnegative CHECK ((stock_quantity >= 0))
);

CREATE TABLE public.order_items (
    order_item_id integer NOT NULL,
    order_id uuid,
    product_id uuid,
    quantity integer,
    price_at_purchase numeric(10,2),
    CONSTRAINT check_quantity_positive CHECK ((quantity > 0))
);

CREATE TABLE public.orders (
    order_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    address_id integer,
    total_amount numeric(10,2),
    status character varying(30),
    created_at timestamp without time zone DEFAULT now(),
    payment_status character varying(30) DEFAULT 'pending'::character varying,
    order_status character varying(30) DEFAULT 'pending'::character varying,
    shipping_address text,
    order_date timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_status_valid CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[])))
);

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    phone character varying(20),
    role public.user_role DEFAULT 'CUSTOMER'::public.user_role,
    profile_image text,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    order_id uuid,
    payment_method character varying(30),
    payment_status character varying(30),
    paid_at timestamp without time zone,
    transaction_id character varying(100),
    amount numeric(10,2)
);

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    rating integer NOT NULL,
    review text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT check_rating_range CHECK (((rating >= 1) AND (rating <= 5)))
);


CREATE TABLE public.wishlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.wishlist_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    wishlist_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.addresses (
    address_id integer NOT NULL,
    user_id uuid,
    address_line1 character varying(200),
    city character varying(100),
    state character varying(100),
    pincode character varying(10),
    country character varying(100),
    full_name character varying(100),
    phone character varying(15),
    address_line2 character varying(200),
    is_default boolean DEFAULT false
);