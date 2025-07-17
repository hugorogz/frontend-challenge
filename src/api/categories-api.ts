import { categoriesUrl } from "../utils";

export const GetCategories = async () => {
  try {
    const response = await fetch(categoriesUrl);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    
    const results = await response.json();
    return results
  } catch (error) {
    console.error(`Error fetching the Categories: ${error}`);
  }
};