/**
 * Formats a category string by extracting the part after the last dot and capitalizing it.
 * Example: "Categories.agriculture" -> "Agriculture"
 */
export const formatCategory = (categoryStr: string): string => {
  if (!categoryStr) return '';
  
  // Extract part after the last dot
  const parts = categoryStr.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Capitalize first letter
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};
