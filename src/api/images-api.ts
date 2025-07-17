import { imagesUrl } from "../utils";

export const GetImages = async () => {
  try {
    const response = await fetch(imagesUrl);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const results = await response.json();
    return results
  } catch (error) {
    console.error(`Error fetching the Images: ${error}`);
  }
};