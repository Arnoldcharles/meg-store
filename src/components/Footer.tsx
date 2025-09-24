"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6 md:px-12 lg:px-20 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="Meg Store Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-white">Meg Store</span>
          </div>
          <p className="text-sm">
            Your one-stop shop for fresh groceries, best deals, and quality
            products delivered to your door.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-green-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-green-400 transition"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-400 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-400 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@megstore.com
            </li>
          </ul>
        </div>

        {/* Socials + Payment */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4 mb-6">
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>

          {/* Payment Methods */}
          <h3 className="text-lg font-semibold text-white mb-4">We Accept</h3>
          <div className="flex space-x-4 mb-6">
            <FaCcVisa size={32} className="text-blue-500" />
            <FaCcMastercard size={32} className="text-red-500" />
            <FaCcPaypal size={32} className="text-yellow-400" />
          </div>

          {/* App Store Links */}
          <h3 className="text-lg font-semibold text-white mb-4">
            App coming soon!
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Image
              src="/google-play.png"
              alt="Google Play"
              width={140}
              height={40}
              className="cursor-pointer hover:opacity-80"
            />
            <Image
              src="/app-store.png"
              alt="App Store"
              width={140}
              height={40}
              className="cursor-pointer hover:opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Meg Store. All rights reserved.
      </div>
    </footer>
  );
}
