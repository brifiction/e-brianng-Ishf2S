import { RACE_CATEGORIES } from "@/types/racing";

export function getCategoryName(categoryId: string): string {
  const category = RACE_CATEGORIES.find((cat) => cat.id === categoryId);
  return category?.displayName || "Unknown";
}
