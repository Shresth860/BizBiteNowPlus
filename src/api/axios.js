import axios from "axios";
import { notifyError, getApiErrorMessage } from "../utils/toast";
import { categories } from "../data/products";
import { festiveMenuData } from "../data/festiveMenuData";

const demoProducts = categories.flatMap((category) => category.products).map((product, index) => ({
  ...product,
  _id: `demo-product-${product.id}`,
  is_available: index % 4 !== 0,
  available: index % 4 !== 0,
  stock: index % 4 !== 0 ? 25 : 0,
}));
const demoCartItems = demoProducts.slice(0, 2).map((product, index) => ({
  product_id: product.id,
  name: product.name,
  image: product.image,
  price: product.price,
  quantity: index + 1,
  tax_percent: 5,
}));
const demoOrders = [
  {
    _id: "demo-order-1001",
    orderId: "#ORD-1001",
    customer_name: "Rahul Sharma",
    customer_phone: "9876543210",
    items: demoCartItems,
    total_amount: 799,
    amount: 799,
    status: "Delivered",
    order_status: "Delivered",
    delivery_status: "Delivered",
    payment_status: "Paid",
    payment_method: "Cash",
    order_type: "delivery",
    delivery_boy_id: "rider-1",
    delivery_address: "22 Green Park Road, New Delhi",
    subtotal: 760,
    tax_amount: 39,
    createdAt: "2026-09-04T10:25:00.000Z",
  },
  {
    _id: "demo-order-1002",
    orderId: "#ORD-1002",
    customer_name: "Priya Singh",
    customer_phone: "9988776655",
    items: [demoCartItems[0]],
    total_amount: 499,
    amount: 499,
    status: "Preparing",
    order_status: "Preparing",
    delivery_status: "Preparing",
    payment_status: "Paid",
    payment_method: "Online",
    order_type: "delivery",
    delivery_boy_id: "rider-1",
    delivery_address: "8 Business Avenue, New Delhi",
    subtotal: 475,
    tax_amount: 24,
    createdAt: "2026-09-04T10:42:00.000Z",
  },
];
const demoTables = [
  { _id: "table-1", table_number: "T1", table_token: "demo-t1", is_active: true, seats: 2 },
  { _id: "table-2", table_number: "T2", table_token: "demo-t2", is_active: true, seats: 4 },
  { _id: "table-3", table_number: "T3", table_token: "demo-t3", is_active: false, seats: 6 },
];
const demoAddresses = [
  { _id: "address-1", label: "Home", address: "22 Green Park Road", mohalla: "Central Market", city: "New Delhi", pincode: "110016", default: true },
  { _id: "address-2", label: "Work", address: "8 Business Avenue", mohalla: "Connaught Place", city: "New Delhi", pincode: "110001", default: false },
];
const demoNotifications = [
  { _id: "notification-1", title: "Order is being prepared", message: "Your Paneer Tikka is on the way from the kitchen.", createdAt: "2026-09-04T10:45:00.000Z", is_read: false },
  { _id: "notification-2", title: "Welcome to BizBite Kitchen", message: "Enjoy 10% off your next order with code WELCOME10.", createdAt: "2026-09-04T09:15:00.000Z", is_read: true },
];
const demoDiscounts = [
  { _id: "discount-1", code: "WELCOME10", title: "Welcome Offer", discount_type: "percentage", discount_value: 10, is_active: true, valid_until: "2026-12-31" },
  { _id: "discount-2", code: "FAMILY150", title: "Family Feast", discount_type: "fixed", discount_value: 150, is_active: true, valid_until: "2026-10-31" },
];
const demoDeliveryBoys = [
  { _id: "rider-1", name: "Arjun Mehta", phoneNumber: "9812345678", is_available: true, active_orders: 1 },
  { _id: "rider-2", name: "Neha Kapoor", phoneNumber: "9898765432", is_available: false, active_orders: 2 },
];
const demoStaff = [
  { _id: "staff-1", name: "Aarav Singh", email: "aarav@bizbite.demo", role: "Manager", status: "Active" },
  { _id: "staff-2", name: "Meera Joshi", email: "meera@bizbite.demo", role: "Cashier", status: "Active" },
];
const demoStore = {
  _id: "demo-store",
  seller_id: "demo-seller",
  store_profile: {
    store_name: "BizBite Kitchen",
    theme_colors: { primary: "#16522D", secondary: "#14bb54", accent: "#F5F5F5" },
  },
  business_info: { business_type: "Restaurant" },
  contact_info: { business_email: "hello@bizbitekitchen.demo", primary_phone: "+91 98765 43210", address: "22 Green Park Road", city: "New Delhi", state: "Delhi" },
  is_open: true,
  tier: "PLUS",
};
const demoLandingSections = [
  { section_key: "hero", order: 1, is_active: true, data: { heading: "Good food, right on time", subheading: "Fresh meals from BizBite Kitchen", banners: [{ image: demoProducts[5].image }] } },
  { section_key: "top_selling", order: 2, is_active: true, data: { title: "Customer favourites", mode: "auto", product_ids: [] } },
  { section_key: "offers", order: 3, is_active: true, data: { title: "Today's offers" } },
  { section_key: "festive_deals", order: 4, is_active: true, data: { title: "Celebrate with us" } },
  { section_key: "categories", order: 5, is_active: true, data: { title: "Browse categories" } },
  { section_key: "about_us", order: 6, is_active: true, data: { title: "Made with care", description: "Thoughtful recipes, quality ingredients, and quick service." } },
  { section_key: "testimonials", order: 7, is_active: true, data: { title: "Loved by regulars", testimonials: [{ name: "Priya Singh", text: "Fresh, fast, and delicious every time.", rating: 5 }] } },
  { section_key: "gallery", order: 8, is_active: true, data: { title: "A taste of our kitchen", images: demoProducts.slice(0, 4).map((product) => product.image) } },
  { section_key: "store_info", order: 9, is_active: true, data: { title: "Visit BizBite Kitchen" } },
  { section_key: "stats", order: 10, is_active: true, data: { title: "Why diners choose us", stats: [{ label: "Happy diners", value: "2,500+" }, { label: "Average rating", value: "4.8/5" }] } },
  { section_key: "faq", order: 11, is_active: true, data: { title: "Frequently asked questions", faqs: [{ question: "Do you offer takeaway?", answer: "Yes, takeaway orders are ready in minutes." }] } },
  { section_key: "newsletter", order: 12, is_active: true, data: { title: "Get the next tasty update" } },
  { section_key: "footer", order: 13, is_active: true, data: { copyright_text: "© 2026 BizBite Kitchen" } },
];

