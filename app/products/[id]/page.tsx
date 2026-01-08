import Link from "next/link";

import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Star, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { getProductById, getProducts } from "@/lib/db/products";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { BuyNowButton } from "@/components/BuyNowButton";
import { formatPrice } from "@/lib/utils";

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const product = await getProductById(params.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <Link
        href="/products"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Images */}
        <ProductImageGallery
          images={[product.image, ...product.images]}
          name={product.name}
        />

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <div>
            {product.isNew && <Badge className="mb-2">New Arrival</Badge>}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Features:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 disabled:opacity-50">
            <AddToCartButton product={product} />
            <BuyNowButton product={product} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free Shipping
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 1 Year Warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getProducts({ featured: true });
  return products.map((product) => ({
    id: product.id,
  }));
}
