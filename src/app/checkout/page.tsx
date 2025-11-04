"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { saveOrder, generateOrderId } from "@/lib/orders";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ToastProvider";
import countryStateData from "@/lib/countryState";
import { coupons, getProductById } from "@/lib/products";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart, getDeliveryFee, getGrandTotal } =
    useCart();
  const { updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    zip: "",
    country: "",
    state: "",
  });

  const [agreed, setAgreed] = useState(false);
  const AGREED_KEY = "meg_store_agreed";

  // restore agreed flag from localStorage for the session
  useEffect(() => {
    try {
      const v = localStorage.getItem(AGREED_KEY);
      if (v !== null) setAgreed(v === "true");
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  const setAgreedAndPersist = (value: boolean) => {
    setAgreed(value);
    try {
      localStorage.setItem(AGREED_KEY, value ? "true" : "false");
    } catch (e) {}
  };

  const [states, setStates] = useState<string[]>([]);

  // Update states when country changes
  useEffect(() => {
    const country = countryStateData.countries.find(
      (c) => c.name === form.country
    );
    setStates(country ? country.states : []);
    setForm((prev) => ({ ...prev, state: "" }));
  }, [form.country]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto-fill form from logged-in user
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: (user as any).name || (user as any).displayName || prev.name,
      email: (user as any).email || prev.email,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const c = (coupons as any)[code];
    if (!c) {
      try {
        addToast("Invalid coupon code", "error", 1800);
      } catch (e) {}
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(c);
    try {
      addToast(`Coupon ${code} applied`, "success", 1800);
    } catch (e) {}
  };

  const handlePayment = () => {
    if (!window.FlutterwaveCheckout) {
      try {
        addToast(
          "Payment system not loaded yet. Please try again.",
          "error",
          3000
        );
      } catch (e) {}
      return;
    }

    if (
      !form.name ||
      !form.email ||
      !form.address ||
      !form.phone ||
      !form.zip ||
      !form.country ||
      !form.state
    ) {
      try {
        addToast("Please fill all required fields.", "error", 3000);
      } catch (e) {}
      return;
    }

    if (!agreed) {
      try {
        addToast(
          "You must agree to the Terms & Privacy Policy to complete this purchase.",
          "error",
          3500
        );
      } catch (e) {}
      setLoading(false);
      return;
    }

    setLoading(true);

    // generate a stable order id and use it as the payment tx_ref so the provider and our records match
    const orderId = generateOrderId(
      user?.uid ? String(user.uid).slice(0, 6) : undefined
    );

    // compute totals (accounting for per-product discounts and coupon)
    const rawSubtotal = Number(getCartTotal().toFixed(2));
    const perProductDiscount = cart.reduce((sum, it) => {
      const p = getProductById(it.id) || (it as any);
      const d = (p as any).discount || 0;
      return sum + it.price * it.quantity * (d / 100);
    }, 0);
    const subtotalAfterProductDiscount = rawSubtotal - perProductDiscount;

    let couponDiscount = 0;
    if (appliedCoupon) {
      const c = appliedCoupon as any;
      if (c.appliesTo === "order" && c.type === "percent") {
        couponDiscount = subtotalAfterProductDiscount * (c.value / 100);
      } else if (c.appliesTo === "category" && c.type === "percent") {
        const catTotal = cart.reduce((s, it) => {
          const p = getProductById(it.id) || (it as any);
          return p.category === c.category ? s + it.price * it.quantity : s;
        }, 0);
        couponDiscount = catTotal * (c.value / 100);
      } else if (c.appliesTo === "product" && c.type === "fixed") {
        const prod = cart.find((it) => it.id === c.productId);
        couponDiscount = prod ? c.value * prod.quantity : 0;
      }
    }

    const deliveryFee = Number(getDeliveryFee().toFixed(2));
    const totalAmount = Number(
      (subtotalAfterProductDiscount - couponDiscount + deliveryFee).toFixed(2)
    );

    window.FlutterwaveCheckout({
      public_key: "FLWPUBK-f581b6f4a50dfa5f033d7e823ec7211c-X",
      tx_ref: orderId,
      amount: totalAmount,
      currency: "NGN",
      payment_options:
        "card, account, banktransfer, ussd, nqr, internetbanking, opay, payattitude, enaira, barter, mobilemoneyghana, mobilemoneyuganda, mobilemoneyrwanda, mobilemoneyzambia, mobilemoneytanzania, mobilemoneyfranco, mpesa, paga, applepay, googlepay, paypal, ach, credit",
      customer: {
        email: form.email,
        name: form.name,
        phone_number: form.phone,
      },
      customizations: {
        title: "Meg Store Checkout",
        description: "Payment for your order",
        logo: "/hero4.png",
      },
      callback: function (response: any) {
        if (response.status === "successful") {
          // build order object and persist locally (per-user). Use orderId (tx_ref) so it's consistent.
          const subtotal = rawSubtotal;
          const order = {
            id: response.tx_ref || orderId,
            userId: user?.uid || null,
            items: cart,
            subtotal,
            perProductDiscount: Number(perProductDiscount.toFixed(2)),
            couponDiscount: Number(couponDiscount.toFixed(2)),
            deliveryFee,
            total: totalAmount,
            appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
            status: "pending",
            createdAt: Date.now(),
            trackingNumber: response.flw_ref || undefined,
          };
          try {
            saveOrder(order as any);
          } catch (e) {}

          fetch("/api/sendOrderEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer_name: form.name,
              customer_email: form.email,
              customer_address: form.address,
              customer_phone: form.phone,
              customer_country: form.country,
              customer_state: form.state,
              order_items: cart
                .map((i) => `${i.name} x${i.quantity}`)
                .join(", "),
              total_amount: getGrandTotal().toFixed(2),
              order_id: order.id,
            }),
          })
            .then((res) => res.json())
            .then(() => {
              addToast(
                "Payment successful! Order sent to admin.",
                "success",
                3000
              );
              clearCart();
            })
            .catch((err) => {
              console.error("SendGrid email error:", err);
              addToast(
                "Payment succeeded but failed to notify admin. Contact support.",
                "error",
                5000
              );
            })
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
          addToast("Payment failed or cancelled.", "error", 2500);
        }
      },
      onclose: function () {
        setLoading(false);
        console.log("Payment closed");
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty!</h1>
        <p className="text-gray-600 mb-6">
          Add products to your cart and come back here to complete your order.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/products"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Browse products
          </a>
          <a href="/" className="border px-4 py-2 rounded">
            Return home
          </a>
        </div>
      </div>
    );
  }

  // computed totals for display (same logic as used for payment)
  const rawSubtotal = Number(getCartTotal().toFixed(2));
  const perProductDiscount = cart.reduce((sum, it) => {
    const p = getProductById(it.id) || (it as any);
    const d = (p as any).discount || 0;
    return sum + it.price * it.quantity * (d / 100);
  }, 0);
  const subtotalAfterProductDiscount = rawSubtotal - perProductDiscount;

  let couponDiscount = 0;
  if (appliedCoupon) {
    const c = appliedCoupon as any;
    if (c.appliesTo === "order" && c.type === "percent") {
      couponDiscount = subtotalAfterProductDiscount * (c.value / 100);
    } else if (c.appliesTo === "category" && c.type === "percent") {
      const catTotal = cart.reduce((s, it) => {
        const p = getProductById(it.id) || (it as any);
        return p.category === c.category ? s + it.price * it.quantity : s;
      }, 0);
      couponDiscount = catTotal * (c.value / 100);
    } else if (c.appliesTo === "product" && c.type === "fixed") {
      const prod = cart.find((it) => it.id === c.productId);
      couponDiscount = prod ? c.value * prod.quantity : 0;
    }
  }

  const deliveryFee = Number(getDeliveryFee().toFixed(2));
  const totalAmount = Number(
    (subtotalAfterProductDiscount - couponDiscount + deliveryFee).toFixed(2)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Summary & Cart Items */}
        <div className="lg:col-span-7 bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Order</h2>
            <div className="text-sm text-gray-500">{cart.length} items</div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto border-b pb-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-4"
              >
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.category}
                      </div>
                    </div>
                    <div className="font-semibold text-green-600">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <div className="px-3">{item.quantity}</div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        try {
                          addToast(`${item.name} removed`, "info", 1500);
                        } catch (e) {}
                      }}
                      className="ml-4 text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Have a coupon?
            </label>
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={applyCoupon}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-2 text-sm text-green-700">
                Applied:{" "}
                <span className="font-medium">{appliedCoupon.code}</span>
              </div>
            )}

            {/* Agreement checkbox in the order summary (left column) */}
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreedAndPersist(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <a href="/terms" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>
        </div>

        {/* Right: Shipping & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-3">Shipping Information</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full p-3 border rounded"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="p-3 border rounded"
                />
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  placeholder="Zip code"
                  className="p-3 border rounded"
                />
              </div>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Select Country</option>
                {countryStateData.countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                disabled={!states.length}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Payment</h3>
            <div className="text-sm text-gray-600 mb-4">
              You will be redirected to our secure payment partner to complete
              the purchase.
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>₦{rawSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Product Discounts</span>
                <span className="text-green-600">
                  -₦{perProductDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery</span>
                <span>₦{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Coupon Discount</span>
                <span className="text-green-600">
                  -₦{couponDiscount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>₦{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={loading}
              className={`w-full mt-4 py-3 rounded-lg text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-green-600"
              }`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Pay Securely"
              )}
            </motion.button>

            <div className="mt-4 text-xs text-gray-500">
              <div>Secure payment powered by Flutterwave.</div>
              <div className="mt-2">
                By completing this purchase, you agree to our{" "}
                <a href="/terms" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline">
                  Privacy Policy
                </a>
                .
              </div>
              <label className="mt-3 flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              <div>Charges will be applied for payment processing.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