const getDemoData = (config) => {
  const path = config.url || "";

  if (path.includes("/customer/store/") || path === "/seller/me") {
    return { success: true, data: demoStore, seller: demoStore };
  }

  if (path.includes("/products/update/")) {
    const productId = path.split("/").pop();
    const current = demoProducts.find((product) => product._id === productId) || demoProducts[0];
    const nextAvailable = config.data?.get?.("is_available");
    return { success: true, product: { ...current, is_available: nextAvailable !== "false", available: nextAvailable !== "false" } };
  }

  if (path.includes("/products/") || path.includes("/menu/")) {
    return {
      success: true,
      data: demoProducts,
      products: demoProducts,
      categories: categories.map(({ id, name }) => ({ _id: String(id), id, name })),
    };
  }

  if (path.includes("/cart")) {
    return { success: true, cart: { items: demoCartItems }, items: demoCartItems, data: demoCartItems };
  }

  if (path.includes("/orders") || path.includes("/my-orders")) {
    if (path.includes("/orders/customers")) {
      return { success: true, customers: [
        { name: "Rahul Sharma", phone: "9876543210", orders: 24, totalSpent: 12480, lastOrderAt: "2026-09-03T13:30:00.000Z" },
        { name: "Priya Singh", phone: "9988776655", orders: 14, totalSpent: 7820, lastOrderAt: "2026-09-02T18:15:00.000Z" },
        { name: "Aman Verma", phone: "9898989898", orders: 8, totalSpent: 3960, lastOrderAt: "2026-08-29T12:00:00.000Z" },
      ], data: [] };
    }
    if (path.includes("/dashboard/counters")) {
      return { success: true, counters: { totalOrders: 128, unassignedCount: 6, assignedCount: 11, deliveredCount: 96, totalRevenue: 86450 } };
    }
    if (path.includes("/dashboard/clusters")) {
      return { success: true, clusters: [{ name: "Lunch Rush", count: 18 }, { name: "Evening Orders", count: 12 }] };
    }
    return { success: true, data: demoOrders, orders: demoOrders };
  }

  if (path.includes("/seller/analytics/")) {
    if (path.includes("revenue-trend")) return { success: true, data: [{ month: "Apr", revenue: 42000 }, { month: "May", revenue: 51000 }, { month: "Jun", revenue: 64000 }, { month: "Jul", revenue: 72000 }, { month: "Aug", revenue: 86450 }] };
    if (path.includes("yoy-comparison")) return { success: true, data: { current: 86450, previous: 68200, growth: 26.8 } };
    return { success: true, data: [{ name: "Food", value: 72 }, { name: "Beverages", value: 18 }, { name: "Desserts", value: 10 }] };
  }

  if (path.includes("/booking/")) {
    const bookings = [{ _id: "booking-1", table_number: "T2", customer_name: "Priya Singh", customer_phone: "9988776655", guest_count: 4, date: "2026-09-05", start_time: "19:30", end_time: "21:00", status: "confirmed" }];
    return { success: true, tables: demoTables, bookings, booking: bookings[0], data: bookings };
  }

  if (path.includes("/tables/")) return { success: true, tables: demoTables, table: demoTables[0], data: demoTables };
  if (path.includes("/deliveryBoy/")) return { success: true, deliveryBoys: demoDeliveryBoys, data: demoDeliveryBoys };
  if (path.includes("/staff")) return { success: true, staff: demoStaff, data: demoStaff };
  if (path.includes("/festive-deals")) return { success: true, deals: festiveMenuData, data: festiveMenuData };
  if (path.includes("/banners")) return { success: true, banners: [{ _id: "banner-1", title: "Weekend Feast", image: demoProducts[5].image, is_active: true }] };
  if (path.includes("/customer/address")) return { success: true, addresses: demoAddresses, data: demoAddresses };
  if (path.includes("/customer/mohallas")) return { success: true, mohallas: ["Central Market", "Connaught Place", "Green Park"], data: ["Central Market", "Connaught Place", "Green Park"] };
  if (path.includes("/notifications/")) return { success: true, notifications: demoNotifications, data: demoNotifications, unreadCount: 1 };
  if (path.includes("/discounts")) return { success: true, discounts: demoDiscounts, data: demoDiscounts };
  if (path.includes("/landing-page/")) return { success: true, landingPage: { title: "Good food, right on time", subtitle: "Fresh meals from BizBite Kitchen", is_published: true, sections: demoLandingSections }, availableData: { products: demoProducts, categories: categories.map(({ id, name }) => ({ _id: String(id), id, name })), festiveDeals: festiveMenuData.map((deal) => ({ ...deal, _id: String(deal.id), title: deal.name, banner_image: deal.banner, end_date: deal.endsOn })), discounts: demoDiscounts, storeInfo: demoStore } };

  if (path.includes("/menu-categories/") || path.includes("/categories/")) {
    const demoCategories = categories.map(({ id, name }) => ({ _id: String(id), id, name }));
    return { success: true, data: demoCategories, categories: demoCategories };
  }

  if (path.includes("/loyalty/") || path.includes("/rewards/")) {
    return { success: true, data: { stampsCollected: 6, threshold: 10, points: 240 }, settings: { points_per_order: 10, reward_threshold: 100, reward_value: 100 }, coupons: demoDiscounts };
  }

  return { success: true, data: [], items: [], products: [], categories: [] };
};

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL,

  adapter: async (config) => ({
    data: getDemoData(config),
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  }),

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Reads the token from the Zustand-persisted auth store (see src/store/authStore.js),
// avoiding a circular import while keeping a single source of truth for the token.
function getStoredToken() {
  try {
    const raw = localStorage.getItem("bizbite-auth");
    return raw ? JSON.parse(raw)?.state?.token || null : null;
  } catch {
    return null;
  }
}

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("bizbite-auth");
    }

   
    const meta = error.config?.meta;
    if (meta?.toastError && error.response?.status !== 401) {
      const fallback =
        typeof meta.toastError === "string" ? meta.toastError : undefined;
      notifyError(getApiErrorMessage(error, fallback), {
        key: meta.toastKey,
      });
    }

    return Promise.reject(error);
  },
);

export default API;
