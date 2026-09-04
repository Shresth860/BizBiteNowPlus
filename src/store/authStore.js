import { create } from "zustand";
import { persist } from "zustand/middleware";
import API from "../services/api";
import { requestFcmToken } from "../firebase";

localStorage.removeItem("bizbite-auth");
localStorage.setItem("seller_id", "demo-seller");
localStorage.setItem("customer_phone", "9999999999");

const useAuthStore = create(
  persist(
    (set) => ({
      // STATES

      user: { name: "Demo Customer", phone: "9999999999", role: "customer" },
      token: "demo-token",
      role: "customer",
      profile: { customer_name: "Demo Customer", customer_phone: "9999999999", seller_id: "demo-seller" },

      loading: false,
      error: null,

      verificationToken: null,
      reqId: null,
      loginRole: null, // role returned by login/init, used to decide OTP vs direct PIN

      isAuthenticated: true,

      // LOGIN INIT (Step 1 - checks role, sends OTP if Seller)

      loginInit: async (payload) => {
        try {
          set({ loading: true, error: null });

          const res = await API.post("/users/login/init", payload);
          const data = res.data;

          set({
            loginRole: data.role || data.data?.role || null,
            reqId: data.reqId || data.data?.reqId || null,
          });

          return data;
        } catch (err) {
          set({ error: err.response?.data?.message || "Unable to continue" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // LOGIN

      login: async (payload) => {
        try {
          set({ loading: true, error: null });

          const res = await API.post("/users/login", payload);
          const data = res.data;

          set({
            token: data.token,
            user: data.user,
            role: data.user?.role,
            profile: data.profile,
            isAuthenticated: true,
          });

          requestFcmToken()
            .then((fcmToken) => {
              if (fcmToken) {
                API.post("/users/update-fcm-token", { fcm_token: fcmToken });
              }
            })
            .catch((err) => console.error("FCM sync failed:", err.message));

          return data;
        } catch (err) {
          set({ error: err.response?.data?.message || "Login failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // REGISTER SELLER

      registerSeller: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/admin/register-seller", payload);
          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || "Registration failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // REGISTER CUSTOMER

      registerCustomer: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/customer/register", payload);

          requestFcmToken()
            .then((fcmToken) => {
              if (fcmToken) {
                API.post("/users/update-fcm-token", { fcm_token: fcmToken });
              }
            })
            .catch((err) => console.error("FCM sync failed:", err.message));

          return res.data;
        } catch (err) {
          set({ error: err.response?.data?.message || "Registration failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // SEND OTP

      sendOTP: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/send-otp", payload);
          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // VERIFY OTP

      verifyOTP: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/verify-otp", payload);

          set({ verificationToken: res.data.verificationToken });

          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // RESEND OTP

      resendOTP: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/resend-otp", payload);
          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // VERIFY ACCESS TOKEN

      verifyAccessToken: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/verify-access-token", payload);
          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // FORGOT PIN

      forgotPin: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/forgot-pin", payload);
          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // RESET PIN

      resetPin: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/reset-pin", payload);
          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // CHANGE PIN

      changePin: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await API.post("/users/change-pin", payload);
          return res.data;
        } finally {
          set({ loading: false });
        }
      },

      // PATCH PROFILE (local update after a successful save, no re-login needed)

      setProfile: (patch) => {
        set((state) => ({ profile: { ...state.profile, ...patch } }));
      },

      // LOGOUT

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          profile: null,
          verificationToken: null,
          reqId: null,
          loginRole: null,
          isAuthenticated: false,
          error: null,
        });

        // Other parts of the app fall back to reading these raw keys
        // directly instead of the (now-cleared) store state — leaving them
        // behind lets the next person on a shared device inherit the
        // previous user's seller/customer identity.
        [
          "seller_id",
          "current_seller_id",
          "seller",
          "customer_phone",
          "customer_token",
          "customerId",
          "resolvedTable",
          "bizbite_customer_cart",
          "token",
          "user",
          "appliedCoupon",
        ].forEach((key) => localStorage.removeItem(key));

        // cartStore persists itself under "bizbite_customer_cart" — removing
        // the raw key above isn't enough, its in-memory state would just
        // write itself straight back on the next render. Dynamic import to
        // avoid a circular import (cartStore imports this store).
        import("../api/stores/customerstore/cartStore").then((m) =>
          m.default.getState().clearCart(),
        );
      },
    }),

    {
      name: "bizbite-auth",
    },
  ),
);

export default useAuthStore;
