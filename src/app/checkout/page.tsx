"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { saveOrder, generateOrderId } from "@/lib/orders";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ToastProvider";
import countryStateData from "@/lib/countryState";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart, getDeliveryFee, getGrandTotal } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    zip: "",
    country: "",
    state: "",
  });

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

  const handlePayment = () => {
    if (!window.FlutterwaveCheckout) {
      alert("Payment system not loaded yet. Please try again.");
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
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);

    // generate a stable order id and use it as the payment tx_ref so the provider and our records match
    const orderId = generateOrderId(user?.uid ? String(user.uid).slice(0, 6) : undefined);

    window.FlutterwaveCheckout({
      public_key: "FLWPUBK-f581b6f4a50dfa5f033d7e823ec7211c-X",
      tx_ref: orderId,
      amount: getGrandTotal(),
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
          const subtotal = Number(getCartTotal().toFixed(2));
          const deliveryFee = Number(getDeliveryFee().toFixed(2));
          const order = {
            id: response.tx_ref || orderId,
            userId: user?.uid || null,
            items: cart,
            subtotal,
            deliveryFee,
            total: Number((subtotal + deliveryFee).toFixed(2)),
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
                addToast("Payment successful! Order sent to admin.", "success", 3000);
                clearCart();
              })
            .catch((err) => {
              console.error("SendGrid email error:", err);
                addToast("Payment succeeded but failed to notify admin. Contact support.", "error", 5000);
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
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
          <input
            type="number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="Zip Code"
            className="w-full p-3 border rounded"
          />

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
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 border rounded p-6 shadow"
        >
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>₦{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-green-600 text-lg">
            <span>Total:</span>
            <span>₦{getCartTotal().toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            className={`w-full px-6 py-3 rounded-lg shadow mt-4 text-white flex justify-center items-center gap-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading && (
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
            )}
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
