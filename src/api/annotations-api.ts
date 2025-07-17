const annotationsUrl = "https://eb1b6f8bfab448df91c68bd442d6a968.api.mockbin.io/annotations";

export const PostAnnotation = async (payload: {
  imageId: number;
  annotations: {
    categoryId: number;
    boundingBoxes: {
      topLeftX: number;
      topLeftY: number;
      width: number;
      height: number;
    }[];
  }[];
}) => {
  try {
    const response = await fetch(annotationsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const result = await response.json();
    console.log("Reponse", result)
    return result;
  } catch (error) {
    console.error(`Error posting the annotation: ${error}`);
    throw error;
  }
};
