"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "CEO & Founder",
    image: "/team/alice.png",
  },
  {
    name: "Brian Smith",
    role: "Head of Operations",
    image: "/team/brian.png",
  },
  {
    name: "Catherine Lee",
    role: "Marketing Lead",
    image: "/team/catherine.png",
  },
  {
    name: "David Kim",
    role: "Product Manager",
    image: "/team/david.png",
  },
];

const statsData = [
  { label: "Products Sold", value: 12000 },
  { label: "Happy Customers", value: 8500 },
  { label: "Daily Orders", value: 1500 },
  { label: "Years of Excellence", value: 2 },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-20">
      {/* Page Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Meg Store
      </motion.h1>

      {/* Content Section */}
      <motion.div
        className="grid lg:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-green-600">Our Mission</h2>
          <p className="text-gray-700">
            Meg Store aims to provide the best online shopping experience for
            all your grocery and daily needs.
          </p>

          <h2 className="text-2xl font-semibold text-green-600">Who We Are</h2>
          <p className="text-gray-700">
            Founded in 2025, Meg Store has grown into a trusted online store for
            thousands of happy customers.
          </p>

          <h2 className="text-2xl font-semibold text-green-600">
            Why Choose Us
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Wide selection of high-quality products</li>
            <li>Fast and reliable delivery</li>
            <li>Secure and simple checkout</li>
            <li>Responsive customer support</li>
          </ul>
        </div>

        {/* Image */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/about-us.png"
            alt="About Meg Store"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </motion.div>
      </motion.div>

      {/* Team Section */}
      <div className="space-y-12">
        <motion.h2
          className="text-3xl font-bold text-center text-green-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Meet Our Team
        </motion.h2>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 text-center space-y-2">
                <h3 className="text-lg font-semibold text-green-600">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats / Achievements Section */}
      <motion.div
        className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 bg-green-50 rounded-lg p-10 text-center shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            className="space-y-2"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-4xl font-bold text-green-600">
              <CountUp end={stat.value} duration={9} separator="," />
            </h3>
            <p className="text-gray-700 font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="text-3xl font-semibold text-green-600 mb-4">
          Join Our Community
        </h2>
        <p className="text-gray-700 mb-6">
          Subscribe to our newsletter and stay updated on latest products and
          deals!
        </p>
        <a
          href="/newsletter"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Subscribe Now
        </a>
      </motion.div>
    </div>
  );
}
