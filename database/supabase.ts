import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Gets all image URLs from the home_carousel folder in your bucket
 * @returns Array of public image URLs
 */
export async function getHomeCarouselImages(): Promise<string[]> {
  try {
    // List all files in the home_carousel folder
    const { data: files, error } = await supabase.storage
      .from("images") // Replace 'images' with your actual bucket name if different
      .list("home_carousel");

    if (error) {
      console.error("Error fetching carousel images:", error);
      return [];
    }

    if (!files || files.length === 0) {
      console.log("No carousel images found");
      return [];
    }

    // Get public URLs for all image files
    const imageUrls = files
      .filter(
        (file) =>
          // Filter out folders and hidden files
          !file.name.startsWith(".") &&
          // Only include image files
          (file.name.toLowerCase().endsWith(".jpg") ||
            file.name.toLowerCase().endsWith(".jpeg") ||
            file.name.toLowerCase().endsWith(".png") ||
            file.name.toLowerCase().endsWith(".webp") ||
            file.name.toLowerCase().endsWith(".gif"))
      )
      .map((file) => {
        const { data } = supabase.storage
          .from("images") // Replace 'images' with your actual bucket name if different
          .getPublicUrl(`home_carousel/${file.name}`);

        return data.publicUrl;
      });

    return imageUrls;
  } catch (error) {
    console.error("Failed to fetch carousel images:", error);
    return [];
  }
}

/**
 * Gets a single image URL from a specific folder
 * @param folderName The name of the folder in the images bucket
 * @returns The public URL of the image or null if not found
 */
export async function getSingleImageFromFolder(
  folderName: string
): Promise<string | null> {
  try {
    // List all files in the specified folder
    const { data: files, error } = await supabase.storage
      .from("images") // Replace 'images' with your actual bucket name if different
      .list(folderName);

    if (error) {
      console.error(`Error fetching image from ${folderName}:`, error);
      return null;
    }

    if (!files || files.length === 0) {
      console.log(`No images found in ${folderName}`);
      return null;
    }

    // Find the first image file
    const imageFile = files.find(
      (file) =>
        !file.name.startsWith(".") &&
        (file.name.toLowerCase().endsWith(".jpg") ||
          file.name.toLowerCase().endsWith(".jpeg") ||
          file.name.toLowerCase().endsWith(".png") ||
          file.name.toLowerCase().endsWith(".webp") ||
          file.name.toLowerCase().endsWith(".gif"))
    );

    if (!imageFile) {
      console.log(`No valid image found in ${folderName}`);
      return null;
    }

    // Get the public URL for the image
    const { data } = supabase.storage
      .from("images") // Replace 'images' with your actual bucket name if different
      .getPublicUrl(`${folderName}/${imageFile.name}`);

    return data.publicUrl;
  } catch (error) {
    console.error(`Failed to fetch image from ${folderName}:`, error);
    return null;
  }
}

/**
 * Fetches all rooms from the database
 * @returns Array of room objects
 */
export async function getRooms() {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("price");

    if (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    return [];
  }
}

// Existing function to update hero carousel images in Supabase
export async function updateHeroCarouselImages(
  images: string[]
): Promise<void> {
  // Your existing code to update images in Supabase

  // After successfully updating in Supabase, also update the cache
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("heroImages", JSON.stringify(images));
    } catch (error) {
      console.error("Error updating cached hero images:", error);
    }
  }
}

export default supabase;
