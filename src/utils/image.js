const PLACEHOLDER =
  "https://via.placeholder.com/500x750/e5e7eb/6b7280?text=No+Image";

export const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath.trim() === "") return PLACEHOLDER;
  if (imagePath.startsWith("http")) return imagePath;
  return `${import.meta.env.VITE_BE_HOST}/images/${imagePath}`;
};
