import { CategoryPage } from "@/components/CategoryPage";
import type { Tag } from "@/data/projects";
import { notFound } from "next/navigation";

const validTags = ["digital", "creative", "interiors"];

export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;

  if (!validTags.includes(tag)) {
    notFound();
  }

  return <CategoryPage tag={tag as Tag} />;
}

export function generateStaticParams() {
  return validTags.map((tag) => ({ tag }));
}
