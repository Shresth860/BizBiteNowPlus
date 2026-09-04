import { create } from "zustand";
import API from "../../../services/api";

const extractId = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return String(
    item.id ||
      item._id ||
      item.product_id?._id ||
      item.product_id?.id ||
      item.product_id ||
      "",
  );
};

const useCartStore = create((set, get) => ({
  items: [],
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get("/cart");
      const serverItems =
        res.data?.cart?.items || res.data?.items || res.data?.data;

      if (Array.isArray(serverItems)) {
        set({ items: serverItems, cart: res.data?.cart || res.data?.data });
      } else {
        set({ items: [], cart: null });
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      set({
        error: err.response?.data?.message || "Failed to load cart",
        items: [],
        cart: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productData, quantity = 1) => {
    const targetId = extractId(productData);
    if (!targetId) return;

    const addQty = Number(quantity || productData?.quantity || 1);

    const variant = productData?.selectedVariant || null;
    const addons = productData?.selectedAddons || [];

    const hasBaseOffer =
      productData?.offer_price !== null &&
      productData?.offer_price !== undefined;
    const hasVariantOffer =
      variant?.offer_price !== null && variant?.offer_price !== undefined;

    try {
      const payload = {
        product_id: targetId,
        quantity: addQty,
        price: hasBaseOffer
          ? Number(productData.offer_price)
          : Number(productData.price || 0),
        ...(hasBaseOffer && { offer_price: Number(productData.offer_price) }),
        ...(variant && {
          variant_name: variant.name || variant.variant_name,
          price_delta: Number(variant.price_delta) || 0,
          ...(hasVariantOffer && { offer_price: Number(variant.offer_price) }),
        }),
        ...(addons.length > 0 && {
          addons: addons.map((a) => ({
            name: a.name || a,
            price: Number(a.price) || 0,
          })),
        }),
      };

      const res = await API.post("/cart/add", payload);
      const updatedCart = res.data?.cart || res.data?.data;

      if (updatedCart && Array.isArray(updatedCart.items)) {
        set({ cart: updatedCart, items: updatedCart.items });
      } else {
        await get().fetchCart();
      }
      return res.data;
    } catch (err) {
      console.error("Add to Cart API error:", err);
      throw err;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const targetId = String(itemId);
    const newQty = Number(quantity);

    try {
      const res = await API.patch(`/cart/item/${targetId}`, {
        quantity: newQty,
      });
      const updatedCart = res.data?.cart || res.data?.data;

      if (updatedCart && Array.isArray(updatedCart.items)) {
        set({ cart: updatedCart, items: updatedCart.items });
      } else {
        await get().fetchCart();
      }
      return res.data;
    } catch (err) {
      console.error("Update Cart Quantity API error:", err);
      throw err;
    }
  },

  setInstruction: async (itemId, text) => {
    const targetId = String(itemId);

    set((state) => ({
      items: state.items.map((i) =>
        String(i._id || i.id) === targetId
          ? { ...i, special_instructions: text }
          : i,
      ),
    }));

    try {
      const res = await API.patch(`/cart/item/${targetId}`, {
        special_instructions: text,
      });
      const updatedCart = res.data?.cart || res.data?.data;

      if (updatedCart && Array.isArray(updatedCart.items)) {
        set({ cart: updatedCart, items: updatedCart.items });
      }
      return res.data;
    } catch (err) {
      console.error("Set Instruction API error:", err);
      throw err;
    }
  },

  removeItem: async (itemId) => {
    const targetId = String(itemId);

    try {
      const res = await API.delete(`/cart/item/${targetId}`);
      const updatedCart = res.data?.cart || res.data?.data;

      if (updatedCart && Array.isArray(updatedCart.items)) {
        set({ cart: updatedCart, items: updatedCart.items });
      } else {
        await get().fetchCart();
      }
      return res.data;
    } catch (err) {
      console.error("Remove Cart Item API error:", err);
      throw err;
    }
  },

  clearCart: async () => {
    set({ items: [], cart: null });
    try {
      await API.delete("/cart/clear");
    } catch (err) {
      console.error("Clear Cart API error:", err);
      throw err;
    }
  },

  updateCartItem: async (itemId, quantity) =>
    get().updateQuantity(itemId, quantity),
  removeCartItem: async (itemId) => get().removeItem(itemId),
}));

export default useCartStore;
