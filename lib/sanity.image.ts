// /home/ubuntu/corretor_site/lib/sanity.image.ts
import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "./sanity.client";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

// Updated urlForImage function to be more robust
export const urlForImage = (source: Image | any | undefined) => {
  // Check if source is valid and has an asset with a reference (_ref or _id)
  if (!source || !source.asset || !(source.asset._ref || source.asset._id)) {
    // console.warn("Invalid image source provided to urlForImage:", source);
    return undefined;
  }

  // If valid, return the image builder instance
  return imageBuilder?.image(source).auto("format").fit("max");
};

