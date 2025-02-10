export async function fetchUnsplashPhoto(query: string): Promise<string> {
    try {
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      if (!accessKey) {
        console.error("No Unsplash Access Key found in ENV!");
        return "";
      }
  
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&per_page=1`
      );
  
      if (!response.ok) {
        console.error("Unsplash API error:", await response.text());
        return "";
      }
  
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        return "";
      }
  
      // Return the "regular" sized URL (or any other size in data.results[0].urls)
      return data.results[0].urls.regular ?? "";
    } catch (err) {
      console.error("Failed to fetch from Unsplash:", err);
      return "";
    }
  }
  