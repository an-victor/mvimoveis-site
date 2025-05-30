// /home/ubuntu/corretor_site/lib/sanity.queries.ts
import { groq } from "next-sanity";

// ================= Settings =================
export const settingsQuery = groq`
  *[_type == "settings"][0]{
    ...,
    "logoUrl": logo.asset->url,
    "aboutImageUrl": aboutImage.asset->url,
    bannerImages[]{ ..., asset-> },
    testimonials[]{
      ...,
      "clientImageUrl": clientImage.asset->url
    }
  }
`

// ================= Properties =================
// Query to get all property slugs
export const propertyPathsQuery = groq`
  *[_type == "property" && defined(slug.current)][].slug.current
`;

// Query to get a single property by slug
export const propertyBySlugQuery = groq`
  *[_type == "property" && slug.current == $slug][0]{
    ...,
    "mainImageUrl": mainImage.asset->url,
    "galleryUrls": gallery[].asset->url
    // Add other fields needed for the detail page
  }
`;

// Query to get featured properties for the homepage
export const featuredPropertiesQuery = groq`
  *[_type == "property" && isFeatured == true] | order(_createdAt desc) [0...3] { // Limit to 3 featured
    _id,
    title,
    slug,
    location,
    price,
    area,
    bedrooms,
    bathrooms,
    mainImage{asset->{url}},
    "mainImageUrl": mainImage.asset->url // Keep for compatibility if used elsewhere
  }
`;

// Query to get paginated properties for the listing page
export const paginatedPropertiesQuery = groq`
  {
    "properties": *[_type == "property"] | order(_createdAt desc) [$start...$end] {
      _id,
      title,
      slug,
      location,
      price,
      area,
      bedrooms,
      bathrooms,
      mainImage{asset->{url}},
      "mainImageUrl": mainImage.asset->url // Keep for compatibility
    },
    "totalProperties": count(*[_type == "property"])
  }
`;

// Query to get total count of properties (can be combined as above)
// export const propertiesCountQuery = groq`
//   count(*[_type == "property"])
// `;
