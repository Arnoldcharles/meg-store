import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanner from "@/components/PromoBanner";
import PromoImageBanner from "@/components/PromoImageBanner";
import DealsOfTheDay from "@/components/DealsOfTheDay";
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoBanner />
      <PromoImageBanner /*imageUrl="/promo-banner.png" link="/products"*/ />
      {/*<DealsOfTheDay />*/}
      <NewArrivals />
      <Newsletter />
      {/* Add other sections below */}
    </main>
  );
}
