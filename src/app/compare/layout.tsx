import type { Metadata } from "next";

/* The page itself is a client component and cannot export metadata, so
   the noindex lives here. It is a bench, not a portfolio page: nothing
   about it should ever turn up in a search result next to the work. */
export const metadata: Metadata = {
  title: "Model comparison bench",
  robots: { index: false, follow: false },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
