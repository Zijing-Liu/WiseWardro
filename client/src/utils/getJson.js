export const getJson = (str) => {
  // Regular expression to match JSON objects enclosed within square brackets
  // Regular expression to extract the JSON array of objects
  const regex = /\[\{.*?\}\]/gs;
  const matches = str.match(regex);
  if (matches && matches.length > 0) {
    const jsonArray = JSON.parse(matches[0]);
    console.log("json", jsonArray);
    return jsonArray;
  } else {
    console.log("No JSON array found");
    return null;
  }
};

// Example usage:
// getJson(str);
