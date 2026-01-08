import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";
import { getProducts, getCategories, Category, Product } from "@/lib/db/products";
import { ProductFilters } from "@/components/product/ProductFilters";
import { formatPrice } from "@/lib/utils";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;
  const categoryFilter = searchParams?.category;
  const sortOption = searchParams.sort;
  const searchQuery = searchParams.search;
  const currentPage = Number(searchParams.page) || 1;
  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;
  const LIMIT = 6;

  const products = await getProducts({
    category: categoryFilter,
    sort: sortOption,
    search: searchQuery,
    page: currentPage,
    limit: LIMIT,
    minPrice,
    maxPrice,
  });

  // Quick fetch to check if next page exists (naive approach)
  const nextPageProducts = await getProducts({
    category: categoryFilter,
    sort: sortOption,
    search: searchQuery,
    page: currentPage + 1,
    limit: LIMIT,
    minPrice,
    maxPrice,
  });

  const hasMore = nextPageProducts.length > 0;

  // ... (categories fetch)
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <div className="flex flex-row no-scrollbar md:flex-col gap-2 overflow-x-auto">
              <Link
                href="/products"
                className={`block text-sm md:border-0 whitespace-nowrap border rounded-full px-4 py-2 w-auto md:rounded-none ${
                  !categoryFilter
                    ? "font-bold text-primary border-primary"
                    : "text-muted-foreground hover:text-foreground border-muted"
                }`}
              >
                All Categories
              </Link>
              {categories.map((category: Category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className={`block text-sm md:border-0 whitespace-nowrap border rounded-full px-4 py-2 w-auto md:rounded-none ${
                    categoryFilter === category.slug
                      ? "font-bold text-primary border-primary"
                      : "text-muted-foreground hover:text-foreground border-muted"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <Separator />
          <ProductFilters />
          <Separator />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : categoryFilter
                ? categories.find((c: Category) => c.slug === categoryFilter)
                    ?.name || "Products"
                : "All Products"}
            </h1>
            {/* Only show page number if there are multiple pages (more than 6 products) */}
            {(currentPage > 1 || hasMore) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden group relative">
                {/* ... Existing Card Content ... */}
                <Link
                  href={`/products/${product.id}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {product.name}</span>
                </Link>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 z-20">New</Badge>
                  )}
                </div>
                <CardContent className="p-4 pt-4">
                  <h3 className="font-semibold text-lg leading-tight group-hover:underline line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize mt-1">
                    {product.category}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <span className="font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="z-20 relative"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No products found.
                </p>
                {currentPage > 1 && (
                  <Link href="/products">
                    <Button variant="link" className="mt-2">
                      Back to first page
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Pagination - Only show if there are multiple pages */}
          {(currentPage > 1 || hasMore) && (
            <div className="flex justify-center mt-12 space-x-2">
              <Link
                href={{
                  pathname: "/products",
                  query: { ...searchParams, page: currentPage - 1 },
                }}
                passHref
              >
                <Button variant="outline" disabled={currentPage <= 1}>
                  Previous
                </Button>
              </Link>
              <Link
                href={{
                  pathname: "/products",
                  query: { ...searchParams, page: currentPage + 1 },
                }}
                passHref
              >
                <Button variant="outline" disabled={!hasMore}>
                  Next
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
