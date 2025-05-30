// /home/ubuntu/corretor_site/lib/sanity.client.ts
import { createClient } from "next-sanity";

// IMPORTANT: Replace these values with your actual Sanity project details
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "YOUR_PROJECT_ID";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-05-30"; // Use a recent date

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: typeof document === "undefined", // server-side is statically generated, the CDN is fine
  // perspective: 'published', // Use 'published' for production, 'previewDrafts' for preview
});

