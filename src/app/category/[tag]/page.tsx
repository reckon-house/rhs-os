import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { categoryInfo, type Tag } from "@/data/projects";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { notFound } from "next/navigation";

const validTags = ["digital", "creative", "interiors"];

// First sentence of a body paragraph, clamped to a search-friendly length.
function metaDescription(text: string, max = 165): string {
  const flat = text.replace(/\s+/g, " ").trim();
  const end = flat.indexOf(". ");
  const sentence = end === -1 ? flat : flat.slice(0, end + 1);
  if (sentence.length <= max) return sentence;
  const cut = sentence.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  if (!validTags.includes(tag)) return {};

  const info = categoryInfo[tag as Tag];
  const title = info.headline.replace(/\s+/g, " ").replace(/\.$/, "").trim();
  const description = metaDescription(info.body);
  const url = `${SITE_URL}/category/${tag}`;
  const image = info.heroes?.[0]?.image;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

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
