export const validatePassage = (passage) => {
  if (passage.content_type === "text" && !passage.content.trim()) {
    return "Passage text is required.";
  }
  if (passage.content_type === "image" && !passage.file) {
    return "Passage image is required.";
  }
  return "";
};
