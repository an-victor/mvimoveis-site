// /home/ubuntu/corretor_site/lib/sanity.client.ts
import { createClient } from "next-sanity";

// IMPORTANT: Replace these values with your actual Sanity project details
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "98pdr6kx";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-05-30"; // Use a recent date
export const token = process.env.SANITY_API_TOKEN; // "skuZlhjQitawRtPSS0kSoGCYabb4rKFhcKV8ejubwqc864KZ34lTn4EEFliMAIo1zO0AewQPvuxR2PlX9JuBVQtHvpTHRWzTx5obauDAi7aV5Ml7pXCah1bTc7dLR1BKLeUVbpmSKmqIFGRfV4i9lY6reRXf70ivnqxIu57kXxRySDmn8IpX";

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: typeof document === "undefined", // server-side is statically generated, the CDN is fine
  // perspective: 'published', // Use 'published' for production, 'previewDrafts' for preview
});

