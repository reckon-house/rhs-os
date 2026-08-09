/**
 * ItemCard — A.R.C.'s own component, running in the case study.
 *
 * Ported from client/src/components/ui/item-card.tsx in the A.R.C.
 * codebase. This is the real thing, not a drawing of it: same markup,
 * same classes, same interaction. A reader clicking it is clicking the
 * product.
 *
 * WHAT CHANGED ON THE WAY IN, and nothing else:
 * - The `Button` import went. It was dead in the original too.
 * - lucide's Edit and Trash became inline SVGs. Two glyphs did not
 *   justify a whole icon library in this bundle, and they are the
 *   library's own paths.
 * - The server bits are gone: no signed-URL branch, no
 *   /api/thumbnail/:id endpoint, no document-count JSON parse. The demo
 *   holds items in local state, so a thumbnail is just a src.
 * - `Item` was a type import from @shared/schema. Declared here instead.
 *
 * WHAT DID NOT CHANGE is the interesting part. Every Tailwind class in
 * the original is stock core — gray-500, rounded-2xl, space-y-2 — and
 * this app's palette lives entirely in inline styles. RHS's @theme only
 * ADDS semantic tokens and never redefines Tailwind's own, so the two
 * systems pass through each other untouched. The card also sets its
 * font inline (Avenir Next, A.R.C.'s real secondary face), which is why
 * .pressing's Helvetica cannot reach its text.
 *
 * Kept deliberately: the emoji stripper, the image-error fallback, the
 * stopPropagation on the action buttons, the Enter/Space key handling.
 * Those are the product's real behaviour and a demo that quietly drops
 * them is a mock-up wearing the component's name.
 */

import { useState } from "react";

export interface DemoItem {
  id: number;
  name: string;
  category: string | null;
  estimatedValue: number | null;
  imageUrl?: string | null;
  /** how many receipts/appraisals are attached — drives the corner badge */
  documentCount?: number;
}

interface ItemCardProps {
  item: DemoItem;
  onEdit: (item: DemoItem) => void;
  onDelete: (itemId: number) => void;
  showThumbnail?: boolean;
  previewMode?: boolean;
  className?: string;
}

/* lucide-react's own paths for `edit-3` and `trash-2`, inlined. */
const IconEdit = () => (
  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  showThumbnail = true,
  previewMode = false,
  className,
}: ItemCardProps) {
  const [imageError, setImageError] = useState(false);

  // Remove emojis from category names for display
  const removeEmoji = (text: string) =>
    text
      .replace(
        /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
        ""
      )
      .trim();

  const documentCount = item.documentCount ?? 0;

  // Tapping anywhere on the card body opens the edit/detail view — discoverable
  // and matches user expectation (previously only the pencil icon and thumbnail
  // worked, the title/category/value area was inert). The Edit/Delete action
  // buttons stopPropagation so they don't double-fire onEdit.
  const handleCardClick = () => {
    if (previewMode) return;
    onEdit(item);
  };

  return (
    <div
      className={`relative rounded-2xl p-4 transition-shadow ${className || ""} ${
        previewMode ? "" : "cursor-pointer"
      }`}
      style={{ backgroundColor: className ? undefined : "#FFFFFF" }}
      onClick={handleCardClick}
      role={previewMode ? undefined : "button"}
      tabIndex={previewMode ? undefined : 0}
      onKeyDown={(e) => {
        if (previewMode) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(item);
        }
      }}
    >
      {/* Document Count Badge - Top Left Corner of Thumbnail */}
      {showThumbnail && documentCount > 0 && (
        <div className="absolute top-1 left-1 w-6 h-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center z-10">
          {documentCount}
        </div>
      )}

      {/* Action Buttons - Absolute Top Right, Stacked Vertically */}
      {!previewMode && (
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Edit item"
          >
            <IconEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Delete item"
          >
            <IconTrash />
          </button>
        </div>
      )}

      {/* Large Thumbnail - Top Left */}
      {showThumbnail && (
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 mb-3">
          {item.imageUrl && !imageError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              ?
            </div>
          )}
        </div>
      )}

      {/* Item Details - Stacked Vertically */}
      <div className="pr-16">
        <h3
          className="text-black leading-tight mb-1"
          style={{ fontFamily: "Avenir Next, sans-serif", fontSize: "18px", fontWeight: "600" }}
        >
          {item.name}
        </h3>
        <p
          className="text-gray-500 mb-2"
          style={{ fontFamily: "Avenir Next, sans-serif", fontSize: "14px", fontWeight: "400" }}
        >
          {removeEmoji(item.category || "")}
        </p>
        <p
          className="text-black"
          style={{ fontFamily: "Avenir Next, sans-serif", fontSize: "16px", fontWeight: "600" }}
        >
          ${item.estimatedValue?.toLocaleString() || "0"}
        </p>
      </div>
    </div>
  );
}
