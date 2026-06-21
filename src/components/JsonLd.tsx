/**
 * Renders a JSON-LD <script> for structured data. Server-safe (no client hooks)
 * so it serializes into the initial HTML where crawlers can read it.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
