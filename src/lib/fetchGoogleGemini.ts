export async function fetchGoogleGemini(imageBase64: string) {
  try {
    const response = await fetch("https://api.google.dev/gemini/vision", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from Google Gemini: ${response.statusText}`,
      );
    }

    const data = await response.json();

    return {
      measure_uuid: data.guid,
      measure_value: data.value,
      image_url: data.image_url,
    };
  } catch (error) {
    console.error("Error fetching from Google Gemini:", error);
    throw new Error("Failed to process image with Google Gemini API");
  }
}
