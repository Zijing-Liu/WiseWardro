export function getJson(message) {
  const jsonPattern = /```json\n([\s\S]*?)\n```/g; // Pattern to match JSON blocks
  const jsonData = [];

  let match;
  while ((match = jsonPattern.exec(message)) !== null) {
    try {
      const parsedData = JSON.parse(match[1]);
      jsonData.push(...parsedData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  }

  return jsonData;
}
