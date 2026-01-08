import { getProducts, getCategories } from "@/lib/db/products";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { NewsletterForm } from "@/components/home/Newsletter";

export default async function Home() {
  const featuredProducts = await getProducts({ featured: true });
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Categories */}
      <CategoryGrid categories={categories} />

      {/* Newsletter CTA */}
      <NewsletterForm />

      {/* <div className="container mx-auto px-4">
        <SeedButton />
      </div> */}
    </div>
  );
}
