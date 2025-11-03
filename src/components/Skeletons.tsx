"use client";

export function ProductSkeleton() {
  return (
    <div className="animate-pulse p-4 bg-gray-100 rounded-lg">
      <div className="bg-gray-300 h-40 rounded-md" />
      <div className="mt-4 h-4 bg-gray-300 rounded w-3/4" />
      <div className="mt-2 h-3 bg-gray-300 rounded w-1/2" />
      <div className="mt-4 h-8 bg-gray-300 rounded w-full" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
  );
}

export default ProductSkeleton;
