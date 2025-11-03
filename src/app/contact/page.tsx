"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useToast } from "@/components/ToastProvider";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast("Please fill all fields", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
        addToast("Message sent — we'll get back to you soon", "success");
      } else {
        addToast(data.error || "Failed to send message", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-700 mb-8" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          Contact & Support
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <motion.div className="lg:col-span-1 bg-white rounded-xl p-6 shadow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-semibold mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-6">Questions, order help, or custom requests — we're here to help. Reach out using the form or the channels below.</p>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-sm">arnoldcharles028@gmail.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaPhone className="text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-sm">+234 902 331 1459</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-sm">24 Ebinpejo St, Lagos City, Nigeria</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaClock className="text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Hours</div>
                  <div className="text-sm">Mon - Fri: 8:00am - 6:00pm</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a aria-label="Facebook" className="p-2 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100"><FaFacebookF /></a>
              <a aria-label="Twitter" className="p-2 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100"><FaTwitter /></a>
              <a aria-label="Instagram" className="p-2 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100"><FaInstagram /></a>
            </div>
          </motion.div>

          <motion.form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl p-6 shadow space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {success && <div className="text-center text-green-600 font-semibold">Message sent successfully — thanks!</div>}

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Full name</span>
                <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Your full name" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="you@example.com" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-gray-600">Message</span>
              <textarea name="message" value={form.message} onChange={handleChange} rows={6} className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="How can we help?" />
            </label>

            <div className="flex items-center gap-4">
              <button type="submit" disabled={loading} className={`px-6 py-3 rounded-md text-white ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                {loading ? "Sending..." : "Send Message"}
              </button>
              <button type="button" onClick={() => { setForm({ name: "", email: "", message: "" }); setSuccess(false); }} className="px-4 py-2 rounded-md border">Reset</button>
            </div>

            <div className="mt-4">
              <h3 className="text-sm text-gray-500 mb-2">Our location</h3>
              <div className="w-full h-48 bg-gray-100 rounded overflow-hidden">
                {/* Map placeholder — replace with embedded Google Maps iframe if desired */}
                <iframe title="Office location" className="w-full h-full border-0" src="https://maps.google.com/maps?q=Lagos%20Nigeria&t=&z=13&ie=UTF8&iwloc=&output=embed" />
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
