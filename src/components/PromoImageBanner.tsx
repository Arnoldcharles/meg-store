"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PromoImageBannerProps {
  imageUrl?: string;
  altText?: string;
  link?: string;
}

export default function PromoImageBanner({
  imageUrl,
  altText = "Promotional Banner",
  link,
}: PromoImageBannerProps) {
  const BannerContent = () =>
    imageUrl ? (
      <Image
        src={imageUrl}
        alt={altText}
        width={1200}
        height={400}
        className="w-full h-auto object-cover"
        priority
      />
    ) : (
      <div className="w-full h-52 md:h-72 lg:h-80 bg-gradient-to-r from-green-500 via-lime-500 to-yellow-400 flex items-center justify-center text-center text-white">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold drop-shadow-md">
            🛒 Special Offer Coming Soon
          </h2>
          <p className="mt-2 text-lg md:text-xl">
            Stay tuned for amazing grocery deals!
          </p>
        </div>
      </div>
    );

  return (
    <section className="py-8 px-4 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl overflow-hidden shadow-lg cursor-pointer"
      >
        {link ? (
          <a href={link}>
            <BannerContent />
          </a>
        ) : (
          <BannerContent />
        )}
      </motion.div>
    </section>
  );
}
